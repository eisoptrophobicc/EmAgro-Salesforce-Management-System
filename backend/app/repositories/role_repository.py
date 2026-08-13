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
    def get_by_name(
        db: Session,
        name: str,
    ):
        return db.query(Role).filter(Role.name == name).first()

    @staticmethod
    def get_or_create(
        db: Session,
        name: str,
        description: str | None = None,
    ):
        role = RoleRepository.get_by_name(
            db,
            name,
        )

        if role is not None:
            return role

        role = Role(
            name=name,
            description=description,
        )

        db.add(role)
        db.commit()
        db.refresh(role)

        return role

    @staticmethod
    def get_all(db: Session):
        return db.query(Role).order_by(Role.id).all()
