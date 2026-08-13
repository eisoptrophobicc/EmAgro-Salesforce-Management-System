from sqlalchemy import Integer, case, cast, func
from sqlalchemy.orm import Session

from app.constants.task import TaskInputType
from app.models import Attendance, DailyActivity, DailyActivityItem, Employee, Task


class ReportRepository:

    @staticmethod
    def attendance_summary(
        db: Session,
        sub_admin_id: int,
        from_date,
        to_date,
    ):
        rows = (
            db.query(
                Attendance.status,
                func.count(Attendance.id).label("total"),
            )
            .join(Employee)
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date >= from_date,
                Attendance.date <= to_date,
            )
            .group_by(Attendance.status)
            .all()
        )

        return rows

    @staticmethod
    def productivity_summary(
        db: Session,
        sub_admin_id: int,
        from_date,
        to_date,
    ):
        rows = (
            db.query(
                Task.name.label("task"),
                func.count(DailyActivityItem.id).label("total"),
            )
            .select_from(Attendance)
            .join(Employee, Attendance.employee_id == Employee.id)
            .join(DailyActivity, DailyActivity.attendance_id == Attendance.id)
            .join(
                DailyActivityItem,
                DailyActivityItem.daily_activity_id == DailyActivity.id,
            )
            .join(Task, Task.id == DailyActivityItem.task_id)
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date >= from_date,
                Attendance.date <= to_date,
            )
            .group_by(Task.id, Task.name)
            .order_by(Task.name)
            .all()
        )

        return rows

    @staticmethod
    def numeric_productivity_summary(
        db: Session,
        sub_admin_id: int,
        from_date,
        to_date,
    ):
        rows = (
            db.query(
                Task.name.label("task"),
                func.sum(
                    cast(
                        DailyActivityItem.value,
                        Integer,
                    )
                ).label("total"),
            )
            .select_from(Attendance)
            .join(Employee, Attendance.employee_id == Employee.id)
            .join(DailyActivity, DailyActivity.attendance_id == Attendance.id)
            .join(
                DailyActivityItem,
                DailyActivityItem.daily_activity_id == DailyActivity.id,
            )
            .join(Task, Task.id == DailyActivityItem.task_id)
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date >= from_date,
                Attendance.date <= to_date,
                Task.input_type == TaskInputType.INTEGER,
            )
            .group_by(Task.id, Task.name)
            .order_by(Task.name)
            .all()
        )

        return rows

    @staticmethod
    def boolean_productivity_summary(
        db: Session,
        sub_admin_id: int,
        from_date,
        to_date,
    ):
        normalized_value = func.lower(DailyActivityItem.value)

        rows = (
            db.query(
                Task.name.label("task"),
                func.count(DailyActivityItem.id).label("total"),
                func.sum(
                    case(
                        (
                            normalized_value.in_(("true", "1", "yes")),
                            1,
                        ),
                        else_=0,
                    )
                ).label("yes"),
                func.sum(
                    case(
                        (
                            normalized_value.in_(("false", "0", "no")),
                            1,
                        ),
                        else_=0,
                    )
                ).label("no"),
            )
            .select_from(Attendance)
            .join(Employee, Attendance.employee_id == Employee.id)
            .join(DailyActivity, DailyActivity.attendance_id == Attendance.id)
            .join(
                DailyActivityItem,
                DailyActivityItem.daily_activity_id == DailyActivity.id,
            )
            .join(Task, Task.id == DailyActivityItem.task_id)
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date >= from_date,
                Attendance.date <= to_date,
                Task.input_type == TaskInputType.BOOLEAN,
            )
            .group_by(Task.id, Task.name)
            .order_by(Task.name)
            .all()
        )

        return rows

    @staticmethod
    def text_productivity_summary(
        db: Session,
        sub_admin_id: int,
        from_date,
        to_date,
    ):
        rows = (
            db.query(
                Task.name.label("task"),
                func.count(DailyActivityItem.id).label("total"),
            )
            .select_from(Attendance)
            .join(Employee, Attendance.employee_id == Employee.id)
            .join(DailyActivity, DailyActivity.attendance_id == Attendance.id)
            .join(
                DailyActivityItem,
                DailyActivityItem.daily_activity_id == DailyActivity.id,
            )
            .join(Task, Task.id == DailyActivityItem.task_id)
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date >= from_date,
                Attendance.date <= to_date,
                Task.input_type == TaskInputType.TEXT,
            )
            .group_by(Task.id, Task.name)
            .order_by(Task.name)
            .all()
        )

        return rows

    @staticmethod
    def productivity_timeline(
        db: Session,
        sub_admin_id: int,
        from_date,
        to_date,
    ):
        rows = (
            db.query(
                Attendance.date.label("date"),
                func.count(DailyActivityItem.id).label("total"),
            )
            .select_from(Attendance)
            .join(Employee, Attendance.employee_id == Employee.id)
            .join(DailyActivity, DailyActivity.attendance_id == Attendance.id)
            .join(
                DailyActivityItem,
                DailyActivityItem.daily_activity_id == DailyActivity.id,
            )
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date >= from_date,
                Attendance.date <= to_date,
            )
            .group_by(Attendance.date)
            .order_by(Attendance.date)
            .all()
        )

        return rows

    @staticmethod
    def attendance_by_employee(
        db: Session,
        sub_admin_id: int,
        from_date,
        to_date,
    ):
        rows = (
            db.query(
                Employee.full_name.label("employee"),
                Attendance.status.label("status"),
                func.count(Attendance.id).label("total"),
            )
            .select_from(Attendance)
            .join(Employee, Attendance.employee_id == Employee.id)
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date >= from_date,
                Attendance.date <= to_date,
            )
            .group_by(
                Employee.id,
                Employee.full_name,
                Attendance.status,
            )
            .order_by(Employee.full_name)
            .all()
        )

        return rows

    @staticmethod
    def employee_attendance_report(
        db: Session,
        sub_admin_id: int,
        from_date,
        to_date,
    ):
        rows = (
            db.query(
                Employee.id.label("employee_id"),
                Employee.employee_code,
                Employee.full_name,
                Employee.designation,
                Attendance.status,
                func.count(Attendance.id).label("total"),
            )
            .select_from(Attendance)
            .join(Employee, Attendance.employee_id == Employee.id)
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date >= from_date,
                Attendance.date <= to_date,
            )
            .group_by(
                Employee.id,
                Employee.employee_code,
                Employee.full_name,
                Employee.designation,
                Attendance.status,
            )
            .order_by(Employee.full_name)
            .all()
        )

        return rows

    @staticmethod
    def employee_task_report(
        db: Session,
        sub_admin_id: int,
        from_date,
        to_date,
    ):
        rows = (
            db.query(
                Employee.id.label("employee_id"),
                Task.name.label("task"),
                func.count(DailyActivityItem.id).label("total"),
            )
            .select_from(Attendance)
            .join(Employee, Attendance.employee_id == Employee.id)
            .join(DailyActivity, DailyActivity.attendance_id == Attendance.id)
            .join(
                DailyActivityItem,
                DailyActivityItem.daily_activity_id == DailyActivity.id,
            )
            .join(Task, Task.id == DailyActivityItem.task_id)
            .filter(
                Employee.sub_admin_id == sub_admin_id,
                Attendance.date >= from_date,
                Attendance.date <= to_date,
            )
            .group_by(
                Employee.id,
                Task.id,
                Task.name,
            )
            .order_by(
                Employee.full_name,
                Task.name,
            )
            .all()
        )

        return rows
