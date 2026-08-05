from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.repositories.user_repository import UserRepository
from app.core.security import (verify_password, create_access_token, )

class AuthService:

    @staticmethod
    def login(db: Session, email: str, password: str):

        user = UserRepository.get_by_email(db, email)

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        token = create_access_token({"sub": user.email, "uid": user.id, "role": user.role.name, "type": "access", "iat": datetime.now(timezone.utc),})

        return {"access_token": token, "token_type": "bearer"}