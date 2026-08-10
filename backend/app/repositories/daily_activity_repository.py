from datetime import date

from sqlalchemy import Integer, cast, func
from sqlalchemy.orm import Session

from app.constants.task import TaskInputType
from app.models import Attendance, DailyActivity, DailyActivityItem, Employee, Task


class DailyActivityRepository:

    @staticmethod
    def create(
        db: Session,
        activity: DailyActivity,
    ):
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity

    @staticmethod
    def exists(
        db: Session,
        attendance_id: int,
    ):
        return (
            db.query(DailyActivity)
            .filter(DailyActivity.attendance_id == attendance_id)
            .first()
            is not None
        )

    @staticmethod
    def productivity_summary(
        db: Session,
        sub_admin_id: int,
        target_date: date,
    ):
        return (
            db.query(
                Task.name,
                func.sum(
                    cast(
                        DailyActivityItem.value,
                        Integer,
                    )
                ).label("total"),
            )
            .join(
                Task,
                DailyActivityItem.task_id == Task.id,
            )
            .join(
                DailyActivity,
                DailyActivity.id == DailyActivityItem.daily_activity_id,
            )
            .join(
                Attendance,
                Attendance.id == DailyActivity.attendance_id,
            )
            .join(
                Employee,
                Employee.id == Attendance.employee_id,
            )
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date == target_date,
                Task.input_type == TaskInputType.INTEGER,
            )
            .group_by(Task.name)
            .all()
        )
