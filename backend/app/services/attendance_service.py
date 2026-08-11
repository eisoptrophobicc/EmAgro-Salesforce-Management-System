from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from datetime import date

from app.exceptions.user import AttendanceAlreadyMarkedError, EmployeeNotFoundError
from app.models import Attendance, User
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.employee_repository import EmployeeRepository
from app.schemas.attendance import BulkAttendanceRequest
from app.constants.attendance import AttendanceStatus


class AttendanceService:

    @staticmethod
    def mark_bulk_attendance(
        db: Session,
        request: BulkAttendanceRequest,
        current_user: User,
    ):
        attendance_records = []
        seen_employee_ids = set()

        for item in request.attendance:
            if item.employee_id in seen_employee_ids:
                raise AttendanceAlreadyMarkedError()

            seen_employee_ids.add(item.employee_id)

            employee = EmployeeRepository.belongs_to_sub_admin(
                db,
                item.employee_id,
                current_user.id,
            )

            if employee is None:
                raise EmployeeNotFoundError()

            if AttendanceRepository.attendance_exists(
                db,
                item.employee_id,
                request.date,
            ):
                raise AttendanceAlreadyMarkedError()

            attendance_records.append(
                Attendance(
                    employee_id=item.employee_id,
                    date=request.date,
                    status=item.status,
                    marked_by=current_user.id,
                )
            )

        try:
            return AttendanceRepository.create_bulk(
                db,
                attendance_records,
            )
        except IntegrityError:
            db.rollback()
            raise AttendanceAlreadyMarkedError()

    @staticmethod
    def get_attendance_by_date(
        db: Session,
        target_date: date,
        current_user: User,
    ):
        return AttendanceRepository.get_by_date(
            db,
            current_user.id,
            target_date,
        )

    @staticmethod
    def update_attendance(
        db: Session,
        attendance_id: int,
        status: AttendanceStatus,
        current_user: User,
    ):
        attendance = AttendanceRepository.get_by_id(
            db,
            attendance_id,
        )

        if attendance is None:
            raise EmployeeNotFoundError()

        employee = EmployeeRepository.belongs_to_sub_admin(
            db,
            attendance.employee_id,
            current_user.id,
        )

        if employee is None:
            raise EmployeeNotFoundError()

        attendance.status = status

        try:
            return AttendanceRepository.update(
                db,
                attendance,
            )
        except IntegrityError:
            db.rollback()
            raise AttendanceAlreadyMarkedError()
