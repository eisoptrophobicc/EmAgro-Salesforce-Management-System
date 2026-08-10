from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.mappers.user_mapper import UserMapper
from app.models import User
from app.schemas.user import (
    CreateUserRequest,
    ResetPasswordRequest,
    UpdateUserRequest,
    UpdateUserStatusRequest,
    UserListResponse,
    UserResponse,
)
from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    request: CreateUserRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = UserService.create_user(db, request)

    return UserMapper.to_response(user)


@router.get(
    "",
    response_model=UserListResponse,
)
def get_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = Query(None),
    role_id: int | None = Query(None),
    active: bool | None = Query(None),
    sort_by: str = Query("id"),
    order: str = Query("asc"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return UserService.get_all_users(
        db,
        page,
        page_size,
        search,
        role_id,
        active,
        sort_by,
        order,
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = UserService.get_user_by_id(
        db,
        user_id,
    )

    return UserMapper.to_response(user)


@router.patch(
    "/{user_id}",
    response_model=UserResponse,
)
def update_user(
    user_id: int,
    request: UpdateUserRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = UserService.update_user(
        db,
        user_id,
        request,
    )

    return UserMapper.to_response(user)


@router.patch(
    "/{user_id}/status",
    response_model=UserResponse,
)
def update_user_status(
    user_id: int,
    request: UpdateUserStatusRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = UserService.update_user_status(
        db,
        user_id,
        request.is_active,
    )

    return UserMapper.to_response(user)


@router.patch(
    "/{user_id}/reset-password",
    response_model=UserResponse,
)
def reset_password(
    user_id: int,
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = UserService.reset_password(
        db,
        user_id,
        request,
    )

    return UserMapper.to_response(user)
