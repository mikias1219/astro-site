"""
SQLAlchemy models for the astrology website
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum
from datetime import datetime

# Enums
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    USER = "user"

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"

class ServiceType(str, enum.Enum):
    CONSULTATION = "consultation"
    ONLINE_REPORT = "online_report"
    VOICE_REPORT = "voice_report"
    HOROSCOPE = "horoscope"
    MATCHING = "matching"
    KUNDLI = "kundli"
    GEMSTONE = "gemstone"
    DOSHA = "dosha"
    ASCENDANT = "ascendant"
    MOON_SIGN = "moon_sign"
    NUMEROLOGY = "numerology"
    TRANSIT = "transit"
    PANCHANG = "panchang"
    BIRTH_CHART = "birth_chart"
    COMPATIBILITY = "compatibility"
    CAREER_PREDICTION = "career_prediction"
    MARRIAGE_PREDICTION = "marriage_prediction"
    WEALTH_PREDICTION = "wealth_prediction"
    HEALTH_PREDICTION = "health_prediction"
    EDUCATION_PREDICTION = "education_prediction"

# User Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=False)  # Changed to False for email verification
    is_verified = Column(Boolean, default=False)  # Email verification status
    verification_token = Column(String(255), nullable=True)  # Email verification token
    verification_token_expires = Column(DateTime, nullable=True)  # Token expiration
    reset_password_token = Column(String(255), nullable=True)  # Password reset token
    reset_password_token_expires = Column(DateTime, nullable=True)  # Reset token expiration
    preferred_language = Column(String(10), default="en")  # User's preferred language
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    bookings = relationship("Booking", back_populates="user")
    testimonials = relationship("Testimonial", back_populates="user")

# Service Model
class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    service_type = Column(Enum(ServiceType), nullable=False)
    price = Column(Float)
    duration_minutes = Column(Integer, default=60)
    is_active = Column(Boolean, default=True)
    image_url = Column(String(500))
    features = Column(Text)  # JSON string of features
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    bookings = relationship("Booking", back_populates="service")

# Booking Model
class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    booking_date = Column(DateTime, nullable=False)
    booking_time = Column(String(10), nullable=False)  # Format: "HH:MM"
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    notes = Column(Text)
    customer_name = Column(String(255))
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    birth_date = Column(DateTime)
    birth_time = Column(String(10))
    birth_place = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")

# Page Model
class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text)
    anchor_text = Column(String(255))  # Internal linking anchor text
    anchor_link = Column(String(500))  # URL for the anchor text
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    author_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    seo = relationship("SEO", back_populates="page", uselist=False)

# Blog Model
class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text)  # Rich HTML content from Quill editor
    featured_image = Column(String(500))
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    author_id = Column(Integer, ForeignKey("users.id"))
    view_count = Column(Integer, default=0)
    
    # Relationships
    seo = relationship("SEO", back_populates="blog", uselist=False)

# FAQ Model
class FAQ(Base):
    __tablename__ = "faqs"
    
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(500), nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100))
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# Testimonial Model
class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    rating = Column(Integer)  # 1-5 stars
    content = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=False)
    service_used = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="testimonials")

# Redirect Model
class Redirect(Base):
    __tablename__ = "redirects"

    id = Column(Integer, primary_key=True, index=True)
    from_url = Column(String(500), nullable=False, unique=True, index=True)
    to_url = Column(String(500), nullable=False)
    redirect_type = Column(Integer, default=301)  # 301, 302, 307, 308
    is_active = Column(Boolean, default=True)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# Panchang Model
class Panchang(Base):
    __tablename__ = "panchang"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, unique=True)
    sunrise = Column(String(10))
    sunset = Column(String(10))
    moonrise = Column(String(10))
    moonset = Column(String(10))
    tithi = Column(String(100))
    tithi_end_time = Column(String(10))
    nakshatra = Column(String(100))
    nakshatra_end_time = Column(String(10))
    yoga = Column(String(100))
    yoga_end_time = Column(String(10))
    karan = Column(String(100))
    karan_end_time = Column(String(10))
    amanta_month = Column(String(100))
    purnimanta_month = Column(String(100))
    vikram_samvat = Column(String(100))
    shaka_samvat = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# Horoscope Model
class Horoscope(Base):
    __tablename__ = "horoscopes"
    
    id = Column(Integer, primary_key=True, index=True)
    zodiac_sign = Column(String(20), nullable=False)
    date = Column(DateTime, nullable=False)
    period_type = Column(String(20), nullable=False)  # daily, weekly, monthly
    content = Column(Text, nullable=False)
    love_score = Column(Integer)  # 1-10
    career_score = Column(Integer)  # 1-10
    health_score = Column(Integer)  # 1-10
    lucky_color = Column(String(50))
    lucky_number = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# SEO Model
class SEO(Base):
    __tablename__ = "seo"
    
    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"))
    blog_id = Column(Integer, ForeignKey("blogs.id"))
    meta_title = Column(String(255))
    meta_description = Column(String(500))
    meta_keywords = Column(String(500))
    og_title = Column(String(255))
    og_description = Column(String(500))
    og_image = Column(String(500))
    canonical_url = Column(String(500))
    schema_markup = Column(Text)  # JSON-LD structured data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    page = relationship("Page", back_populates="seo")
    blog = relationship("Blog", back_populates="seo")

# User Verification Token Model
class UserVerification(Base):
    __tablename__ = "user_verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(255), nullable=False, unique=True)
    token_type = Column(String(50), nullable=False)  # 'email_verification', 'password_reset'
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")

# Kundli Model
class Kundli(Base):
    __tablename__ = "kundlis"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    birth_date = Column(DateTime, nullable=False)
    birth_time = Column(String(10), nullable=False)
    birth_place = Column(String(255), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    timezone_offset = Column(Float)
    gender = Column(String(10), nullable=False)
    language = Column(String(10), default="en")
    
    # Calculated fields
    sun_sign = Column(String(50))
    moon_sign = Column(String(50))
    ascendant = Column(String(50))
    nakshatra = Column(String(100))
    nakshatra_pada = Column(Integer)
    tithi = Column(String(100))
    yoga = Column(String(100))
    karan = Column(String(100))
    
    # Planetary positions (JSON)
    planetary_positions = Column(Text)  # JSON string
    house_positions = Column(Text)  # JSON string
    aspects = Column(Text)  # JSON string
    
    # Doshas
    mangal_dosha = Column(Boolean, default=False)
    kaal_sarp_dosha = Column(Boolean, default=False)
    shani_dosha = Column(Boolean, default=False)
    
    # Report data
    report_data = Column(Text)  # JSON string with full report
    chart_type = Column(String(20), default="south_indian")  # north_indian, south_indian, east_indian
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")

# Matching/Compatibility Model
class Matching(Base):
    __tablename__ = "matchings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    male_kundli_id = Column(Integer, ForeignKey("kundlis.id"))
    female_kundli_id = Column(Integer, ForeignKey("kundlis.id"))
    
    # Basic details
    male_name = Column(String(255), nullable=False)
    female_name = Column(String(255), nullable=False)
    matching_type = Column(String(50), default="marriage")  # marriage, love, friendship
    
    # Ashtakoot scores
    varna_score = Column(Integer, default=0)  # max 1
    vashya_score = Column(Integer, default=0)  # max 2
    tara_score = Column(Integer, default=0)  # max 3
    yoni_score = Column(Integer, default=0)  # max 4
    graha_maitri_score = Column(Integer, default=0)  # max 5
    gana_score = Column(Integer, default=0)  # max 6
    bhakoot_score = Column(Integer, default=0)  # max 7
    nadi_score = Column(Integer, default=0)  # max 8
    
    total_score = Column(Integer, default=0)  # max 36
    compatibility_percentage = Column(Float, default=0.0)
    compatibility_level = Column(String(20))  # Excellent, Good, Average, Poor
    
    # Detailed analysis
    detailed_analysis = Column(Text)  # JSON string with detailed compatibility report
    recommendations = Column(Text)
    remedies = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    male_kundli = relationship("Kundli", foreign_keys=[male_kundli_id])
    female_kundli = relationship("Kundli", foreign_keys=[female_kundli_id])

# Numerology Model
class Numerology(Base):
    __tablename__ = "numerology"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    birth_date = Column(DateTime, nullable=False)
    
    # Calculated numbers
    life_path_number = Column(Integer)
    destiny_number = Column(Integer)
    soul_urge_number = Column(Integer)
    personality_number = Column(Integer)
    maturity_number = Column(Integer)
    birth_day_number = Column(Integer)
    
    # Lucky numbers and colors
    lucky_numbers = Column(String(100))  # comma-separated
    lucky_colors = Column(String(100))  # comma-separated
    lucky_days = Column(String(100))  # comma-separated
    lucky_stones = Column(String(100))  # comma-separated
    
    # Predictions
    personality_traits = Column(Text)
    career_guidance = Column(Text)
    relationship_compatibility = Column(Text)
    health_predictions = Column(Text)
    financial_outlook = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")

# Transit Predictions Model
class Transit(Base):
    __tablename__ = "transits"
    
    id = Column(Integer, primary_key=True, index=True)
    planet = Column(String(50), nullable=False)  # Jupiter, Saturn, Rahu, Ketu, etc.
    from_sign = Column(String(50))
    to_sign = Column(String(50))
    transit_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime)
    
    # General predictions
    general_effects = Column(Text)
    
    # Sign-wise predictions (JSON)
    sign_predictions = Column(Text)  # JSON with predictions for each zodiac sign
    
    # Remedies
    remedies = Column(Text)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# Predictions Model (Daily, Weekly, Monthly)
class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    zodiac_sign = Column(String(20), nullable=False)
    date = Column(DateTime, nullable=False)
    period_type = Column(String(20), nullable=False)  # daily, weekly, monthly, yearly
    
    # Prediction content
    general_prediction = Column(Text)
    love_prediction = Column(Text)
    career_prediction = Column(Text)
    health_prediction = Column(Text)
    finance_prediction = Column(Text)
    
    # Scores (1-10)
    love_score = Column(Integer)
    career_score = Column(Integer)
    health_score = Column(Integer)
    finance_score = Column(Integer)
    overall_score = Column(Integer)
    
    # Lucky elements
    lucky_color = Column(String(50))
    lucky_number = Column(String(50))
    lucky_time = Column(String(50))
    lucky_direction = Column(String(50))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# Enhanced Panchang Model (extending existing)
class PanchangDetail(Base):
    __tablename__ = "panchang_details"
    
    id = Column(Integer, primary_key=True, index=True)
    panchang_id = Column(Integer, ForeignKey("panchang.id"))
    
    # Detailed timings
    brahma_muhurta_start = Column(String(10))
    brahma_muhurta_end = Column(String(10))
    abhijit_muhurta_start = Column(String(10))
    abhijit_muhurta_end = Column(String(10))
    
    # Rahu Kaal timings
    rahu_kaal_start = Column(String(10))
    rahu_kaal_end = Column(String(10))
    
    # Gulika Kaal timings
    gulika_kaal_start = Column(String(10))
    gulika_kaal_end = Column(String(10))
    
    # Yamaganda timings
    yamaganda_start = Column(String(10))
    yamaganda_end = Column(String(10))
    
    # Dur Muhurta timings
    dur_muhurta_timings = Column(Text)  # JSON array of time ranges
    
    # Auspicious timings
    shubh_muhurta_timings = Column(Text)  # JSON array of auspicious times
    
    # Festival and special days
    festivals = Column(Text)  # JSON array of festivals
    vratas = Column(Text)  # JSON array of vratas/fasting days
    
    # Daily predictions
    daily_prediction = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    panchang = relationship("Panchang")

# Gemstone Recommendation Model
class GemstoneRecommendation(Base):
    __tablename__ = "gemstone_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    kundli_id = Column(Integer, ForeignKey("kundlis.id"))
    
    # Primary gemstone
    primary_gemstone = Column(String(100))
    primary_planet = Column(String(50))
    primary_benefits = Column(Text)
    
    # Alternative gemstones
    alternative_gemstones = Column(Text)  # JSON array
    
    # Wearing instructions
    wearing_day = Column(String(20))
    wearing_time = Column(String(50))
    wearing_finger = Column(String(50))
    metal_recommendation = Column(String(50))
    weight_recommendation = Column(String(50))
    
    # Mantras and rituals
    mantras = Column(Text)
    rituals = Column(Text)
    
    # Precautions
    precautions = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    kundli = relationship("Kundli")

# Rudraksha Recommendation Model
class RudrakshaRecommendation(Base):
    __tablename__ = "rudraksha_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    kundli_id = Column(Integer, ForeignKey("kundlis.id"))
    
    # Primary Rudraksha
    primary_mukhi = Column(Integer)  # Number of faces
    primary_benefits = Column(Text)
    primary_mantra = Column(String(255))
    
    # Additional Rudraksha recommendations
    additional_recommendations = Column(Text)  # JSON array
    
    # Wearing instructions
    wearing_day = Column(String(20))
    wearing_time = Column(String(50))
    thread_material = Column(String(50))
    
    # Mantras and rituals
    mantras = Column(Text)
    rituals = Column(Text)
    
    # Benefits
    spiritual_benefits = Column(Text)
    health_benefits = Column(Text)
    material_benefits = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    kundli = relationship("Kundli")

# Premium Offers Model
class PremiumOffer(Base):
    __tablename__ = "premium_offers"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    offer_type = Column(String(50))  # combo, single, subscription
    
    # Pricing
    original_price = Column(Float)
    discounted_price = Column(Float)
    discount_percentage = Column(Float)
    
    # Services included
    included_services = Column(Text)  # JSON array of service IDs
    
    # Validity
    valid_from = Column(DateTime)
    valid_until = Column(DateTime)
    max_usage_count = Column(Integer)
    current_usage_count = Column(Integer, default=0)
    
    # Features
    features = Column(Text)  # JSON array of features
    
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# User Premium Purchases Model
class UserPremiumPurchase(Base):
    __tablename__ = "user_premium_purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    offer_id = Column(Integer, ForeignKey("premium_offers.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    
    # Purchase details
    purchase_type = Column(String(50))  # offer, service
    amount_paid = Column(Float, nullable=False)
    payment_method = Column(String(50))
    transaction_id = Column(String(255))
    
    # Status
    status = Column(String(20), default="pending")  # pending, completed, failed, refunded
    
    # Usage
    usage_count = Column(Integer, default=0)
    max_usage = Column(Integer, default=1)
    
    # Validity
    valid_until = Column(DateTime)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    offer = relationship("PremiumOffer")
    service = relationship("Service")
