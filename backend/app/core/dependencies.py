from datetime import datetime, timezone

from fastapi import Depends, HTTPException, Response, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.constants.roles import RoleEnum
from app.core.database import get_db
from app.core.security import create_access_token, decode_access_token
from app.models import User
from app.repositories.user_repository import UserRepository

security = HTTPBearer()


def get_current_user(
    response: Response,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:

    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = UserRepository.get_by_id(
        db,
        payload["uid"],
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is inactive",
        )

    refreshed_token = create_access_token(
        {
            "sub": user.email,
            "uid": user.id,
            "role": user.role.name,
            "type": "access",
            "iat": datetime.now(timezone.utc),
        }
    )

    response.headers["X-Access-Token"] = refreshed_token

    return user


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:

    if current_user.role.name != RoleEnum.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )

    return current_user


def get_current_sub_admin(
    current_user: User = Depends(get_current_user),
) -> User:

    if current_user.role.name != RoleEnum.SUB_ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sub Admin privileges required",
        )

    return current_user
