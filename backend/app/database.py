"""
Database configuration and session management
Supports SQLite for testing and PostgreSQL/MySQL for production
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import os
from typing import Generator

# Database URL configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./astrology_website.db"  # Default to SQLite for simplicity
)

# Create engine with different configurations for different databases
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False  # Disabled echo for production
    )
elif DATABASE_URL.startswith("mysql"):
    # MySQL configuration optimized for Hostinger
    engine = create_engine(
        DATABASE_URL,
        echo=False,  # Disabled echo for production
        pool_pre_ping=True,
        pool_recycle=3600,  # 1 hour recycle for MySQL
        pool_size=10,
        max_overflow=20,
        pool_timeout=30
    )
elif DATABASE_URL.startswith("postgresql"):
    # PostgreSQL configuration
    engine = create_engine(
        DATABASE_URL,
        echo=False,  # Disabled echo for production
        pool_pre_ping=True,
        pool_recycle=300
    )
else:
    # Fallback configuration
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_recycle=300
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency to get database session
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Metadata for database operations
metadata = MetaData()
