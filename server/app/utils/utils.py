import jwt
import os


def decode_jwt(jwt_token):
    decoded_payload = jwt.decode(
        jwt_token, os.getenv("FLASK_SECRET_KEY"), algorithms=["HS256"]
    )

    return decoded_payload
