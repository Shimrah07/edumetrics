"""
EduMetrics — Core security utilities.

Handles password hashing via Argon2id (pwdlib) and JWT access token
generation/verification via PyJWT.
"""
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import jwt
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from app.core.config import get_settings

# Configure PasswordHash with Argon2id hasher
_password_hash = PasswordHash((Argon2Hasher(),))


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using Argon2id.

    Argon2id handles passwords of arbitrary length without truncation.
    Plaintext passwords must never be logged or stored.
    """
    return _password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against an Argon2id hash.

    Returns True if the password matches, False otherwise.
    """
    return _password_hash.verify(plain_password, hashed_password)


def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Generate a signed JWT access token for an authenticated subject.

    - sub is set to the user's UUID string.
    - Includes issued-at (iat) and expiration (exp) claims.
    - Never includes passwords, institution IDs, or roles in the token.
    """
    settings = get_settings()
    now = datetime.now(timezone.utc)

    if expires_delta is not None:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: dict[str, Any] = {
        "sub": str(subject),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return token


def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    """
    Decode and validate a JWT access token.

    Pins the decoding algorithm to the configured settings.JWT_ALGORITHM.
    Safely rejects expired, malformed, or invalid tokens by returning None.
    """
    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.PyJWTError:
        # Invalid signature, bad format, or algorithm mismatch
        return None
