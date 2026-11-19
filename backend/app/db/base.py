"""
EduMetrics — SQLAlchemy declarative base.

Defines Base only. No model imports belong here.
All model registration for Alembic is handled in alembic/env.py.
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
