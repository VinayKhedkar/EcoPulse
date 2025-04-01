from flask import Blueprint, request

from app.utils import AppError, decode_jwt
from app.middleware.auth import protected

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/user/me", methods=["GET"])
@protected
def get_user_info():
    
    return {
        "status": 200,
        "message": "User information retrieved successfully",
        "data": request.user,
    }, 200
