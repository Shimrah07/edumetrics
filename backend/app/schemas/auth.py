"""
EduMetrics — Authentication Pydantic schemas.

Defines request and response schemas for user registration,
user login, and JWT token issuance.
"""
import re
from typing import Optional

from pydantic import BaseModel, Field, field_validator

# RFC 5322 simplified standard email validation regex
EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$"
)


class UserRegisterRequest(BaseModel):
    """
    Schema for new user account registration.
    """

    first_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="User's first name (1 to 100 characters)",
    )
    last_name: Optional[str] = Field(
        default=None,
        max_length=100,
        description="User's optional last name (max 100 characters)",
    )
    email: str = Field(
        ...,
        description="User's primary email address (will be normalized to lowercase)",
    )
    password: str = Field(
        ...,
        min_length=8,
        description="Plaintext password (minimum 8 characters, no 72-byte truncation)",
    )

    @field_validator("first_name", mode="before")
    @classmethod
    def trim_first_name(cls, v: str) -> str:
        if isinstance(v, str):
            v = v.strip()
            if not v:
                raise ValueError("First name cannot be empty or whitespace only.")
        return v

    @field_validator("last_name", mode="before")
    @classmethod
    def trim_last_name(cls, v: Optional[str]) -> Optional[str]:
        if isinstance(v, str):
            v = v.strip()
            return v if v else None
        return v

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("Email must be a string.")
        v = v.strip().lower()
        if not v:
            raise ValueError("Email cannot be empty.")
        if not EMAIL_REGEX.match(v):
            raise ValueError("Invalid email address format.")
        return v


class UserLoginRequest(BaseModel):
    """
    Schema for user login credentials.
    """

    email: str = Field(
        ...,
        description="User's registered email address (normalized to lowercase)",
    )
    password: str = Field(
        ...,
        min_length=1,
        description="User's password (preserved exactly without trimming)",
    )

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("Email must be a string.")
        v = v.strip().lower()
        if not v:
            raise ValueError("Email cannot be empty.")
        if not EMAIL_REGEX.match(v):
            raise ValueError("Invalid email address format.")
        return v


class TokenResponse(BaseModel):
    """
    Schema returned upon successful authentication containing access token.
    """

    access_token: str = Field(..., description="JWT bearer access token")
    token_type: str = Field(default="bearer", description="Token type (bearer)")
    expires_in: int = Field(..., description="Token lifetime in seconds")
