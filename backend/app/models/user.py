"""
EduMetrics — User model.

Represents a global user account (administrator, teacher, or student).
A user account is institution-agnostic and can belong to multiple institutions
via InstitutionMembership. Roles are assigned at the membership level, not here.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, CheckConstraint, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.institution_membership import InstitutionMembership


class User(Base):
    """
    A platform user. Institution membership and role are NOT stored on
    this model — they are managed through InstitutionMembership, which
    allows one user account to belong to multiple institutions with
    different roles in each.

    email is always stored in lowercase. Normalisation must be applied
    in the service layer before any insert or lookup.

    password_hash stores the result of a secure hashing algorithm
    (e.g. bcrypt). Plain-text passwords must never be stored here.
    The hashing implementation will be added in the authentication module.
    """

    __tablename__ = "users"

    # Primary key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # Name
    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    last_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    # Authentication
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # Status flags
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default="true",
    )
    is_email_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        server_default="false",
    )

    # Timezone-aware timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships: one user has memberships in multiple institutions
    memberships: Mapped[list[InstitutionMembership]] = relationship(
        "InstitutionMembership",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Table-level constraints
    __table_args__ = (
        CheckConstraint(
            "email = lower(email)",
            name="ck_users_email_lowercase",
        ),
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"
