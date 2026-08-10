from datetime import date

from sqlalchemy.orm import Session

from app.constants.attendance import AttendanceStatus
from app.models import Attendance, Employee


class AttendanceRepository:

    @staticmethod
    def create_bulk(
        db: Session,
        attendance_records: list[Attendance],
    ):
        db.add_all(attendance_records)
        db.commit()

        for record in attendance_records:
            db.refresh(record)

        return attendance_records

    @staticmethod
    def attendance_exists(
        db: Session,
        employee_id: int,
        attendance_date,
    ):
        return (
            db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id,
                Attendance.date == attendance_date,
            )
            .first()
            is not None
        )

    @staticmethod
    def get_by_id(
        db: Session,
        attendance_id: int,
    ):
        return db.query(Attendance).filter(Attendance.id == attendance_id).first()

    @staticmethod
    def count_by_status(
        db: Session,
        sub_admin_id: int,
        status: AttendanceStatus,
        target_date: date,
    ):
        return (
            db.query(Attendance)
            .join(Employee)
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date == target_date,
                Attendance.status == status,
            )
            .count()
        )
