#!/usr/bin/env python3
"""
Diagnostic script to test registration endpoint and database connection
Run this on the production server to identify registration issues
"""

import sys
import os
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

print("🔍 Starting Registration Diagnostic...\n")

# Test 1: Check environment variables
print("1️⃣  Checking environment variables...")
try:
    from dotenv import load_dotenv
    load_dotenv()
    
    db_url = os.getenv("DATABASE_URL")
    secret_key = os.getenv("SECRET_KEY")
    
    if db_url:
        # Hide password in URL
        safe_url = db_url.split('@')[1] if '@' in db_url else db_url
        print(f"   ✅ DATABASE_URL: ...@{safe_url}")
    else:
        print("   ❌ DATABASE_URL: Not set!")
        
    if secret_key:
        print(f"   ✅ SECRET_KEY: Set (length: {len(secret_key)})")
    else:
        print("   ❌ SECRET_KEY: Not set!")
except Exception as e:
    print(f"   ❌ Error loading environment: {e}")

# Test 2: Check database connection
print("\n2️⃣  Testing database connection...")
try:
    from app.database import engine, get_db
    from sqlalchemy import text
    
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("   ✅ Database connection successful")
except Exception as e:
    print(f"   ❌ Database connection failed: {e}")

# Test 3: Check database tables
print("\n3️⃣  Checking database tables...")
try:
    from app.models import User, Base
    from app.database import engine
    
    # Check if tables exist
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    if 'users' in tables:
        print("   ✅ 'users' table exists")
    else:
        print("   ❌ 'users' table missing!")
        print("   💡 Run: python -c \"from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)\"")
    
    if 'user_verifications' in tables:
        print("   ✅ 'user_verifications' table exists")
    else:
        print("   ⚠️  'user_verifications' table missing (may be needed for email verification)")
    
    print(f"   📊 Total tables found: {len(tables)}")
    
except Exception as e:
    print(f"   ❌ Table check failed: {e}")

# Test 4: Check User model
print("\n4️⃣  Testing User model...")
try:
    from app.models import User
    db = next(get_db())
    
    # Try to query users
    user_count = db.query(User).count()
    print(f"   ✅ Can query User table: {user_count} users found")
    
    # Check User model fields
    required_fields = ['email', 'username', 'full_name', 'hashed_password', 'role', 'is_active', 'is_verified']
    user_columns = [c.name for c in User.__table__.columns]
    
    missing_fields = [f for f in required_fields if f not in user_columns]
    if missing_fields:
        print(f"   ⚠️  Missing fields: {missing_fields}")
    else:
        print(f"   ✅ All required fields present")
    
    db.close()
except Exception as e:
    print(f"   ❌ User model test failed: {e}")

# Test 5: Test password hashing
print("\n5️⃣  Testing password hashing...")
try:
    from app.auth import get_password_hash, verify_password
    
    test_password = "testpassword123"
    hashed = get_password_hash(test_password)
    
    if verify_password(test_password, hashed):
        print("   ✅ Password hashing works correctly")
    else:
        print("   ❌ Password verification failed!")
except Exception as e:
    print(f"   ❌ Password hashing test failed: {e}")

# Test 6: Test UserCreate schema
print("\n6️⃣  Testing UserCreate schema...")
try:
    from app.schemas import UserCreate
    
    test_user = UserCreate(
        email="test@example.com",
        username="testuser",
        full_name="Test User",
        password="testpass123",
        phone="1234567890",
        preferred_language="en"
    )
    
    print("   ✅ UserCreate schema validation works")
except Exception as e:
    print(f"   ❌ UserCreate schema test failed: {e}")

# Test 7: Simulate registration (without committing)
print("\n7️⃣  Simulating registration process...")
try:
    from app.models import User, UserRole
    from app.auth import get_password_hash
    from app.schemas import UserCreate
    
    db = next(get_db())
    
    # Create test user data
    test_user_data = UserCreate(
        email="diagnostic@test.com",
        username="diagnostic_user",
        full_name="Diagnostic Test User",
        password="testpass123",
        phone="9999999999",
        preferred_language="en"
    )
    
    # Check if test user already exists
    existing = db.query(User).filter(User.email == test_user_data.email).first()
    if existing:
        print("   ℹ️  Test user already exists, skipping creation")
    else:
        # Try to create user (but rollback)
        hashed_password = get_password_hash(test_user_data.password)
        test_user = User(
            email=test_user_data.email,
            username=test_user_data.username,
            full_name=test_user_data.full_name,
            phone=test_user_data.phone,
            preferred_language=test_user_data.preferred_language,
            hashed_password=hashed_password,
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        )
        
        db.add(test_user)
        db.flush()  # Flush without committing
        
        print("   ✅ Can create user objects successfully")
        
        db.rollback()  # Rollback the test user
    
    db.close()
except Exception as e:
    print(f"   ❌ Registration simulation failed: {e}")
    import traceback
    traceback.print_exc()

# Test 8: Check dependencies
print("\n8️⃣  Checking Python dependencies...")
try:
    import fastapi
    import sqlalchemy
    import passlib
    import jose
    import pydantic
    
    print(f"   ✅ fastapi: {fastapi.__version__}")
    print(f"   ✅ sqlalchemy: {sqlalchemy.__version__}")
    print(f"   ✅ passlib: installed")
    print(f"   ✅ python-jose: installed")
    print(f"   ✅ pydantic: {pydantic.__version__}")
except ImportError as e:
    print(f"   ❌ Missing dependency: {e}")

# Summary
print("\n" + "="*50)
print("📋 DIAGNOSTIC SUMMARY")
print("="*50)
print("\nIf all tests pass ✅, the registration should work.")
print("If any tests fail ❌, check the BACKEND_500_ERROR_FIX.md guide.\n")
print("Common fixes:")
print("1. Create database tables: python -c \"from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)\"")
print("2. Set SECRET_KEY in .env file")
print("3. Install missing dependencies: pip install -r requirements.txt")
print("4. Restart the backend service")
print("\n" + "="*50)

