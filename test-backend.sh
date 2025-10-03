#!/bin/bash

# Test backend loading with proper virtual environment activation

echo "🔧 Testing Backend with Virtual Environment"
echo "==========================================="

BACKEND_DIR="/root/astroarupshastri-backend"

if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found: $BACKEND_DIR"
    exit 1
fi

cd "$BACKEND_DIR"

# Activate virtual environment
echo "🐍 Activating virtual environment..."
source venv/bin/activate

# Check if activation worked
if ! command -v python &> /dev/null; then
    echo "❌ Failed to activate virtual environment"
    exit 1
fi

echo "✅ Virtual environment activated"

# Load environment variables from .env file
if [ -f ".env" ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
else
    echo "⚠️  No .env file found in backend directory"
fi

# Run the Python test
echo "🧪 Running backend tests..."
python3 << 'EOF'
import sys
import os

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

    # Test router imports one by one
    print("4. Testing router imports...")
    routers_to_test = [
        'auth', 'users', 'pages', 'blogs', 'bookings', 'seo', 'seo_admin',
        'admin', 'services', 'faqs', 'testimonials', 'panchang', 'horoscopes',
        'podcasts', 'calculators', 'kundli', 'matching', 'numerology'
    ]

    failed_routers = []
    for router in routers_to_test:
        try:
            exec(f"from app.routers import {router}")
        except Exception as e:
            failed_routers.append(f"{router}: {e}")

    if failed_routers:
        print("   ⚠️  Some routers failed to import:")
        for failure in failed_routers:
            print(f"      - {failure}")
    else:
        print("   ✅ All router imports successful")

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
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backend test completed successfully!"
    echo "   The backend should start without issues."
else
    echo ""
    echo "❌ Backend test failed!"
    echo "   Check the error messages above."
    exit 1
fi
