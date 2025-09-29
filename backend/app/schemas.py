"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models import UserRole, BookingStatus, ServiceType

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# Service Schemas
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    service_type: ServiceType
    price: Optional[float] = None
    duration_minutes: int = 60
    image_url: Optional[str] = None
    features: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    service_type: Optional[ServiceType] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    image_url: Optional[str] = None
    features: Optional[str] = None
    is_active: Optional[bool] = None

class ServiceResponse(ServiceBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Booking Schemas
class BookingBase(BaseModel):
    service_id: int
    booking_date: datetime
    booking_time: str
    notes: Optional[str] = None
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    birth_date: Optional[datetime] = None
    birth_time: Optional[str] = None
    birth_place: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    booking_date: Optional[datetime] = None
    booking_time: Optional[str] = None
    status: Optional[BookingStatus] = None
    notes: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    birth_date: Optional[datetime] = None
    birth_time: Optional[str] = None
    birth_place: Optional[str] = None

class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: BookingStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    service: ServiceResponse
    
    class Config:
        from_attributes = True

# Page Schemas
class PageBase(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    is_published: Optional[bool] = None

class PageResponse(PageBase):
    id: int
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    author_id: Optional[int] = None
    
    class Config:
        from_attributes = True

# Blog Schemas
class BlogBase(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    is_published: Optional[bool] = None
    published_at: Optional[datetime] = None

class BlogResponse(BlogBase):
    id: int
    is_published: bool
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    author_id: Optional[int] = None
    view_count: int
    
    class Config:
        from_attributes = True

# FAQ Schemas
class FAQBase(BaseModel):
    question: str
    answer: str
    category: Optional[str] = None
    order: int = 0

class FAQCreate(FAQBase):
    pass

class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class FAQResponse(FAQBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Testimonial Schemas
class TestimonialBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    rating: Optional[int] = None
    content: str
    service_used: Optional[str] = None

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    rating: Optional[int] = None
    content: Optional[str] = None
    service_used: Optional[str] = None
    is_approved: Optional[bool] = None

class TestimonialResponse(TestimonialBase):
    id: int
    user_id: Optional[int] = None
    is_approved: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# SEO Schemas
class SEOBase(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None
    schema_markup: Optional[str] = None

class SEOCreate(SEOBase):
    page_id: Optional[int] = None
    blog_id: Optional[int] = None

class SEOUpdate(SEOBase):
    pass

class SEOResponse(SEOBase):
    id: int
    page_id: Optional[int] = None
    blog_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Panchang Schemas
class PanchangBase(BaseModel):
    date: datetime
    sunrise: Optional[str] = None
    sunset: Optional[str] = None
    moonrise: Optional[str] = None
    moonset: Optional[str] = None
    tithi: Optional[str] = None
    tithi_end_time: Optional[str] = None
    nakshatra: Optional[str] = None
    nakshatra_end_time: Optional[str] = None
    yoga: Optional[str] = None
    yoga_end_time: Optional[str] = None
    karan: Optional[str] = None
    karan_end_time: Optional[str] = None
    amanta_month: Optional[str] = None
    purnimanta_month: Optional[str] = None
    vikram_samvat: Optional[str] = None
    shaka_samvat: Optional[str] = None

class PanchangCreate(PanchangBase):
    pass

class PanchangResponse(PanchangBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Horoscope Schemas
class HoroscopeBase(BaseModel):
    zodiac_sign: str
    date: datetime
    period_type: str  # daily, weekly, monthly
    content: str
    love_score: Optional[int] = None
    career_score: Optional[int] = None
    health_score: Optional[int] = None
    lucky_color: Optional[str] = None
    lucky_number: Optional[str] = None

class HoroscopeCreate(HoroscopeBase):
    pass

class HoroscopeResponse(HoroscopeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Podcast Schemas
class PodcastBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None
    category: Optional[str] = None
    is_featured: bool = False

class PodcastCreate(PodcastBase):
    pass

class PodcastUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None

class PodcastResponse(PodcastBase):
    id: int
    view_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_users: int
    total_bookings: int
    total_services: int
    total_blogs: int
    total_testimonials: int
    pending_bookings: int
    monthly_bookings: int
    recent_bookings: List[BookingResponse]
    popular_services: List[ServiceResponse]
    total_podcasts: int
    total_horoscopes: int
    total_panchang_entries: int
