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
    """Initialize database with sample data"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            # Create admin user
            admin_user = User(
                email="admin@astrologywebsite.com",
                username="admin",
                full_name="Admin User",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin_user)
            print("✓ Admin user created (username: admin, password: admin123)")
        
        # Check if services exist
        services_count = db.query(Service).count()
        if services_count == 0:
            # Create sample services
            sample_services = [
                {
                    "name": "Personal Astrology Consultation",
                    "description": "One-on-one consultation with our expert astrologer to discuss your birth chart, life path, and future predictions.",
                    "service_type": ServiceType.CONSULTATION,
                    "price": 99.99,
                    "duration_minutes": 60,
                    "features": '["Birth chart analysis", "Life path guidance", "Future predictions", "Q&A session"]'
                },
                {
                    "name": "Detailed Horoscope Report",
                    "description": "Comprehensive written report covering all aspects of your horoscope including personality, career, love, and health.",
                    "service_type": ServiceType.ONLINE_REPORT,
                    "price": 49.99,
                    "duration_minutes": 30,
                    "features": '["Detailed personality analysis", "Career guidance", "Love compatibility", "Health predictions"]'
                },
                {
                    "name": "Voice Horoscope Reading",
                    "description": "Audio recording of your personalized horoscope reading delivered to your email.",
                    "service_type": ServiceType.VOICE_REPORT,
                    "price": 39.99,
                    "duration_minutes": 45,
                    "features": '["Audio recording", "Personalized reading", "Email delivery", "30-day access"]'
                },
                {
                    "name": "Kundli Matching",
                    "description": "Detailed compatibility analysis for marriage or relationship using traditional Vedic astrology methods.",
                    "service_type": ServiceType.MATCHING,
                    "price": 79.99,
                    "duration_minutes": 90,
                    "features": '["Compatibility score", "Guna matching", "Manglik analysis", "Remedy suggestions"]'
                },
                {
                    "name": "Birth Chart Analysis",
                    "description": "Complete analysis of your birth chart including planetary positions, houses, and their influences.",
                    "service_type": ServiceType.KUNDLI,
                    "price": 69.99,
                    "duration_minutes": 75,
                    "features": '["Planetary positions", "House analysis", "Dasha predictions", "Remedy suggestions"]'
                },
                {
                    "name": "Gemstone Recommendation",
                    "description": "Personalized gemstone recommendations based on your birth chart to enhance positive planetary influences.",
                    "service_type": ServiceType.GEMSTONE,
                    "price": 29.99,
                    "duration_minutes": 30,
                    "features": '["Gemstone analysis", "Wearing instructions", "Benefits explanation", "Purchase guidance"]'
                },
                {
                    "name": "Dosha Analysis",
                    "description": "Analysis of Vedic doshas (Vata, Pitta, Kapha) and their impact on your health and lifestyle.",
                    "service_type": ServiceType.DOSHA,
                    "price": 34.99,
                    "duration_minutes": 45,
                    "features": '["Dosha assessment", "Health recommendations", "Dietary guidance", "Lifestyle tips"]'
                },
                {
                    "name": "Ascendant Sign Analysis",
                    "description": "Detailed analysis of your rising sign and its influence on your personality and life path.",
                    "service_type": ServiceType.ASCENDANT,
                    "price": 24.99,
                    "duration_minutes": 30,
                    "features": '["Ascendant analysis", "Personality traits", "Life path insights", "Compatibility factors"]'
                },
                {
                    "name": "Moon Sign Reading",
                    "description": "Comprehensive reading based on your moon sign covering emotions, intuition, and inner self.",
                    "service_type": ServiceType.MOON_SIGN,
                    "price": 19.99,
                    "duration_minutes": 25,
                    "features": '["Moon sign analysis", "Emotional patterns", "Intuitive insights", "Inner self guidance"]'
                }
            ]
            
            for service_data in sample_services:
                service = Service(**service_data)
                db.add(service)
            
            print("✓ Sample services created")
        
        # Create a test user
        test_user = db.query(User).filter(User.username == "testuser").first()
        if not test_user:
            test_user = User(
                email="test@example.com",
                username="testuser",
                full_name="Test User",
                hashed_password=get_password_hash("test123"),
                role=UserRole.USER,
                is_active=True
            )
            db.add(test_user)
            print("✓ Test user created (username: testuser, password: test123)")
        
        # Commit all changes
        db.commit()
        print("✓ Database initialized successfully!")
        print("\nSample accounts created:")
        print("- Admin: username=admin, password=admin123")
        print("- Test User: username=testuser, password=test123")
        print("\nYou can now start the server and test the API!")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
