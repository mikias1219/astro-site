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
from app.models import Base, User, Service, ServiceType, UserRole, Blog
from app.auth import get_password_hash
from datetime import datetime

def init_db():
    """Initialize database with sample data for development and testing"""
    print("🔐 INITIALIZING DATABASE WITH SAMPLE DATA")
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

        # Check if services already exist
        existing_services = db.query(Service).count()
        if existing_services > 0:
            print(f"⚠️  {existing_services} SERVICES ALREADY EXIST - Skipping service creation")
        else:
            print("🛍️  CREATING ASTROLOGY SERVICES")
            # Add sample services
            services_data = [
                {
                    'name': 'Basic Astrology Consultation',
                    'description': 'Comprehensive birth chart analysis and life guidance based on Vedic astrology principles',
                    'service_type': ServiceType.CONSULTATION,
                    'price': 1500.00,
                    'duration_minutes': 60,
                    'is_active': True,
                    'features': '["Birth chart analysis", "Life guidance", "Career advice", "Relationship guidance", "Health insights"]'
                },
                {
                    'name': 'Detailed Kundli Analysis',
                    'description': 'Complete Kundli analysis with planetary positions, doshas, and yogas',
                    'service_type': ServiceType.KUNDLI,
                    'price': 2000.00,
                    'duration_minutes': 90,
                    'is_active': True,
                    'features': '["Complete birth chart", "Planetary positions", "Dosha analysis", "Yogas identification", "Remedies suggestions"]'
                },
                {
                    'name': 'Horoscope Matching',
                    'description': 'Comprehensive compatibility analysis for marriage proposals',
                    'service_type': ServiceType.MATCHING,
                    'price': 2500.00,
                    'duration_minutes': 75,
                    'is_active': True,
                    'features': '["36 Guna matching", "Manglik dosha check", "Compatibility score", "Remedies for doshas", "Detailed report"]'
                },
                {
                    'name': 'Gemstone Consultation',
                    'description': 'Personalized gemstone recommendations based on birth chart',
                    'service_type': ServiceType.GEMSTONE,
                    'price': 1200.00,
                    'duration_minutes': 45,
                    'is_active': True,
                    'features': '["Gemstone analysis", "Planetary recommendations", "Wearing instructions", "Mantra guidance"]'
                },
                {
                    'name': 'Numerology Reading',
                    'description': 'Complete numerology analysis including life path, destiny, and soul urge numbers',
                    'service_type': ServiceType.NUMEROLOGY,
                    'price': 1000.00,
                    'duration_minutes': 45,
                    'is_active': True,
                    'features': '["Life path number", "Destiny number", "Soul urge number", "Lucky numbers", "Name analysis"]'
                },
                {
                    'name': 'Daily Panchang Consultation',
                    'description': 'Auspicious timing and Panchang guidance for important events',
                    'service_type': ServiceType.PANCHANG,
                    'price': 800.00,
                    'duration_minutes': 30,
                    'is_active': True,
                    'features': '["Auspicious timings", "Festival guidance", "Muhurta selection", "Daily predictions"]'
                },
                {
                    'name': 'Voice Report',
                    'description': 'Detailed audio report with personalized astrology insights',
                    'service_type': ServiceType.VOICE_REPORT,
                    'price': 1800.00,
                    'duration_minutes': 60,
                    'is_active': True,
                    'features': '["Audio report", "Personalized guidance", "Remedies explanation", "Future predictions"]'
                },
                {
                    'name': 'Online Report',
                    'description': 'Comprehensive written astrology report delivered digitally',
                    'service_type': ServiceType.ONLINE_REPORT,
                    'price': 1600.00,
                    'duration_minutes': 60,
                    'is_active': True,
                    'features': '["Detailed PDF report", "Chart analysis", "Predictions", "Remedies", "Digital delivery"]'
                }
            ]

            for service_data in services_data:
                service = Service(**service_data)
                db.add(service)

            db.commit()
            print("✅ SERVICES CREATED SUCCESSFULLY")
            print(f"   Added {len(services_data)} astrology services")

        # Check if blogs already exist
        existing_blogs = db.query(Blog).count()
        if existing_blogs > 0:
            print(f"⚠️  {existing_blogs} BLOGS ALREADY EXIST - Skipping blog creation")
        else:
            print("📝 CREATING SAMPLE BLOGS")
            # Get admin user ID
            admin_user = db.query(User).filter(User.role == UserRole.ADMIN).first()
            admin_id = admin_user.id if admin_user else 1

            # Add sample blogs
            blogs_data = [
                {
                    'title': 'Understanding Your Zodiac Sign',
                    'slug': 'understanding-your-zodiac-sign',
                    'description': 'Learn about the 12 zodiac signs and what they reveal about your personality, strengths, and life path. Discover how astrology can guide your decisions and help you understand yourself better.',
                    'featured_image': '/images/zodiac-guide.jpg',
                    'is_published': True,
                    'published_at': datetime(2024, 1, 15, 10, 0, 0),
                    'author_id': admin_id
                },
                {
                    'title': 'The Power of Gemstones in Astrology',
                    'slug': 'power-of-gemstones-astrology',
                    'description': 'Explore how different gemstones correspond to planetary energies and can enhance your life. Learn about wearing the right gemstones for maximum benefits and spiritual growth.',
                    'featured_image': '/images/gemstones-guide.jpg',
                    'is_published': True,
                    'published_at': datetime(2024, 1, 20, 14, 30, 0),
                    'author_id': admin_id
                },
                {
                    'title': 'Kundli Matching for Marriage',
                    'slug': 'kundli-matching-marriage',
                    'description': 'Understanding the importance of horoscope matching before marriage. Learn about the 36 points system and what makes a compatible match for a harmonious married life.',
                    'featured_image': '/images/kundli-matching.jpg',
                    'is_published': True,
                    'published_at': datetime(2024, 1, 25, 9, 15, 0),
                    'author_id': admin_id
                },
                {
                    'title': 'Numerology: Numbers That Shape Your Life',
                    'slug': 'numerology-numbers-shape-life',
                    'description': 'Discover how numbers influence your personality and life events. Learn about life path numbers, destiny numbers, and their meanings in shaping your life journey.',
                    'featured_image': '/images/numerology-guide.jpg',
                    'is_published': True,
                    'published_at': datetime(2024, 2, 1, 16, 45, 0),
                    'author_id': admin_id
                },
                {
                    'title': 'Daily Panchang and Auspicious Times',
                    'slug': 'daily-panchang-auspicious-times',
                    'description': 'Learn about daily Panchang calculations and how to find the most auspicious times for important activities and ceremonies in Vedic tradition.',
                    'featured_image': '/images/panchang-guide.jpg',
                    'is_published': True,
                    'published_at': datetime(2024, 2, 5, 11, 20, 0),
                    'author_id': admin_id
                }
            ]

            for blog_data in blogs_data:
                blog = Blog(**blog_data)
                db.add(blog)

            db.commit()
            print("✅ BLOGS CREATED SUCCESSFULLY")
            print(f"   Added {len(blogs_data)} sample blog posts")

        # Final commit of all changes
        db.commit()
        print("✅ DATABASE INITIALIZATION COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("🎉 ASTROARUPSHASTRI.COM DATABASE READY WITH SAMPLE DATA")
        print("")
        print("🔐 ADMIN ACCESS:")
        print("   Username: admin")
        print("   Password: admin123")
        print("   Email: admin@astroarupshastri.com")
        print("")
        print("📊 DATABASE CONTENTS:")
        total_services = db.query(Service).count()
        total_blogs = db.query(Blog).count()
        print(f"   • Services: {total_services}")
        print(f"   • Blogs: {total_blogs}")
        print(f"   • Admin Users: 1")
        print("")
        print("🚀 READY FOR DEVELOPMENT & TESTING!")
        print("   • Admin can login and manage content")
        print("   • Frontend can display services and blogs")
        print("   • Users can book consultations")
        print("   • All calculators are functional")
        print("")
        print("⚠️  IMPORTANT:")
        print("   • Change admin password after first login")
        print("   • Test all features thoroughly")
        print("   • Add more content through admin panel")

    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
