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
    preferred_language: Optional[str] = "en"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    preferred_language: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class EmailVerificationRequest(BaseModel):
    email: EmailStr

class EmailVerificationResponse(BaseModel):
    message: str
    email_sent: bool

class VerifyEmailRequest(BaseModel):
    token: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class PasswordResetResponse(BaseModel):
    message: str
    email_sent: bool

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
    
    model_config = {
        "from_attributes": True
    }

# Booking Schemas
class BookingBase(BaseModel):
    service_id: int
    booking_date: datetime
    booking_time: str
    notes: Optional[str] = None
    customer_name: Optional[str] = None
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
    
    model_config = {
        "from_attributes": True
    }

# Page Schemas
class PageBase(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    anchor_text: Optional[str] = None
    anchor_link: Optional[str] = None

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    anchor_text: Optional[str] = None
    anchor_link: Optional[str] = None
    banner_image: Optional[str] = None
    is_published: Optional[bool] = None

class PageResponse(PageBase):
    id: int
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    author_id: Optional[int] = None
    
    model_config = {
        "from_attributes": True
    }

# Blog Schemas
class BlogBase(BaseModel):
    title: str
    slug: str
    description: str
    featured_image: Optional[str] = None

class BlogCreate(BlogBase):
    content: Optional[str] = None

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
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
    content: Optional[str] = None

    model_config = {
        "from_attributes": True
    }

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
    
    model_config = {
        "from_attributes": True
    }

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
    
    model_config = {
        "from_attributes": True
    }

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
    
    model_config = {
        "from_attributes": True
    }

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
    
    model_config = {
        "from_attributes": True
    }

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
    
    model_config = {
        "from_attributes": True
    }

# Podcast Schemas
class PodcastBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    youtube_video_id: Optional[str] = None
    embed_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    is_featured: bool = False

class PodcastCreate(PodcastBase):
    pass

class PodcastUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    youtube_video_id: Optional[str] = None
    embed_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    is_featured: Optional[bool] = None

class PodcastResponse(PodcastBase):
    id: int
    view_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }

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

# Kundli Schemas
class KundliBase(BaseModel):
    name: str
    birth_date: datetime
    birth_time: str
    birth_place: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timezone_offset: Optional[float] = None
    gender: str
    language: str = "en"
    chart_type: str = "south_indian"

class KundliCreate(KundliBase):
    pass

class KundliResponse(KundliBase):
    id: int
    user_id: Optional[int] = None
    sun_sign: Optional[str] = None
    moon_sign: Optional[str] = None
    ascendant: Optional[str] = None
    nakshatra: Optional[str] = None
    nakshatra_pada: Optional[int] = None
    tithi: Optional[str] = None
    yoga: Optional[str] = None
    karan: Optional[str] = None
    planetary_positions: Optional[str] = None
    house_positions: Optional[str] = None
    aspects: Optional[str] = None
    mangal_dosha: bool = False
    kaal_sarp_dosha: bool = False
    shani_dosha: bool = False
    report_data: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Matching Schemas
class MatchingBase(BaseModel):
    male_name: str
    female_name: str
    matching_type: str = "marriage"

class MatchingCreate(MatchingBase):
    male_kundli_id: int
    female_kundli_id: int

class MatchingResponse(MatchingBase):
    id: int
    user_id: Optional[int] = None
    male_kundli_id: int
    female_kundli_id: int
    varna_score: int = 0
    vashya_score: int = 0
    tara_score: int = 0
    yoni_score: int = 0
    graha_maitri_score: int = 0
    gana_score: int = 0
    bhakoot_score: int = 0
    nadi_score: int = 0
    total_score: int = 0
    compatibility_percentage: float = 0.0
    compatibility_level: Optional[str] = None
    detailed_analysis: Optional[str] = None
    recommendations: Optional[str] = None
    remedies: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Numerology Schemas
class NumerologyBase(BaseModel):
    name: str
    birth_date: datetime

class NumerologyCreate(NumerologyBase):
    pass

class NumerologyResponse(NumerologyBase):
    id: int
    user_id: Optional[int] = None
    life_path_number: Optional[int] = None
    destiny_number: Optional[int] = None
    soul_urge_number: Optional[int] = None
    personality_number: Optional[int] = None
    maturity_number: Optional[int] = None
    birth_day_number: Optional[int] = None
    lucky_numbers: Optional[str] = None
    lucky_colors: Optional[str] = None
    lucky_days: Optional[str] = None
    lucky_stones: Optional[str] = None
    personality_traits: Optional[str] = None
    career_guidance: Optional[str] = None
    relationship_compatibility: Optional[str] = None
    health_predictions: Optional[str] = None
    financial_outlook: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Transit Schemas
class TransitBase(BaseModel):
    planet: str
    from_sign: Optional[str] = None
    to_sign: Optional[str] = None
    transit_date: datetime
    end_date: Optional[datetime] = None
    general_effects: Optional[str] = None
    sign_predictions: Optional[str] = None
    remedies: Optional[str] = None

class TransitCreate(TransitBase):
    pass

class TransitResponse(TransitBase):
    id: int
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Prediction Schemas
class PredictionBase(BaseModel):
    zodiac_sign: str
    date: datetime
    period_type: str
    general_prediction: Optional[str] = None
    love_prediction: Optional[str] = None
    career_prediction: Optional[str] = None
    health_prediction: Optional[str] = None
    finance_prediction: Optional[str] = None
    love_score: Optional[int] = None
    career_score: Optional[int] = None
    health_score: Optional[int] = None
    finance_score: Optional[int] = None
    overall_score: Optional[int] = None
    lucky_color: Optional[str] = None
    lucky_number: Optional[str] = None
    lucky_time: Optional[str] = None
    lucky_direction: Optional[str] = None

class PredictionCreate(PredictionBase):
    pass

class PredictionResponse(PredictionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Panchang Detail Schemas
class PanchangDetailBase(BaseModel):
    panchang_id: int
    brahma_muhurta_start: Optional[str] = None
    brahma_muhurta_end: Optional[str] = None
    abhijit_muhurta_start: Optional[str] = None
    abhijit_muhurta_end: Optional[str] = None
    rahu_kaal_start: Optional[str] = None
    rahu_kaal_end: Optional[str] = None
    gulika_kaal_start: Optional[str] = None
    gulika_kaal_end: Optional[str] = None
    yamaganda_start: Optional[str] = None
    yamaganda_end: Optional[str] = None
    dur_muhurta_timings: Optional[str] = None
    shubh_muhurta_timings: Optional[str] = None
    festivals: Optional[str] = None
    vratas: Optional[str] = None
    daily_prediction: Optional[str] = None

class PanchangDetailCreate(PanchangDetailBase):
    pass

class PanchangDetailResponse(PanchangDetailBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Gemstone Recommendation Schemas
class GemstoneRecommendationBase(BaseModel):
    primary_gemstone: Optional[str] = None
    primary_planet: Optional[str] = None
    primary_benefits: Optional[str] = None
    alternative_gemstones: Optional[str] = None
    wearing_day: Optional[str] = None
    wearing_time: Optional[str] = None
    wearing_finger: Optional[str] = None
    metal_recommendation: Optional[str] = None
    weight_recommendation: Optional[str] = None
    mantras: Optional[str] = None
    rituals: Optional[str] = None
    precautions: Optional[str] = None

class GemstoneRecommendationCreate(GemstoneRecommendationBase):
    kundli_id: int

class GemstoneRecommendationResponse(GemstoneRecommendationBase):
    id: int
    user_id: Optional[int] = None
    kundli_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Rudraksha Recommendation Schemas
class RudrakshaRecommendationBase(BaseModel):
    primary_mukhi: Optional[int] = None
    primary_benefits: Optional[str] = None
    primary_mantra: Optional[str] = None
    additional_recommendations: Optional[str] = None
    wearing_day: Optional[str] = None
    wearing_time: Optional[str] = None
    thread_material: Optional[str] = None
    mantras: Optional[str] = None
    rituals: Optional[str] = None
    spiritual_benefits: Optional[str] = None
    health_benefits: Optional[str] = None
    material_benefits: Optional[str] = None

class RudrakshaRecommendationCreate(RudrakshaRecommendationBase):
    kundli_id: int

class RudrakshaRecommendationResponse(RudrakshaRecommendationBase):
    id: int
    user_id: Optional[int] = None
    kundli_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Premium Offer Schemas
class PremiumOfferBase(BaseModel):
    title: str
    description: Optional[str] = None
    offer_type: Optional[str] = None
    original_price: Optional[float] = None
    discounted_price: Optional[float] = None
    discount_percentage: Optional[float] = None
    included_services: Optional[str] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    max_usage_count: Optional[int] = None
    features: Optional[str] = None
    is_featured: bool = False

class PremiumOfferCreate(PremiumOfferBase):
    pass

class PremiumOfferUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    offer_type: Optional[str] = None
    original_price: Optional[float] = None
    discounted_price: Optional[float] = None
    discount_percentage: Optional[float] = None
    included_services: Optional[str] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    max_usage_count: Optional[int] = None
    features: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class PremiumOfferResponse(PremiumOfferBase):
    id: int
    current_usage_count: int = 0
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# User Premium Purchase Schemas
class UserPremiumPurchaseBase(BaseModel):
    purchase_type: str
    amount_paid: float
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    max_usage: int = 1
    valid_until: Optional[datetime] = None

class UserPremiumPurchaseCreate(UserPremiumPurchaseBase):
    offer_id: Optional[int] = None
    service_id: Optional[int] = None

class UserPremiumPurchaseResponse(UserPremiumPurchaseBase):
    id: int
    user_id: int
    offer_id: Optional[int] = None
    service_id: Optional[int] = None
    status: str = "pending"
    usage_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }
