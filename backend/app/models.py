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
    is_active = Column(Boolean, default=True)
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
    customer_name = Column(String(255), nullable=False)
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
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    author_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    seo = relationship("SEO", back_populates="page", uselist=False)

# Blog Model
class Blog(Base):
    __tablename__ = "blogs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text)
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

# Podcast/Video Model
class Podcast(Base):
    __tablename__ = "podcasts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    video_url = Column(String(500))
    thumbnail_url = Column(String(500))
    duration = Column(String(20))  # Format: "10:30"
    category = Column(String(100))
    is_featured = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
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
