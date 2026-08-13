from datetime import date, timedelta

from sqlalchemy import Integer, cast, func
from sqlalchemy.orm import Session

from app.constants.task import TaskInputType
from app.models import (
    Attendance,
    DailyActivity,
    DailyActivityItem,
    Employee,
    Task,
)


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
    def update(
        db: Session,
        activity: DailyActivity,
    ):
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
            .filter(
                DailyActivity.attendance_id
                == attendance_id
            )
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
                DailyActivityItem.task_id
                == Task.id,
            )
            .join(
                DailyActivity,
                DailyActivity.id
                == DailyActivityItem.daily_activity_id,
            )
            .join(
                Attendance,
                Attendance.id
                == DailyActivity.attendance_id,
            )
            .join(
                Employee,
                Employee.id
                == Attendance.employee_id,
            )
            .filter(
                Employee.sub_admin_id
                == sub_admin_id,
                Attendance.date
                == target_date,
                Task.input_type
                == TaskInputType.INTEGER,
            )
            .group_by(Task.name)
            .all()
        )


    @staticmethod
    def productivity_trend(
        db: Session,
        sub_admin_id: int,
        start_date: date,
        end_date: date,
    ):
        return (
            db.query(
                Attendance.date,
                func.sum(
                    cast(
                        DailyActivityItem.value,
                        Integer,
                    )
                ).label("total"),
            )
            .join(
                DailyActivity,
                DailyActivity.id
                == DailyActivityItem.daily_activity_id,
            )
            .join(
                Attendance,
                Attendance.id
                == DailyActivity.attendance_id,
            )
            .join(
                Employee,
                Employee.id
                == Attendance.employee_id,
            )
            .join(
                Task,
                Task.id
                == DailyActivityItem.task_id,
            )
            .filter(
                Employee.sub_admin_id
                == sub_admin_id,
                Attendance.date >= start_date,
                Attendance.date <= end_date,
                Task.input_type
                == TaskInputType.INTEGER,
            )
            .group_by(Attendance.date)
            .order_by(Attendance.date.asc())
            .all()
        )


    @staticmethod
    def employee_productivity(
        db: Session,
        sub_admin_id: int,
        target_date: date,
    ):
        return (
            db.query(
                Employee.full_name,
                func.sum(
                    cast(
                        DailyActivityItem.value,
                        Integer,
                    )
                ).label("total"),
            )
            .join(
                Attendance,
                Attendance.employee_id
                == Employee.id,
            )
            .join(
                DailyActivity,
                DailyActivity.attendance_id
                == Attendance.id,
            )
            .join(
                DailyActivityItem,
                DailyActivityItem.daily_activity_id
                == DailyActivity.id,
            )
            .join(
                Task,
                Task.id
                == DailyActivityItem.task_id,
            )
            .filter(
                Employee.sub_admin_id
                == sub_admin_id,
                Attendance.date
                == target_date,
                Task.input_type
                == TaskInputType.INTEGER,
            )
            .group_by(Employee.id, Employee.full_name)
            .order_by(
                func.sum(
                    cast(
                        DailyActivityItem.value,
                        Integer,
                    )
                ).desc()
            )
            .all()
        )


    @staticmethod
    def get_by_attendance_id(
        db: Session,
        attendance_id: int,
    ):
        return (
            db.query(DailyActivity)
            .filter(
                DailyActivity.attendance_id
                == attendance_id,
            )
            .first()
        )
