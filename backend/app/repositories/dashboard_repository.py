from sqlalchemy import func
from sqlalchemy.orm import Session

from app.constants.roles import RoleEnum
from app.models import User


class DashboardRepository:

    @staticmethod
    def get_user_statistics(db: Session):
        total = db.query(func.count(User.id)).scalar()

        active = db.query(func.count(User.id)).filter(User.is_active == True).scalar()

        inactive = (
            db.query(func.count(User.id)).filter(User.is_active == False).scalar()
        )

        admins = (
            db.query(func.count(User.id))
            .join(User.role)
            .filter(User.role.has(name=RoleEnum.ADMIN.value))
            .scalar()
        )

        sub_admins = (
            db.query(func.count(User.id))
            .join(User.role)
            .filter(User.role.has(name=RoleEnum.SUB_ADMIN.value))
            .scalar()
        )

        return {
            "total": total,
            "active": active,
            "inactive": inactive,
            "admins": admins,
            "sub_admins": sub_admins,
            "employees": 0,
        }
