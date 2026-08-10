import math

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.exceptions.user import (
    EmailAlreadyExistsError,
    RoleNotFoundError,
    UserNotFoundError,
)
from app.mappers.user_mapper import UserMapper
from app.models import User
from app.repositories.role_repository import RoleRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    CreateUserRequest,
    ResetPasswordRequest,
    UpdateUserRequest,
    UserListResponse,
)


class UserService:

    @staticmethod
    def create_user(
        db: Session,
        request: CreateUserRequest,
    ):

        if UserRepository.email_exists(db, request.email):
            raise EmailAlreadyExistsError()

        role = RoleRepository.get_by_id(db, request.role_id)

        if role is None:
            raise RoleNotFoundError()

        user = User(
            full_name=request.full_name,
            email=request.email,
            hashed_password=hash_password(request.password),
            role_id=role.id,
            is_active=True,
        )

        try:
            return UserRepository.create(db, user)
        except IntegrityError:
            db.rollback()
            raise EmailAlreadyExistsError()

    @staticmethod
    def get_all_users(
        db: Session,
        page: int,
        page_size: int,
        search: str | None = None,
        role_id: int | None = None,
        active: bool | None = None,
        sort_by: str = "id",
        order: str = "asc",
    ):
        users, total = UserRepository.get_all(
            db,
            page,
            page_size,
            search,
            role_id,
            active,
            sort_by,
            order,
        )

        return UserListResponse(
            items=UserMapper.to_response_list(users),
            total=total,
            page=page,
            page_size=page_size,
            pages=math.ceil(total / page_size) if total else 1,
        )

    @staticmethod
    def get_user_by_id(
        db: Session,
        user_id: int,
    ):
        user = UserRepository.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError()

        return user

    @staticmethod
    def update_user(
        db: Session,
        user_id: int,
        request: UpdateUserRequest,
    ):
        user = UserRepository.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError()

        role = RoleRepository.get_by_id(db, request.role_id)

        if role is None:
            raise RoleNotFoundError()

        existing_user = UserRepository.get_by_email(
            db,
            request.email,
        )

        if existing_user and existing_user.id != user.id:
            raise EmailAlreadyExistsError()

        user.full_name = request.full_name
        user.email = request.email
        user.role_id = request.role_id

        try:
            return UserRepository.update(db, user)
        except IntegrityError:
            db.rollback()
            raise EmailAlreadyExistsError()

    @staticmethod
    def update_user_status(db: Session, user_id: int, is_active: bool):
        user = UserRepository.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError()

        user.is_active = is_active

        return UserRepository.update(db, user)

    @staticmethod
    def reset_password(db: Session, user_id: int, request: ResetPasswordRequest):
        user = UserRepository.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError()

        user.hashed_password = hash_password(request.password)

        return UserRepository.update(db, user)
