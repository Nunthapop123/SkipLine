from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

# Add parent directory to path so we can import app module
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole


DEFAULT_STAFF_NAME = "SkipLine Staff"
DEFAULT_STAFF_EMAIL = "staff@skipline.com"
DEFAULT_STAFF_PASSWORD = "staff123"
DEFAULT_ADMIN_NAME = "SkipLine Admin"
DEFAULT_ADMIN_EMAIL = "admin@skipline.com"
DEFAULT_ADMIN_PASSWORD = "admin123"


def upsert_user(*, db, name: str, email: str, phone: str | None, password: str, role: UserRole) -> tuple[User, str]:
    existing_user = db.query(User).filter(User.email == email).first()
    password_hash = get_password_hash(password)

    if existing_user:
        existing_user.name = name
        existing_user.phone = phone
        existing_user.password_hash = password_hash
        existing_user.role = role
        action = "updated"
        user = existing_user
    else:
        user = User(
            name=name,
            email=email,
            phone=phone,
            password_hash=password_hash,
            role=role,
        )
        db.add(user)
        action = "created"

    db.commit()
    db.refresh(user)
    return user, action


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Create or refresh the staff portal super users: one STAFF account and one ADMIN account."
    )
    parser.add_argument("--staff-name", default=os.getenv("STAFF_NAME", DEFAULT_STAFF_NAME))
    parser.add_argument("--staff-email", default=os.getenv("STAFF_EMAIL", DEFAULT_STAFF_EMAIL))
    parser.add_argument("--staff-password", default=os.getenv("STAFF_PASSWORD", DEFAULT_STAFF_PASSWORD))
    parser.add_argument("--staff-phone", default=os.getenv("STAFF_PHONE"))
    parser.add_argument("--admin-name", default=os.getenv("ADMIN_NAME", DEFAULT_ADMIN_NAME))
    parser.add_argument("--admin-email", default=os.getenv("ADMIN_EMAIL", DEFAULT_ADMIN_EMAIL))
    parser.add_argument("--admin-password", default=os.getenv("ADMIN_PASSWORD", DEFAULT_ADMIN_PASSWORD))
    parser.add_argument("--admin-phone", default=os.getenv("ADMIN_PHONE"))
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    with SessionLocal() as db:
        staff_user, staff_action = upsert_user(
            db=db,
            name=args.staff_name,
            email=args.staff_email,
            phone=args.staff_phone,
            password=args.staff_password,
            role=UserRole.STAFF,
        )
        admin_user, admin_action = upsert_user(
            db=db,
            name=args.admin_name,
            email=args.admin_email,
            phone=args.admin_phone,
            password=args.admin_password,
            role=UserRole.ADMIN,
        )

        # Capture attributes while session is still open
        staff_email = staff_user.email
        staff_role = staff_user.role.value
        admin_email = admin_user.email
        admin_role = admin_user.role.value

    print(f"\n✓ {staff_action.capitalize()} staff account:")
    print(f"  Email: {staff_email}")
    print(f"  Password: {args.staff_password}")
    print(f"  Role: {staff_role}\n")
    print(f"✓ {admin_action.capitalize()} admin account:")
    print(f"  Email: {admin_email}")
    print(f"  Password: {args.admin_password}")
    print(f"  Role: {admin_role}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())