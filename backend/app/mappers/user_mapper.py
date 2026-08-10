from app.models import User
from app.schemas.user import UserResponse


class UserMapper:

    @staticmethod
    def to_response(user: User) -> UserResponse:
        return UserResponse(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            role=user.role.name,
            is_active=user.is_active,
        )

    @staticmethod
    def to_response_list(users: list[User]) -> list[UserResponse]:
        return [UserMapper.to_response(user) for user in users]
