from flask import Blueprint

bp = Blueprint("main", __name__)


@bp.route("/")
def home():
    return {"status": 200, "message": "Hello, World!"}, 200
