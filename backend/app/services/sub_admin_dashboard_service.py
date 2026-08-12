from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.constants.attendance import AttendanceStatus

from app.models import User

from app.repositories.attendance_repository import (
    AttendanceRepository,
)

from app.repositories.daily_activity_repository import (
    DailyActivityRepository,
)

from app.repositories.employee_repository import (
    EmployeeRepository,
)

from app.schemas.sub_admin_dashboard import (
    AttendanceSummary,
    AttendanceTrendItem,
    EmployeeProductivityItem,
    EmployeeSummary,
    ProductivitySummary,
    ProductivityTrendItem,
    SubAdminDashboardResponse,
)


class SubAdminDashboardService:

    @staticmethod
    def get_dashboard(
        db: Session,
        current_user: User,
        target_date: date | None,
    ):
        target_date = (
            target_date or date.today()
        )

        # Last 7 days including selected date
        start_date = (
            target_date - timedelta(days=6)
        )

        employees = EmployeeSummary(
            total=EmployeeRepository.count(
                db,
                current_user.id,
            ),
            active=EmployeeRepository.count_active(
                db,
                current_user.id,
            ),
            inactive=EmployeeRepository.count_inactive(
                db,
                current_user.id,
            ),
        )

        attendance = AttendanceSummary(
            present=AttendanceRepository.count_by_status(
                db,
                current_user.id,
                AttendanceStatus.PRESENT,
                target_date,
            ),
            absent=AttendanceRepository.count_by_status(
                db,
                current_user.id,
                AttendanceStatus.ABSENT,
                target_date,
            ),
            half_day=AttendanceRepository.count_by_status(
                db,
                current_user.id,
                AttendanceStatus.HALF_DAY,
                target_date,
            ),
            leave=AttendanceRepository.count_by_status(
                db,
                current_user.id,
                AttendanceStatus.LEAVE,
                target_date,
            ),
        )

        attendance_rows = (
            AttendanceRepository.attendance_trend(
                db,
                current_user.id,
                start_date,
                target_date,
            )
        )

        attendance_map = {}

        for row in attendance_rows:
            row_date = row.date.isoformat()

            if row_date not in attendance_map:
                attendance_map[row_date] = {
                    "date": row_date,
                    "present": 0,
                    "absent": 0,
                    "half_day": 0,
                    "leave": 0,
                }

            if row.status == AttendanceStatus.PRESENT:
                attendance_map[row_date][
                    "present"
                ] = row.total

            elif row.status == AttendanceStatus.ABSENT:
                attendance_map[row_date][
                    "absent"
                ] = row.total

            elif row.status == AttendanceStatus.HALF_DAY:
                attendance_map[row_date][
                    "half_day"
                ] = row.total

            elif row.status == AttendanceStatus.LEAVE:
                attendance_map[row_date][
                    "leave"
                ] = row.total

        attendance_trend = [
            AttendanceTrendItem(**item)
            for item in sorted(
                attendance_map.values(),
                key=lambda item: item["date"],
            )
        ]

        productivity_rows = (
            DailyActivityRepository.productivity_summary(
                db,
                current_user.id,
                target_date,
            )
        )

        productivity = [
            ProductivitySummary(
                task=row.name,
                total=row.total or 0,
            )
            for row in productivity_rows
        ]

        productivity_rows = (
            DailyActivityRepository.productivity_trend(
                db,
                current_user.id,
                start_date,
                target_date,
            )
        )

        productivity_trend = [
            ProductivityTrendItem(
                date=row.date.isoformat(),
                total=row.total or 0,
            )
            for row in productivity_rows
        ]

        employee_rows = (
            DailyActivityRepository.employee_productivity(
                db,
                current_user.id,
                target_date,
            )
        )

        employee_productivity = [
            EmployeeProductivityItem(
                employee=row.full_name,
                total=row.total or 0,
            )
            for row in employee_rows
        ]

        return SubAdminDashboardResponse(
            employees=employees,
            attendance=attendance,
            attendance_trend=attendance_trend,
            productivity=productivity,
            productivity_trend=productivity_trend,
            employee_productivity=employee_productivity,
        )