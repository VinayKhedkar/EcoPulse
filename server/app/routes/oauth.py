import os
import jwt
import secrets
import datetime
from flask import Blueprint, url_for, redirect, jsonify, session
from authlib.integrations.flask_client import OAuth
from app.utils import AppError

oauth = OAuth()

bp = Blueprint("oauth", __name__, url_prefix="/oauth")

# Configure Google OAuth
google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile", "prompt": "select_account"},
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
)


@bp.route("/login/google")
def login():
    """Initiate Google OAuth flow with secure nonce"""
    nonce = secrets.token_urlsafe(32)
    session["google_nonce"] = nonce
    session.modified = True

    redirect_uri = url_for("oauth.callback", _external=True)
    return google.authorize_redirect(redirect_uri, nonce=nonce)


@bp.route("/login/callback")
def callback():
    """Handle Google OAuth callback with validation"""
    # Verify we received an access token
    token = google.authorize_access_token()
    if not token or "id_token" not in token:
        raise AppError("Invalid token response from Google", 400)

    # Validate nonce
    nonce = session.pop("google_nonce", None)
    if not nonce:
        raise AppError("Security violation: missing nonce", 403)

    # Parse and validate ID token
    user_info = google.parse_id_token(token, nonce=nonce)

    # Validate required user info
    if "email" not in user_info or not user_info["email"]:
        raise AppError("Google didn't provide required user information", 400)

    # Generate JWT token
    jwt_secret = os.getenv("JWT_SECRET")
    if not jwt_secret:
        raise AppError("Server configuration error", 500)

    jwt_token = jwt.encode(
        {
            "email": user_info["email"],
            "name": user_info.get("name", ""),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        },
        jwt_secret,
        algorithm="HS256",
    )

    return jsonify(
        {
            "status": "success",
            "message": "Authentication successful",
            "jwt": jwt_token,
            "user": {
                "email": user_info["email"],
                "name": user_info.get("name", ""),
                "picture": user_info.get("picture", ""),
            },
        }
    )


def init_oauth(app):
    """Initialize OAuth with security settings"""
    if not app.secret_key:
        app.secret_key = os.getenv("FLASK_SECRET_KEY", secrets.token_urlsafe(32))

    app.config.update(
        {
            "SESSION_COOKIE_SECURE": os.getenv("FLASK_ENV") == "production",
            "SESSION_COOKIE_HTTPONLY": True,
            "SESSION_COOKIE_SAMESITE": "Lax",
        }
    )

    oauth.init_app(app)
