"""
EduMetrics — Authentication API endpoints.

Handles public user registration, user login / token generation,
and the authenticated user profile endpoint (/me).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.core.config import get_settings
from app.core.security import create_access_token
from app.db.session import get_db
from app.models.user import User
from app.repositories import user_repo
from app.schemas.auth import TokenResponse, UserLoginRequest, UserRegisterRequest
from app.schemas.user import (
    InstitutionMembershipSummary,
    UserProfileResponse,
    UserResponse,
)
from app.services.auth_service import (
    AuthenticationError,
    EmailAlreadyExistsError,
    InactiveUserError,
    authenticate_user,
    register_user,
)

router = APIRouter()
settings = get_settings()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user account",
)
def register(
    registration_data: UserRegisterRequest,
    db: Session = Depends(get_db),
):
    """
    Register a new user account.

    - Validates email format, trims whitespace, and normalizes to lowercase.
    - Hashes password using Argon2id without truncation.
    - Returns safe user account details (never exposes password_hash).
    - Returns HTTP 409 Conflict if email is already registered.
    """
    try:
        user = register_user(db, registration_data)
        return user
    except EmailAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=e.message,
        )


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and obtain JWT token",
)
def login(
    login_data: UserLoginRequest,
    db: Session = Depends(get_db),
):
    """
    Authenticate user with email and password to receive a JWT access token.

    - Verifies password against stored Argon2id hash.
    - Rejects invalid credentials with generic HTTP 401 (prevents user enumeration).
    - Rejects deactivated accounts with HTTP 403 Forbidden.
    - Returns signed JWT bearer token with subject set to user UUID.
    """
    try:
        user = authenticate_user(db, login_data)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.message,
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InactiveUserError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=e.message,
        )

    # Lifetime in seconds for TokenResponse
    expires_in_seconds = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    access_token = create_access_token(subject=str(user.id))

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=expires_in_seconds,
    )


@router.get(
    "/me",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile and institution memberships",
)
def get_current_user_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve profile details and active institution memberships for the
    currently authenticated user.

    - Requires valid Bearer JWT access token.
    - Rejects inactive accounts with HTTP 403.
    - Eagerly loads institution details (name, slug, type) for each membership.
    - Response never exposes password hashes, passwords, or global roles.
    """
    memberships = user_repo.get_user_memberships(db, current_user.id, active_only=True)

    membership_summaries = [
        InstitutionMembershipSummary(
            id=m.id,
            institution_id=m.institution_id,
            institution_name=m.institution.name,
            institution_slug=m.institution.slug,
            institution_type=m.institution.institution_type,
            role=m.role,
            is_active=m.is_active,
            joined_at=m.joined_at,
        )
        for m in memberships
    ]

    return UserProfileResponse(
        id=current_user.id,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email=current_user.email,
        is_active=current_user.is_active,
        is_email_verified=current_user.is_email_verified,
        created_at=current_user.created_at,
        memberships=membership_summaries,
    )
