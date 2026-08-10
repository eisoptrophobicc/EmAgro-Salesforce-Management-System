from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models import User


class UserRepository:
    @staticmethod
    def get_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def create(db: Session, user: User):
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_by_id(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def email_exists(db: Session, email: str) -> bool:
        return db.query(User).filter(User.email == email).first() is not None

    @staticmethod
    def get_all(
        db: Session,
        page: int,
        page_size: int,
        search: str | None = None,
        role_id: int | None = None,
        active: bool | None = None,
        sort_by: str = "id",
        order: str = "asc",
    ):
        query = db.query(User)

        if search:
            query = query.filter(
                or_(
                    User.full_name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%"),
                )
            )

        if role_id is not None:
            query = query.filter(User.role_id == role_id)

        if active is not None:
            query = query.filter(User.is_active == active)

        total = query.count()

        sort_columns = {
            "id": User.id,
            "full_name": User.full_name,
            "email": User.email,
        }

        sort_column = sort_columns.get(sort_by, User.id)

        if order.lower() == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        users = query.offset((page - 1) * page_size).limit(page_size).all()
        return users, total

    @staticmethod
    def update(db: Session, user: User):
        try:
            db.commit()
            db.refresh(user)
            return user
        except SQLAlchemyError:
            db.rollback()
            raise
