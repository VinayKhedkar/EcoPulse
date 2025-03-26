from flask import Blueprint, request, jsonify
import numpy as np
from PIL import Image
import onnxruntime as ort
import os
from app.utils import AppError

bp = Blueprint("model", __name__, url_prefix="/model")

model_path = os.path.abspath("./app/models/plant_disease_model.onnx")
if not os.path.exists(model_path):
    raise AppError(f"ONNX model not found at {model_path}", 500)

session = ort.InferenceSession(model_path)


@bp.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        raise AppError("No file uploaded", 400)

    file = request.files["file"]

    image = Image.open(file.stream).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image, dtype=np.float32) / 255.0

    input_name = session.get_inputs()[0].name
    input_shape = session.get_inputs()[0].shape

    if input_shape[0] == "unk__1964":
        image_array = np.expand_dims(image_array, axis=0)
    else:
        raise AppError(f"Unsupported model input shape: {input_shape}", 500)

    output = session.run(None, {input_name: image_array})
    predicted_class = int(np.argmax(output[0]))
    confidence = float(np.max(output[0]))

    disease_mapping = {
        0: "Pepper Bell - Bacterial Spot",
        1: "Pepper Bell - Healthy",
        2: "PlantVillage (Unknown Class)",
        3: "Potato - Early Blight",
        4: "Potato - Late Blight",
        5: "Potato - Healthy",
        6: "Tomato - Bacterial Spot",
        7: "Tomato - Early Blight",
        8: "Tomato - Late Blight",
        9: "Tomato - Leaf Mold",
        10: "Tomato - Septoria Leaf Spot",
        11: "Tomato - Spider Mites (Two-Spotted)",
        12: "Tomato - Target Spot",
        13: "Tomato - Yellow Leaf Curl Virus",
        14: "Tomato - Mosaic Virus",
        15: "Tomato - Healthy",
    }

    return jsonify(
        {
            "status": "success",
            "predicted_class": predicted_class,
            "disease": disease_mapping[predicted_class],
            "confidence": confidence,
        }
    )
