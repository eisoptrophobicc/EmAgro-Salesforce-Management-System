from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.mappers.role_mapper import RoleMapper
from app.models import User
from app.schemas.role import RoleResponse
from app.services.role_service import RoleService

router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
)


@router.get(
    "",
    response_model=list[RoleResponse],
)
def get_roles(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    roles = RoleService.get_all_roles(db)

    return RoleMapper.to_response_list(roles)
