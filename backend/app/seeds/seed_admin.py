from sqlalchemy.orm import Session

import app.models
from app.constants.roles import RoleEnum
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import Role, User

def seed_admin():
    db: Session = SessionLocal()

    try:
        admin_role = (db.query(Role).filter(Role.name == RoleEnum.ADMIN.value).first())

        if not admin_role:
            print("Admin role not found.")
            return

        existing_admin = (db.query(User).filter(User.email == "admin@emamiagrotech.com").first())

        if existing_admin:
            print("Admin user already exists.")
            return

        admin = User(
            full_name="System Administrator",
            email="admin@emamiagrotech.com",
            hashed_password=hash_password("admin123"),
            role_id=admin_role.id,
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("Admin user created successfully!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()