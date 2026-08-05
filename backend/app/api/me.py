from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models import User

router = APIRouter(prefix="/me", tags=["Authentication"],)

@router.get("")
def get_me(current_user: User = Depends(get_current_user),):
    return {
        "id": current_user.id,
        "name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.name,
        "active": current_user.is_active,
    }