
"""Alembic environment configuration for EduMetrics."""

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

from app.core.config import get_settings
from app.db.base import Base

# Explicit model imports — registers all tables in Base.metadata so that
# Alembic autogenerate can detect schema changes. Add each new model here.
from app.models.institution import Institution  # noqa: F401
from app.models.institution_membership import InstitutionMembership  # noqa: F401
from app.models.user import User  # noqa: F401

# Import all models here as they are created.
# This allows Alembic to discover them.

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Load database URL from the same settings used by FastAPI.
settings = get_settings()
database_url = settings.DATABASE_URL

# Escape percent characters for Alembic configuration.
config.set_main_option(
    "sqlalchemy.url",
    database_url.replace("%", "%%"),
)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
