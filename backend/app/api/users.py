from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models import User
from app.schemas.user import CreateUserRequest, UpdateUserRequest, UpdateUserStatusRequest, UserResponse
from app.services.user_service import UserService
from app.mappers.user_mapper import UserMapper
from typing import List

router = APIRouter(prefix="/users", tags=["Users"],)

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED,)
def create_user(request: CreateUserRequest, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin),):
    user = UserService.create_user(db, request)

    return UserMapper.to_response(user)

@router.get("", response_model=List[UserResponse],) 
def get_users(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin),):
    users = UserService.get_all_users(db)

    return UserMapper.to_response_list(users)       

@router.get("", response_model=List[UserResponse],) 
def get_users(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin),):
    users = UserService.get_all_users(db)

    return [
        UserResponse(id=user.id, full_name=user.full_name, email=user.email, role=user.role.name, is_active=user.is_active)
        for user in users
    ]

@router.get("/{user_id}",response_model=UserResponse,)
def get_user(user_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin),):
    user = UserService.get_user_by_id(db, user_id,)

    return UserMapper.to_response(user)

@router.patch("/{user_id}", response_model=UserResponse,)
def update_user(user_id: int, request: UpdateUserRequest, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin),):
    user = UserService.update_user(db, user_id, request,)

    return UserMapper.to_response(user)

@router.patch("/{user_id}/status", response_model=UserResponse,)
def update_user_status(user_id: int, request: UpdateUserStatusRequest, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin),):
    user = UserService.update_user_status(db, user_id, request.is_active,)

    return UserMapper.to_response(user)