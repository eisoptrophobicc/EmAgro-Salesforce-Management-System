from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import DashboardResponse, UserStatistics

class DashboardService:

    @staticmethod
    def get_dashboard(db: Session):

        stats = DashboardRepository.get_user_statistics(db)

        return DashboardResponse(users=UserStatistics(total=stats["total"], active=stats["active"], inactive=stats["inactive"], admins=stats["admins"], sub_admins=stats["sub_admins"], employees=stats["employees"],))