#!/usr/bin/env python3

# Test script to debug FastAPI app loading issues

import sys
import os

# Change to backend directory
os.chdir('/root/astroarupshastri-backend')

# Activate virtual environment
venv_path = '/root/astroarupshastri-backend/venv/bin/activate_this.py'
if os.path.exists(venv_path):
    with open(venv_path) as f:
        exec(f.read(), {'__file__': venv_path})
else:
    # Fallback: try to activate using subprocess
    import subprocess
    subprocess.run(['source', '/root/astroarupshastri-backend/venv/bin/activate'], shell=True, executable='/bin/bash')

print("Testing FastAPI app loading...")

try:
    # Test basic imports
    print("1. Testing basic imports...")
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    print("   ✅ Basic FastAPI imports successful")

    # Test database import
    print("2. Testing database import...")
    from app.database import engine, Base
    print("   ✅ Database imports successful")

    # Test database connection
    print("3. Testing database connection...")
    from sqlalchemy import text
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("   ✅ Database connection successful")

    # Test router imports
    print("4. Testing router imports...")
    from app.routers import auth
    print("   ✅ Auth router import successful")

    # Test main app import
    print("5. Testing main app import...")
    from main import app
    print("   ✅ Main app import successful")

    print("\n🎉 All tests passed! App should load correctly.")

except Exception as e:
    print(f"\n❌ Test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
