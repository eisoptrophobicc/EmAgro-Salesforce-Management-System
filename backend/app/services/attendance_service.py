from sqlalchemy.orm import Session

from app.models import Attendance, User
from app.repositories.attendance_repository import AttendanceRepository
from app.schemas.attendance import BulkAttendanceRequest
from app.repositories.employee_repository import EmployeeRepository
from app.exceptions.handlers import EmployeeNotFoundError
from app.exceptions.user import AttendanceAlreadyMarkedError

class AttendanceService:

    @staticmethod
    def mark_bulk_attendance(db: Session, request: BulkAttendanceRequest, current_user: User,):
        attendance_records = []

        for item in request.attendance:
            employee = EmployeeRepository.belongs_to_sub_admin(db, item.employee_id, current_user.id,)

            if employee is None:
                raise EmployeeNotFoundError()

            if AttendanceRepository.attendance_exists(db, item.employee_id, request.date,):
                raise AttendanceAlreadyMarkedError()

            attendance_records.append(Attendance(employee_id=item.employee_id, date=request.date, status=item.status,marked_by=current_user.id,))

        return AttendanceRepository.create_bulk(db, attendance_records,)