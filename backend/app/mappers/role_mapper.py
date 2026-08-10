from app.models import Role
from app.schemas.role import RoleResponse


class RoleMapper:

    @staticmethod
    def to_response(role: Role):
        return RoleResponse(id=role.id, name=role.name)

    @staticmethod
    def to_response_list(roles: list[Role]):
        return [RoleMapper.to_response(role) for role in roles]
