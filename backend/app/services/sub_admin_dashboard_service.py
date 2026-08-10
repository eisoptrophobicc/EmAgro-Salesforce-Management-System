from sqlalchemy.orm import Session
from datetime import date

from app.models import User
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.schemas.sub_admin_dashboard import (EmployeeSummary, AttendanceSummary, SubAdminDashboardResponse, ProductivitySummary,)
from app.constants.attendance import AttendanceStatus
from app.repositories.daily_activity_repository import DailyActivityRepository

class SubAdminDashboardService:

    @staticmethod
    def get_dashboard(db: Session, current_user: User, target_date: date | None,):
        target_date = target_date or date.today()
        employees = EmployeeSummary(total=EmployeeRepository.count(db, current_user.id,), active=EmployeeRepository.count_active(db, current_user.id,), inactive=EmployeeRepository.count_inactive(db,current_user.id,),)
        attendance = AttendanceSummary(present=AttendanceRepository.count_by_status(db,current_user.id, AttendanceStatus.PRESENT, target_date,), absent=AttendanceRepository.count_by_status(db, current_user.id, AttendanceStatus.ABSENT, target_date,), half_day=AttendanceRepository.count_by_status(db, current_user.id, AttendanceStatus.HALF_DAY, target_date,), leave=AttendanceRepository.count_by_status(db, current_user.id, AttendanceStatus.LEAVE, target_date,),)
        rows = DailyActivityRepository.productivity_summary(db, current_user.id, target_date,)
        productivity = [ProductivitySummary(task=row.name, total=row.total,)
            for row in rows
        ]

        return SubAdminDashboardResponse(employees=employees, attendance=attendance, productivity=productivity)