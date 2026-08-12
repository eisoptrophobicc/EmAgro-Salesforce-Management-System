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


class AttendanceNotFoundError(Exception):
    def __init__(self):
        super().__init__("Attendance not found.")


class TaskAlreadyExistsError(Exception):
    def __init__(self):
        super().__init__("Task already exists.")


class TaskNotFoundError(Exception):
    def __init__(self):
        super().__init__("Task not found.")


class DailyActivityAlreadyExistsError(Exception):
    def __init__(self):
        super().__init__("Daily activity already exists.")


class DailyActivityNotFoundError(Exception):
    def __init__(self):
        super().__init__("Daily activity not found.")


class EmployeeTaskAlreadyExistsError(Exception):
    def __init__(self):
        super().__init__("Task is already assigned to this employee.")


class EmployeeTaskNotFoundError(Exception):
    def __init__(self):
        super().__init__("Task is not assigned to this employee.")