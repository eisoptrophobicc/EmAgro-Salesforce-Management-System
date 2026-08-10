from sqlalchemy.orm import Session

from app.models import Role


class RoleRepository:

    @staticmethod
    def get_by_id(
        db: Session,
        role_id: int,
    ):
        return db.query(Role).filter(Role.id == role_id).first()

    @staticmethod
    def get_all(db: Session):
        return db.query(Role).order_by(Role.id).all()
