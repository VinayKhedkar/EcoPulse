from flask import Blueprint, request
import numpy as np
import io
from PIL import Image

bp = Blueprint("model", __name__, url_prefix="/model")


@bp.route("/predict", methods=["POST"])
def predict():
    file = request.files["file"]

    image = Image.open(file.stream)
    image = image.convert("RGB")
    image = image.resize((224, 224))

    image_array = np.array(image, dtype=np.float32) / 255.0

    image_array = np.expand_dims(image_array, axis=0)

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)

    image_bytes = buffer.getvalue()

    return {
        "status": 200,
        "message": "Prediction successful",
        "image_bytes": list(image_bytes),
    }, 200
