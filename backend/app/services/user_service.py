from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import CreateUserRequest, UpdateUserRequest
from app.repositories.role_repository import RoleRepository

from app.exceptions.user import (EmailAlreadyExistsError, RoleNotFoundError, UserNotFoundError,)

class UserService:

    @staticmethod
    def create_user(db: Session, request: CreateUserRequest,):

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

        return UserRepository.create(db, user)

    @staticmethod
    def get_all_users(db: Session):
        return UserRepository.get_all(db)

    @staticmethod
    def get_user_by_id(db: Session, user_id: int,):
        user = UserRepository.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError()

        return user

    @staticmethod
    def update_user(db: Session, user_id: int, request: UpdateUserRequest,):
        user = UserRepository.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError()

        role = RoleRepository.get_by_id(db, request.role_id)

        if role is None:
            raise RoleNotFoundError()

        existing_user = UserRepository.get_by_email(db, request.email,)

        if existing_user and existing_user.id != user.id:
            raise EmailAlreadyExistsError()

        user.full_name = request.full_name
        user.email = request.email
        user.role_id = request.role_id

        return UserRepository.update(db, user)

    @staticmethod
    def update_user_status(db: Session, user_id: int, is_active: bool):
        user = UserRepository.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError()

        user.is_active = is_active

        return UserRepository.update(db, user)