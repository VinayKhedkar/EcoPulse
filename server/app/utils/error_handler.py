import os


class AppError(Exception):
    def __init__(self, message, status_code=500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def not_found_error_handler(error):
    return {"status_code": 404, "message": "Resource not found"}, 404


def global_error_handler(error):
    if os.getenv("FLASK_ENV") == "development":
        return handle_development_error(error)
    return handle_production_error(error)


def handle_development_error(error):
    status_code = error.status_code if hasattr(error, "status_code") else 500
    message = error.message if hasattr(error, "message") else str(error)
    return {
        "status": status_code,
        "message": message,
    }, status_code


def handle_production_error(error):
    status_code = error.status_code if hasattr(error, "status_code") else 500
    message = (
        error.message
        if hasattr(error, "message")
        else "Something went wrong! Please try again later."
    )
    return {"status": status_code, "message": message}, status_code
