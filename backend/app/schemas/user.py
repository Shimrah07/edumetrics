"""
EduMetrics — User & Membership Pydantic schemas.

Defines response representations for user accounts and their institution
memberships. All schemas strictly exclude sensitive fields like password_hash.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UserResponse(BaseModel):
    """
    Public representation of a user account.
    Excludes password_hash, global roles, or institution IDs.
    """

    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(..., description="Unique user identifier (UUID)")
    first_name: str = Field(..., description="User's first name")
    last_name: Optional[str] = Field(default=None, description="User's optional last name")
    email: str = Field(..., description="User's registered lowercase email address")
    is_active: bool = Field(..., description="Whether the user account is active")
    is_email_verified: bool = Field(..., description="Whether the user's email has been verified")
    created_at: datetime = Field(..., description="Account creation timestamp (timezone-aware)")


class InstitutionMembershipSummary(BaseModel):
    """
    Summary representation of a user's membership in an educational institution.
    """

    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(..., description="Unique membership identifier (UUID)")
    institution_id: UUID = Field(..., description="Identifier of the associated institution")
    institution_name: str = Field(..., description="Name of the institution")
    institution_slug: str = Field(..., description="URL slug of the institution")
    institution_type: str = Field(..., description="Institution type (school, college, university, coaching)")
    role: str = Field(..., description="User's role in this institution (administrator, teacher, student)")
    is_active: bool = Field(..., description="Whether this membership is active")
    joined_at: datetime = Field(..., description="Timestamp when the user joined this institution")


class UserProfileResponse(UserResponse):
    """
    Extended profile representation for the authenticated user (/me endpoint),
    combining core user account details with all their active institution memberships.
    """

    model_config = ConfigDict(from_attributes=True)

    memberships: list[InstitutionMembershipSummary] = Field(
        default_factory=list,
        description="List of active institution memberships and roles held by this user",
    )
