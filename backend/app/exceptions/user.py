from app.exceptions.base import AppException

class EmailAlreadyExistsError(AppException):
    def __init__(self):
        super().__init__("Email already exists.")

class RoleNotFoundError(AppException):
    def __init__(self):
        super().__init__("Role not found.")

class UserNotFoundError(AppException):
    def __init__(self):
        super().__init__("User not found.")

class EmployeeAlreadyExistsError(Exception):
    def __init__(self):
        super().__init__("Employee already exists.")

class EmployeeNotFoundError(Exception):
    def __init__(self):
        super().__init__("Employee not found.")

class AttendanceAlreadyMarkedError(Exception):
    def __init__(self):
        super().__init__("Attendance already marked.")