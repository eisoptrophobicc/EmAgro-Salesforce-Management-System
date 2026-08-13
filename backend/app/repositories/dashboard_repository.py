from sqlalchemy import case, distinct, func
from sqlalchemy.orm import Session

from app.constants.roles import RoleEnum
from app.models import Attendance, DailyActivity, Employee, Task, User


class DashboardRepository:

    @staticmethod
    def get_user_statistics(db: Session):
        total = db.query(func.count(User.id)).scalar()

        active = (
            db.query(func.count(User.id))
            .filter(User.is_active.is_(True))
            .scalar()
        )

        inactive = (
            db.query(func.count(User.id))
            .filter(User.is_active.is_(False))
            .scalar()
        )

        admins = (
            db.query(func.count(User.id))
            .join(User.role)
            .filter(User.role.has(name=RoleEnum.ADMIN.value))
            .scalar()
        )

        sub_admins = (
            db.query(func.count(User.id))
            .join(User.role)
            .filter(User.role.has(name=RoleEnum.SUB_ADMIN.value))
            .scalar()
        )

        employees = db.query(func.count(Employee.id)).scalar()

        return {
            "total": total,
            "active": active,
            "inactive": inactive,
            "admins": admins,
            "sub_admins": sub_admins,
            "employees": employees,
        }

    @staticmethod
    def get_operational_statistics(db: Session):
        employees = db.query(func.count(Employee.id)).scalar()

        active_employees = (
            db.query(func.count(Employee.id))
            .filter(Employee.is_active.is_(True))
            .scalar()
        )

        tasks = db.query(func.count(Task.id)).scalar()

        attendance_records = (
            db.query(func.count(Attendance.id)).scalar()
        )

        daily_activities = (
            db.query(func.count(DailyActivity.id)).scalar()
        )

        return {
            "employees": employees,
            "active_employees": active_employees,
            "tasks": tasks,
            "attendance_records": attendance_records,
            "daily_activities": daily_activities,
        }

    @staticmethod
    def get_sub_admin_overview(db: Session):
        employee_counts = (
            db.query(
                Employee.sub_admin_id.label("sub_admin_id"),
                func.count(Employee.id).label("employees"),
                func.sum(
                    case(
                        (
                            Employee.is_active.is_(True),
                            1,
                        ),
                        else_=0,
                    )
                ).label("active_employees"),
            )
            .group_by(Employee.sub_admin_id)
            .subquery()
        )

        task_counts = (
            db.query(
                Task.sub_admin_id.label("sub_admin_id"),
                func.count(Task.id).label("tasks"),
            )
            .group_by(Task.sub_admin_id)
            .subquery()
        )

        activity_counts = (
            db.query(
                Employee.sub_admin_id.label("sub_admin_id"),
                func.count(
                    distinct(Attendance.id)
                ).label("attendance_records"),
                func.count(
                    distinct(DailyActivity.id)
                ).label("daily_activities"),
                func.max(Attendance.date).label("last_activity_date"),
            )
            .select_from(Employee)
            .outerjoin(
                Attendance,
                Attendance.employee_id == Employee.id,
            )
            .outerjoin(
                DailyActivity,
                DailyActivity.attendance_id == Attendance.id,
            )
            .group_by(Employee.sub_admin_id)
            .subquery()
        )

        return (
            db.query(
                User.id,
                User.full_name,
                User.email,
                User.is_active,
                User.last_login,
                func.coalesce(
                    employee_counts.c.employees,
                    0,
                ).label("employees"),
                func.coalesce(
                    employee_counts.c.active_employees,
                    0,
                ).label("active_employees"),
                func.coalesce(
                    task_counts.c.tasks,
                    0,
                ).label("tasks"),
                func.coalesce(
                    activity_counts.c.attendance_records,
                    0,
                ).label("attendance_records"),
                func.coalesce(
                    activity_counts.c.daily_activities,
                    0,
                ).label("daily_activities"),
                activity_counts.c.last_activity_date,
            )
            .join(User.role)
            .outerjoin(
                employee_counts,
                employee_counts.c.sub_admin_id == User.id,
            )
            .outerjoin(
                task_counts,
                task_counts.c.sub_admin_id == User.id,
            )
            .outerjoin(
                activity_counts,
                activity_counts.c.sub_admin_id == User.id,
            )
            .filter(User.role.has(name=RoleEnum.SUB_ADMIN.value))
            .order_by(User.full_name)
            .all()
        )
