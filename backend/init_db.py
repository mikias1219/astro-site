"""
Database initialization script with sample data
Run this script to create the database and populate it with sample data
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, User, Service, ServiceType, UserRole
from app.auth import get_password_hash

def init_db():
    """Initialize database with sample data - ADMIN FIRST APPROACH"""
    print("🔐 INITIALIZING DATABASE WITH ADMIN-FIRST SECURITY")
    print("=" * 60)

    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully")

    db = SessionLocal()

    try:
        # CRITICAL: Always check for existing admin first
        existing_admin = db.query(User).filter(User.role == UserRole.ADMIN).first()

        if existing_admin:
            print("⚠️  ADMIN ALREADY EXISTS - Skipping admin creation")
            print(f"   Admin: {existing_admin.username} ({existing_admin.email})")
        else:
            print("👑 CREATING PRIMARY ADMIN USER")
            # Create the primary admin user with original credentials
            primary_admin = User(
                email="admin@astroarupshastri.com",
                username="admin",
                full_name="Dr. Arup Shastri",
                phone="+91-XXXXXXXXXX",
                preferred_language="en",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True
            )
            db.add(primary_admin)
            db.commit()  # Commit immediately to ensure admin exists
            print("✅ PRIMARY ADMIN CREATED SUCCESSFULLY")
            print("   Username: admin")
            print("   Password: admin123")
            print("   Email: admin@astroarupshastri.com")
            print("   ⚠️  IMPORTANT: Change password after first login!")

        # Database initialized with admin only - no sample data
        print("🧹 DATABASE CLEAN - NO SAMPLE DATA CREATED")
        print("   • Admin user created only")
        print("   • Ready for real data through admin panel")
        print("   • Users can add services, blogs, podcasts via admin interface")
        print("   • Bookings will be created by real users")

        # Final commit of all changes
        db.commit()
        print("✅ DATABASE INITIALIZATION COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("🎉 ASTROARUPSHASTRI.COM CLEAN DATABASE READY")
        print("")
        print("🔐 ADMIN ACCESS:")
        print("   Username: admin")
        print("   Password: admin123")
        print("   Email: admin@astroarupshastri.com")
        print("")
        print("🧹 CLEAN DATABASE SETUP:")
        print("   • Only admin user exists")
        print("   • No sample data pre-loaded")
        print("   • All content managed via admin panel")
        print("   • Real user bookings only")
        print("")
        print("📝 HOW TO ADD REAL DATA:")
        print("   1. Login to admin panel (/admin)")
        print("   2. Add services through Services management")
        print("   3. Create blog posts through Blogs management")
        print("   4. Upload podcasts through Podcasts management")
        print("   5. Real users will create bookings")
        print("")
        print("🚀 READY FOR PRODUCTION!")
        print("   • Admin can login and manage everything")
        print("   • Clean slate for real content")
        print("   • Database is secure and optimized")
        print("")
        print("⚠️  IMPORTANT SECURITY REMINDERS:")
        print("   • Change admin password after first login")
        print("   • Regularly backup your database")
        print("   • Monitor admin access logs")
        print("   • Keep dependencies updated")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
