from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models import User
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"],)

@router.get("", response_model=DashboardResponse,)
def get_dashboard(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin),):
    return DashboardService.get_dashboard(db)