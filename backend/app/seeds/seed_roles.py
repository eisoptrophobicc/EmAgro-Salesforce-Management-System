from sqlalchemy.orm import Session

from app.core.database import SessionLocal
import app.models
from app.models import Role
from app.constants.roles import RoleEnum

def seed_roles():
    db: Session = SessionLocal()

    try:
        roles = [
            {
                "name": RoleEnum.ADMIN.value,
                "description": "Full system access"
            },
            {
                "name": RoleEnum.SUB_ADMIN.value,
                "description": "Limited administrative access"
            }
        ]

        for role_data in roles:
            existing_role = (db.query(Role).filter(Role.name == role_data["name"]).first())

            if not existing_role:
                db.add(Role(**role_data))

        db.commit()
        print("Roles seeded successfully!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_roles()