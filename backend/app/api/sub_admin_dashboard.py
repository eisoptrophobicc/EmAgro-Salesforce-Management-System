from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import get_db
from app.core.dependencies import get_current_sub_admin
from app.models import User
from app.schemas.sub_admin_dashboard import (SubAdminDashboardResponse,)
from app.services.sub_admin_dashboard_service import (SubAdminDashboardService,)

router = APIRouter(prefix="/sub-admin/dashboard", tags=["Sub Admin Dashboard"],)

@router.get("", response_model=SubAdminDashboardResponse,)
def get_dashboard(target_date: date | None = None, db: Session = Depends(get_db), current_sub_admin: User = Depends(get_current_sub_admin),):
    return SubAdminDashboardService.get_dashboard(db, current_sub_admin,target_date,)