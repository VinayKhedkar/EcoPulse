from flask import Flask
import os


from app.routes import main_bp, model_bp, oauth_bp, init_oauth
from app.utils import not_found_error_handler, global_error_handler


def create_app():
    app = Flask(__name__)

    app.secret_key = os.getenv("FLASK_SECRET_KEY")

    init_oauth(app)

    app.register_blueprint(main_bp)
    app.register_blueprint(model_bp)
    app.register_blueprint(oauth_bp)

    app.register_error_handler(404, not_found_error_handler)

    app.register_error_handler(Exception, global_error_handler)

    return app
