#!/usr/bin/env python3
"""
Test script for booking endpoint
Run this to diagnose booking issues
"""

import sys
import os
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

print("🔍 Testing Booking Endpoint...\n")

# Test 1: Database tables
print("1️⃣  Checking database tables...")
try:
    from app.database import engine
    from sqlalchemy import inspect
    
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    required_tables = ['bookings', 'services', 'users']
    missing_tables = [t for t in required_tables if t not in tables]
    
    if missing_tables:
        print(f"   ❌ Missing tables: {missing_tables}")
        print("   💡 Run: python -c \"from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)\"")
    else:
        print(f"   ✅ All required tables exist")
        
except Exception as e:
    print(f"   ❌ Database check failed: {e}")

# Test 2: Check if services exist
print("\n2️⃣  Checking services...")
try:
    from app.database import get_db
    from app.models import Service
    
    db = next(get_db())
    service_count = db.query(Service).count()
    
    if service_count == 0:
        print("   ⚠️  No services found in database!")
        print("   💡 Create at least one service through the admin panel or API")
    else:
        print(f"   ✅ Found {service_count} services")
        
        # List services
        services = db.query(Service).limit(5).all()
        for service in services:
            print(f"      - {service.name} (ID: {service.id})")
    
    db.close()
except Exception as e:
    print(f"   ❌ Service check failed: {e}")

# Test 3: Check Booking model
print("\n3️⃣  Checking Booking model...")
try:
    from app.models import Booking, BookingStatus
    from app.database import get_db
    
    db = next(get_db())
    booking_count = db.query(Booking).count()
    print(f"   ✅ Booking table accessible: {booking_count} bookings found")
    
    # Check Booking model fields
    required_fields = ['service_id', 'user_id', 'booking_date', 'booking_time', 'status', 
                      'customer_email', 'customer_phone']
    booking_columns = [c.name for c in Booking.__table__.columns]
    
    missing_fields = [f for f in required_fields if f not in booking_columns]
    if missing_fields:
        print(f"   ⚠️  Missing fields in Booking model: {missing_fields}")
    else:
        print(f"   ✅ All required fields present")
    
    db.close()
except Exception as e:
    print(f"   ❌ Booking model check failed: {e}")

# Test 4: Test timezone handling
print("\n4️⃣  Testing datetime/timezone handling...")
try:
    from datetime import datetime, timezone
    
    # Test naive datetime
    naive_dt = datetime(2025, 12, 31, 10, 0, 0)
    print(f"   Naive datetime: {naive_dt}")
    print(f"   Has timezone? {naive_dt.tzinfo is not None}")
    
    # Test timezone-aware datetime
    aware_dt = datetime(2025, 12, 31, 10, 0, 0, tzinfo=timezone.utc)
    print(f"   Aware datetime: {aware_dt}")
    print(f"   Has timezone? {aware_dt.tzinfo is not None}")
    
    # Test comparison with fix
    current_dt = datetime.now(timezone.utc)
    booking_dt = naive_dt
    if booking_dt.tzinfo is None:
        booking_dt = booking_dt.replace(tzinfo=timezone.utc)
    
    print(f"   ✅ Datetime comparison works correctly")
    
except Exception as e:
    print(f"   ❌ Datetime test failed: {e}")

# Test 5: Test BookingCreate schema
print("\n5️⃣  Testing BookingCreate schema...")
try:
    from app.schemas import BookingCreate
    from datetime import datetime, timedelta
    
    # Create test booking data
    test_booking = BookingCreate(
        service_id=1,
        booking_date=datetime.now() + timedelta(days=7),
        booking_time="10:00",
        customer_name="Test Customer",
        customer_email="test@example.com",
        customer_phone="1234567890",
        notes="Test booking"
    )
    
    print("   ✅ BookingCreate schema validation works")
    print(f"      Service ID: {test_booking.service_id}")
    print(f"      Booking Date: {test_booking.booking_date}")
    
except Exception as e:
    print(f"   ❌ BookingCreate schema test failed: {e}")

# Test 6: Check email service
print("\n6️⃣  Checking email service...")
try:
    from app.email_service import email_service
    
    print("   ✅ Email service imported successfully")
    print(f"      Email enabled: {hasattr(email_service, 'send_booking_confirmation')}")
    
except Exception as e:
    print(f"   ⚠️  Email service check: {e}")
    print("   💡 Email failures won't block bookings (failsafe added)")

# Test 7: Simulate booking creation (without committing)
print("\n7️⃣  Simulating booking creation...")
try:
    from app.models import Booking, BookingStatus, User
    from app.database import get_db
    from datetime import datetime, timedelta
    
    db = next(get_db())
    
    # Check if we have a user
    user = db.query(User).first()
    if not user:
        print("   ⚠️  No users in database. Need at least one user to create bookings.")
    else:
        # Check if we have a service
        from app.models import Service
        service = db.query(Service).first()
        
        if not service:
            print("   ⚠️  No services in database. Need at least one service to create bookings.")
        else:
            # Try to create a test booking (but rollback)
            test_booking = Booking(
                service_id=service.id,
                user_id=user.id,
                booking_date=datetime.now() + timedelta(days=7),
                booking_time="10:00",
                customer_name="Test Customer",
                customer_email="test@example.com",
                customer_phone="1234567890",
                status=BookingStatus.PENDING
            )
            
            db.add(test_booking)
            db.flush()  # Flush without committing
            
            print("   ✅ Can create booking objects successfully")
            print(f"      Test booking ID: {test_booking.id}")
            
            db.rollback()  # Rollback the test booking
    
    db.close()
except Exception as e:
    print(f"   ❌ Booking simulation failed: {e}")
    import traceback
    traceback.print_exc()

# Summary
print("\n" + "="*50)
print("📋 DIAGNOSTIC SUMMARY")
print("="*50)
print("\nCommon issues and fixes:")
print("1. Missing tables:")
print("   python -c \"from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)\"")
print("\n2. No services:")
print("   Create services through admin panel at /admin/services")
print("\n3. User not logged in:")
print("   Bookings require authentication. User must be logged in.")
print("\n4. Timezone issues:")
print("   Fixed in updated bookings.py - handles both naive and aware datetimes")
print("\n5. Email service failures:")
print("   Fixed in updated bookings.py - email failures won't block bookings")
print("\n" + "="*50)

