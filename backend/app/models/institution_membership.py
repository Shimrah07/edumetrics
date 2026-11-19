"""
EduMetrics — InstitutionMembership model.

Join table associating a User with an Institution and assigning a specific role.
A user can hold different roles across different institutions.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.institution import Institution
    from app.models.user import User


class InstitutionMembership(Base):
    """
    Associates a User with an Institution with a specific role.
    Roles: administrator | teacher | student
    """

    __tablename__ = "institution_memberships"

    # Primary key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # Foreign keys
    institution_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("institutions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Role within this institution
    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    # Status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default="true",
    )

    # Timezone-aware timestamps
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # Relationships
    institution: Mapped[Institution] = relationship(
        "Institution",
        back_populates="memberships",
    )
    user: Mapped[User] = relationship(
        "User",
        back_populates="memberships",
    )

    # Constraints: unique user per institution, role restricted to known values
    __table_args__ = (
        UniqueConstraint(
            "institution_id",
            "user_id",
            name="uq_institution_membership_institution_user",
        ),
        CheckConstraint(
            "role IN ('administrator', 'teacher', 'student')",
            name="ck_institution_membership_role",
        ),
    )

    def __repr__(self) -> str:
        return (
            f"<InstitutionMembership "
            f"id={self.id} "
            f"institution_id={self.institution_id} "
            f"user_id={self.user_id} "
            f"role={self.role!r}>"
        )

