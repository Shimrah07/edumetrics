"""
EduMetrics — SQLAlchemy declarative base.
Import all models here so Alembic can discover them for autogenerate.
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all models below this line so Alembic sees them.
# Example: from app.models.user import User
