from flask import Flask

from app.routes import main_bp
from app.utils import global_error_handler


def create_app():
    app = Flask(__name__)

    app.register_blueprint(main_bp)

    app.register_error_handler(Exception, global_error_handler)

    return app
