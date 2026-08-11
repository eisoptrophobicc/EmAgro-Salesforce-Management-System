from app.models import Attendance
from app.schemas.attendance import AttendanceResponse


class AttendanceMapper:

    @staticmethod
    def to_response(attendance: Attendance) -> AttendanceResponse:
        return AttendanceResponse.model_validate(attendance)