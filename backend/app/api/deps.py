"""
EduMetrics — API dependencies.

Provides FastAPI dependency injection functions for:
- Database sessions
- JWT Bearer token authentication (get_current_user, get_current_active_user)
- Multi-tenant institution membership verification (get_institution_membership)
- Role-based access control scoped to institutions (require_institution_role)
"""
from typing import Callable, Optional, Sequence, Union
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.institution_membership import InstitutionMembership
from app.models.user import User
from app.repositories import user_repo

# Standard HTTPBearer scheme. auto_error=False allows returning custom 401 with WWW-Authenticate header
bearer_scheme = HTTPBearer(auto_error=False)

# Recognized roles in EduMetrics
PERMITTED_ROLES = {"administrator", "teacher", "student"}


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Authenticate the request by extracting and validating the JWT Bearer token.

    Rejects missing, malformed, expired, or invalid tokens with HTTP 401.
    Includes the 'WWW-Authenticate: Bearer' header.
    Validates token subject as a UUID and retrieves the active/inactive User ORM entity.
    """
    authenticate_header = {"WWW-Authenticate": "Bearer"}

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing.",
            headers=authenticate_header,
        )

    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme. Bearer token required.",
            headers=authenticate_header,
        )

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired, or tampered authentication token.",
            headers=authenticate_header,
        )

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token subject claim is missing.",
            headers=authenticate_header,
        )

    try:
        user_id = UUID(str(sub))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed token subject identifier.",
            headers=authenticate_header,
        )

    user = user_repo.get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account associated with this token was not found.",
            headers=authenticate_header,
        )

    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Ensures the authenticated user account is active.
    Rejects inactive users with HTTP 403 Forbidden.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )
    return current_user


def get_institution_membership(
    institution_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> InstitutionMembership:
    """
    Verify that the current active user possesses an active membership
    within the specific institution identified by institution_id.

    Rejects non-members or inactive memberships with HTTP 403 Forbidden.
    Never trusts an institution ID or role supplied in request body or token.
    """
    membership = user_repo.get_membership(
        db,
        user_id=current_user.id,
        institution_id=institution_id,
    )

    if membership is None or not membership.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have an active membership in this institution.",
        )

    return membership


def require_institution_role(
    permitted_roles: Union[str, Sequence[str]],
) -> Callable[[InstitutionMembership], InstitutionMembership]:
    """
    Reusable dependency factory that enforces institution-scoped role permissions.

    Checks that the user's membership role within the target institution
    matches one of the permitted roles.

    Raises HTTP 403 Forbidden if the user's role is not authorized.
    """
    if isinstance(permitted_roles, str):
        allowed_set = {permitted_roles}
    else:
        allowed_set = set(permitted_roles)

    # Validate that specified roles are recognized in the system
    unknown_roles = allowed_set - PERMITTED_ROLES
    if unknown_roles:
        raise ValueError(
            f"Invalid role(s) specified in permission check: {unknown_roles}. "
            f"Allowed roles: {PERMITTED_ROLES}"
        )

    def role_dependency(
        membership: InstitutionMembership = Depends(get_institution_membership),
    ) -> InstitutionMembership:
        if membership.role not in allowed_set:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {', '.join(sorted(allowed_set))}.",
            )
        return membership

    return role_dependency
