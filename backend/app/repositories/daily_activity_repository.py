from sqlalchemy.orm import Session

from app.models import DailyActivity

class DailyActivityRepository:

    @staticmethod
    def create(db: Session, activity: DailyActivity,):
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity

    @staticmethod
    def exists(db: Session, attendance_id: int,):
        return (db.query(DailyActivity).filter(DailyActivity.attendance_id == attendance_id).first() is not None)