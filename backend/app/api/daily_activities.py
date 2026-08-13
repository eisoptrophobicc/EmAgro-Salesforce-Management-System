from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_sub_admin
from app.mappers.daily_activity_mapper import DailyActivityMapper
from app.models import User
from app.schemas.daily_activity import (
    CreateDailyActivityRequest,
    DailyActivityResponse,
    UpdateDailyActivityRequest,
)
from app.services.daily_activity_service import DailyActivityService

router = APIRouter(
    prefix="/daily-activities",
    tags=["Daily Activities"],
)


@router.post(
    "",
    response_model=DailyActivityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_daily_activity(
    request: CreateDailyActivityRequest,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    activity = DailyActivityService.create_daily_activity(
        db,
        request,
        current_sub_admin,
    )

    return DailyActivityMapper.to_response(activity)


@router.get(
    "/{attendance_id}",
    response_model=DailyActivityResponse,
)
def get_daily_activity(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    activity = DailyActivityService.get_daily_activity(
        db,
        attendance_id,
        current_sub_admin,
    )

    return DailyActivityMapper.to_response(activity)


@router.patch(
    "/{attendance_id}",
    response_model=DailyActivityResponse,
)
def update_daily_activity(
    attendance_id: int,
    request: UpdateDailyActivityRequest,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    activity = DailyActivityService.update_daily_activity(
        db,
        attendance_id,
        request,
        current_sub_admin,
    )

    return DailyActivityMapper.to_response(activity)
