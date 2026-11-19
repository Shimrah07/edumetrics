"""
EduMetrics — Schemas package.

Exports Pydantic request and response schemas.
"""
from app.schemas.auth import (
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
)
from app.schemas.user import (
    InstitutionMembershipSummary,
    UserProfileResponse,
    UserResponse,
)

__all__ = [
    "TokenResponse",
    "UserLoginRequest",
    "UserRegisterRequest",
    "InstitutionMembershipSummary",
    "UserProfileResponse",
    "UserResponse",
]
