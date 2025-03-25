import os


def global_error_handler(error):
    if os.getenv("FLASK_ENV") == "development":
        return handle_development_error(error)
    return handle_production_error(error)


def handle_development_error(error):
    status_code = error.status_code if hasattr(error, "status_code") else 500
    return {
        "status": status_code,
        "message": error.message,
        "traceback": error.traceback,
    }, status_code


def handle_production_error(error):
    status_code = error.status_code if hasattr(error, "status_code") else 500
    return {"status": status_code, "message": error.message}, status_code
