from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_sub_admin
from app.models import User
from app.schemas.daily_activity import (CreateDailyActivityRequest, DailyActivityResponse,)
from app.services.daily_activity_service import (DailyActivityService,)
from app.mappers.daily_activity_mapper import (DailyActivityMapper,)

router = APIRouter(prefix="/daily-activities", tags=["Daily Activities"],)

@router.post("", response_model=DailyActivityResponse, status_code=status.HTTP_201_CREATED,)
def create_daily_activity(request: CreateDailyActivityRequest, db: Session = Depends(get_db), current_sub_admin: User = Depends(get_current_sub_admin),):
    activity = DailyActivityService.create_daily_activity(db, request, current_sub_admin,)

    return DailyActivityMapper.to_response(activity)