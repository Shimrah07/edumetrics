"""
EduMetrics — User repository.

Encapsulates database access operations for User and InstitutionMembership
entities using SQLAlchemy 2.0 select statements and eager loading.
"""
from typing import Optional, Union
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.institution_membership import InstitutionMembership
from app.models.user import User


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Retrieve a user by normalized email address.
    Applies whitespace trimming and lowercase canonicalization.
    """
    normalized_email = email.strip().lower()
    stmt = select(User).where(User.email == normalized_email)
    return db.scalars(stmt).first()


def get_user_by_id(db: Session, user_id: Union[UUID, str]) -> Optional[User]:
    """
    Retrieve a user by their UUID primary key.
    Accepts either a UUID instance or a valid UUID string.
    """
    if isinstance(user_id, str):
        try:
            user_id = UUID(user_id)
        except ValueError:
            return None

    stmt = select(User).where(User.id == user_id)
    return db.scalars(stmt).first()


def create_user(
    db: Session,
    first_name: str,
    last_name: Optional[str],
    email: str,
    password_hash: str,
) -> User:
    """
    Create a new User entity and add it to the current database session.
    Flushes the session to populate server defaults (id, created_at, updated_at).

    Transaction boundaries:
    - This function issues db.add() and db.flush().
    - The calling service layer is responsible for commit() or rollback().
    """
    normalized_email = email.strip().lower()
    clean_last_name = last_name.strip() if last_name and last_name.strip() else None

    user = User(
        first_name=first_name.strip(),
        last_name=clean_last_name,
        email=normalized_email,
        password_hash=password_hash,
    )
    db.add(user)
    db.flush()
    return user


def get_user_memberships(
    db: Session,
    user_id: Union[UUID, str],
    active_only: bool = True,
) -> list[InstitutionMembership]:
    """
    Retrieve all institution memberships for a user, eagerly loading
    the associated institution details via joinedload to eliminate N+1 queries.
    """
    if isinstance(user_id, str):
        try:
            user_id = UUID(user_id)
        except ValueError:
            return []

    stmt = (
        select(InstitutionMembership)
        .options(joinedload(InstitutionMembership.institution))
        .where(InstitutionMembership.user_id == user_id)
    )
    if active_only:
        stmt = stmt.where(InstitutionMembership.is_active.is_(True))

    stmt = stmt.order_by(InstitutionMembership.joined_at.desc())
    return list(db.scalars(stmt).all())


def get_membership(
    db: Session,
    user_id: Union[UUID, str],
    institution_id: Union[UUID, str],
) -> Optional[InstitutionMembership]:
    """
    Retrieve a specific institution membership for a user, eagerly loading
    the associated institution details.
    """
    if isinstance(user_id, str):
        try:
            user_id = UUID(user_id)
        except ValueError:
            return None

    if isinstance(institution_id, str):
        try:
            institution_id = UUID(institution_id)
        except ValueError:
            return None

    stmt = (
        select(InstitutionMembership)
        .options(joinedload(InstitutionMembership.institution))
        .where(
            InstitutionMembership.user_id == user_id,
            InstitutionMembership.institution_id == institution_id,
        )
    )
    return db.scalars(stmt).first()

