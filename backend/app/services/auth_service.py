"""
EduMetrics — Authentication service.

Orchestrates user registration, password verification, and credential checks.
Manages transaction commit/rollback boundaries and raises explicit domain exceptions.
"""
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.repositories import user_repo
from app.schemas.auth import UserLoginRequest, UserRegisterRequest


class AuthError(Exception):
    """Base exception for authentication and registration domain errors."""

    pass


class EmailAlreadyExistsError(AuthError):
    """Raised when an email address is already registered."""

    def __init__(self, message: str = "An account with this email already exists."):
        super().__init__(message)
        self.message = message


class AuthenticationError(AuthError):
    """Raised when credentials are invalid (nonexistent user or incorrect password)."""

    def __init__(self, message: str = "Invalid email or password."):
        super().__init__(message)
        self.message = message


class InactiveUserError(AuthError):
    """Raised when an authenticated user's account is deactivated."""

    def __init__(self, message: str = "User account is inactive."):
        super().__init__(message)
        self.message = message


def register_user(db: Session, registration_data: UserRegisterRequest) -> User:
    """
    Register a new user account.

    - Normalizes email.
    - Checks whether the email is already in use.
    - Hashes password using Argon2id without truncation.
    - Persists the user record with an atomic commit.
    - Handles concurrent registration conflicts via IntegrityError catch and rollback.
    - Returns the created User entity.
    """
    normalized_email = registration_data.email.strip().lower()

    # Pre-check for duplicate email
    existing_user = user_repo.get_user_by_email(db, normalized_email)
    if existing_user is not None:
        raise EmailAlreadyExistsError()

    # Hash password using Argon2id (never store or log plaintext)
    hashed_password = hash_password(registration_data.password)

    try:
        user = user_repo.create_user(
            db=db,
            first_name=registration_data.first_name,
            last_name=registration_data.last_name,
            email=normalized_email,
            password_hash=hashed_password,
        )
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        # Handles concurrent race condition where two requests pass pre-check simultaneously
        raise EmailAlreadyExistsError()
    except Exception:
        db.rollback()
        raise


def authenticate_user(db: Session, login_data: UserLoginRequest) -> User:
    """
    Authenticate a user by email and password.

    - Normalizes email.
    - Retrieves user record.
    - Verifies password against stored Argon2id hash.
    - Returns generic AuthenticationError on missing user or bad password.
    - Rejects inactive accounts with InactiveUserError.
    - Returns User entity upon successful verification.
    """
    normalized_email = login_data.email.strip().lower()

    user = user_repo.get_user_by_email(db, normalized_email)
    if user is None:
        # Nonexistent user -> generic failure prevents user enumeration
        raise AuthenticationError()

    if not verify_password(login_data.password, user.password_hash):
        # Incorrect password -> generic failure
        raise AuthenticationError()

    if not user.is_active:
        # Deactivated account
        raise InactiveUserError()

    return user
