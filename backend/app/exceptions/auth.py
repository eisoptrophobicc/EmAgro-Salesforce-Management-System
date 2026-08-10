from app.exceptions.base import AppException


class InvalidCredentialsError(AppException):
    def __init__(self):
        super().__init__("Invalid email or password.")


class UnauthorizedError(AppException):
    def __init__(self):
        super().__init__("Authentication required.")


class ForbiddenError(AppException):
    def __init__(self):
        super().__init__("You do not have permission to perform this action.")
