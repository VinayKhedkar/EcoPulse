from flask import request
from app.utils import decode_jwt

def protected(func):
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            raise Exception("Authorization header is missing!")
        
        token = auth_header.split(" ")[1] if "Bearer " in auth_header else None
        
        if not token:
            raise Exception("Token is missing!")
        
        decoded_payload = decode_jwt(token)
        
        if isinstance(decoded_payload, str):
            raise Exception(decoded_payload)
        
        request.user = decoded_payload
        
        return func(*args, **kwargs)
    return wrapper
