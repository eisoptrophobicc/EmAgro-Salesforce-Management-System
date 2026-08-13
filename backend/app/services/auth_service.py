from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.constants.roles import RoleEnum
from app.core.config import settings
from app.core.security import hash_password
from app.models import User
from app.repositories.role_repository import RoleRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import AdminSetupRequest


class AuthService:

    @staticmethod
    def login(db: Session, email: str, password: str):

        user = UserRepository.get_by_email(db, email)

        if not user:
            return None

        if not user.is_active:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        token = create_access_token(
            {
                "sub": user.email,
                "uid": user.id,
                "role": user.role.name,
                "type": "access",
                "iat": datetime.now(timezone.utc),
            }
        )

        return {"access_token": token, "token_type": "bearer"}

    @staticmethod
    def setup_required(db: Session):
        return not UserRepository.admin_exists(db)

    @staticmethod
    def setup_admin(
        db: Session,
        request: AdminSetupRequest,
    ):
        if UserRepository.admin_exists(db):
            return None

        if not settings.ADMIN_SETUP_KEY:
            return None

        if request.setup_key != settings.ADMIN_SETUP_KEY:
            return None

        if UserRepository.email_exists(db, request.email):
            return None

        admin_role = RoleRepository.get_or_create(
            db,
            RoleEnum.ADMIN.value,
            "Full system access",
        )

        RoleRepository.get_or_create(
            db,
            RoleEnum.SUB_ADMIN.value,
            "Limited administrative access",
        )

        user = User(
            full_name=request.full_name,
            email=request.email,
            hashed_password=hash_password(request.password),
            role_id=admin_role.id,
            is_active=True,
        )

        return UserRepository.create(db, user)
