from flask import Blueprint, request
import requests
from bs4 import BeautifulSoup

from app.middleware.auth import protected
from app.utils import AppError

from app.constants import ARTICLES

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/user/me", methods=["GET"])
@protected
def get_user_info():

    return {
        "status": 200,
        "message": "User information retrieved successfully",
        "data": request.user,
    }, 200


@bp.route("/articles", methods=["GET"])
def get_articles():
    try:
        page = int(request.args.get("page", 1))
    except ValueError:
        page = 1

    res = requests.get(ARTICLES(page))

    if res.status_code != 200:
        raise AppError("Failed to fetch articles from the source.", 500)

    data = get_articles_data(res)

    return {
        "status": 200,
        "message": "Articles fetched successfully",
        "data": data,
    }, 200


def get_articles_data(res):
    soup = BeautifulSoup(res.text, "html.parser")
    articles = soup.find("div", class_="herald-posts").find_all("article")
    data = []
    for article in articles:
        link = article.find("a")["href"]
        title = article.find("h2").get_text()
        image = article.find("img", class_="attachment-herald-lay-b1")
        image_url = image.get("data-lazy-src") or image.get("src")
        description = article.find("p").get_text()
        data.append(
            {"title": title, "link": link, "image": image_url, "description": description}
        )

    return data
