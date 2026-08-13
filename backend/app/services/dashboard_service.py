from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import (
    DashboardResponse,
    OperationalStatistics,
    SubAdminOverview,
    UserStatistics,
)


class DashboardService:

    @staticmethod
    def get_dashboard(db: Session):

        stats = DashboardRepository.get_user_statistics(db)
        operations = (
            DashboardRepository.get_operational_statistics(db)
        )
        sub_admin_rows = (
            DashboardRepository.get_sub_admin_overview(db)
        )

        return DashboardResponse(
            users=UserStatistics(
                total=stats["total"],
                active=stats["active"],
                inactive=stats["inactive"],
                admins=stats["admins"],
                sub_admins=stats["sub_admins"],
                employees=stats["employees"],
            ),
            operations=OperationalStatistics(
                employees=operations["employees"],
                active_employees=operations["active_employees"],
                tasks=operations["tasks"],
                attendance_records=operations["attendance_records"],
                daily_activities=operations["daily_activities"],
            ),
            sub_admins=[
                SubAdminOverview(
                    id=row.id,
                    full_name=row.full_name,
                    email=row.email,
                    is_active=row.is_active,
                    last_login=(
                        row.last_login.isoformat()
                        if row.last_login
                        else None
                    ),
                    employees=row.employees,
                    active_employees=row.active_employees,
                    tasks=row.tasks,
                    attendance_records=row.attendance_records,
                    daily_activities=row.daily_activities,
                    last_activity_date=(
                        row.last_activity_date.isoformat()
                        if row.last_activity_date
                        else None
                    ),
                )
                for row in sub_admin_rows
            ],
        )
