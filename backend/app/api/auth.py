from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import (
    AdminSetupRequest,
    AdminSetupStatusResponse,
    LoginRequest,
    TokenResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    token = AuthService.login(db, request.email, request.password)

    if token is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return token


@router.get(
    "/setup-status",
    response_model=AdminSetupStatusResponse,
)
def setup_status(db: Session = Depends(get_db)):
    return {
        "setup_required": AuthService.setup_required(db),
        "setup_key_required": True,
    }


@router.post("/setup-admin", response_model=TokenResponse)
def setup_admin(
    request: AdminSetupRequest,
    db: Session = Depends(get_db),
):
    user = AuthService.setup_admin(db, request)

    if user is None:
        raise HTTPException(
            status_code=409,
            detail="Admin setup is not available.",
        )

    token = AuthService.login(
        db,
        request.email,
        request.password,
    )

    return token
