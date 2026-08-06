from sqlalchemy.orm import Session

from app.models import Attendance

class AttendanceRepository:

    @staticmethod
    def create_bulk(db: Session, attendance_records: list[Attendance],):
        db.add_all(attendance_records)
        db.commit()

        for record in attendance_records:
            db.refresh(record)

        return attendance_records

    @staticmethod
    def attendance_exists(db: Session, employee_id: int, attendance_date,):
        return (db.query(Attendance).filter(Attendance.employee_id == employee_id, Attendance.date == attendance_date,).first() is not None)