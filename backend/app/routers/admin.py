"""
Admin router for dashboard analytics and management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, Booking, Service, Blog, Testimonial, BookingStatus, Podcast, Horoscope, Panchang, SEO
from app.schemas import PodcastCreate, PodcastUpdate, PodcastResponse
from app.schemas import DashboardStats, BookingResponse, ServiceResponse, UserResponse, ServiceCreate, ServiceUpdate, BlogCreate, BlogUpdate, BlogResponse, SEOCreate, SEOUpdate, SEOResponse
from app.auth import get_admin_user

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics (Admin only)"""
    # Get basic counts
    total_users = db.query(User).count()
    total_bookings = db.query(Booking).count()
    total_services = db.query(Service).filter(Service.is_active == True).count()
    total_blogs = db.query(Blog).filter(Blog.is_published == True).count()
    total_testimonials = db.query(Testimonial).filter(Testimonial.is_approved == True).count()
    total_podcasts = db.query(Podcast).count()
    total_horoscopes = db.query(Horoscope).count()
    total_panchang_entries = db.query(Panchang).count()
    
    # Get pending bookings
    pending_bookings = db.query(Booking).filter(Booking.status == BookingStatus.PENDING).count()
    
    # Get monthly bookings (current month)
    current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_bookings = db.query(Booking).filter(Booking.created_at >= current_month_start).count()
    
    # Get recent bookings
    recent_bookings = db.query(Booking).order_by(desc(Booking.created_at)).limit(10).all()
    
    # Get popular services (by booking count)
    popular_services = db.query(Service).join(Booking).filter(
        Service.is_active == True
    ).group_by(Service.id).order_by(desc(func.count(Booking.id))).limit(5).all()
    
    return DashboardStats(
        total_users=total_users,
        total_bookings=total_bookings,
        total_services=total_services,
        total_blogs=total_blogs,
        total_testimonials=total_testimonials,
        pending_bookings=pending_bookings,
        monthly_bookings=monthly_bookings,
        recent_bookings=recent_bookings,
        popular_services=popular_services,
        total_podcasts=total_podcasts,
        total_horoscopes=total_horoscopes,
        total_panchang_entries=total_panchang_entries
    )

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (Admin only)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get a specific user (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/users/{user_id}")
async def update_user_role(
    user_id: int,
    role_update: dict,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update user role (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if "role" in role_update:
        user.role = role_update["role"]
    if "is_active" in role_update:
        user.is_active = role_update["is_active"]
    
    db.commit()
    return {"message": "User updated successfully"}

@router.get("/bookings/stats")
async def get_booking_stats(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get booking statistics (Admin only)"""
    # Booking status distribution
    status_stats = db.query(
        Booking.status,
        func.count(Booking.id).label('count')
    ).group_by(Booking.status).all()
    
    # Monthly booking trends (last 12 months)
    # Note: date_trunc doesn't work with SQLite, using strftime instead
    monthly_stats = db.query(
        func.strftime('%Y-%m', Booking.created_at).label('month'),
        func.count(Booking.id).label('count')
    ).filter(
        Booking.created_at >= datetime.now() - timedelta(days=365)
    ).group_by(
        func.strftime('%Y-%m', Booking.created_at)
    ).order_by('month').all()
    
    return {
        "status_distribution": [{"status": stat.status, "count": stat.count} for stat in status_stats],
        "monthly_trends": [{"month": stat.month, "count": stat.count} for stat in monthly_stats]
    }

@router.get("/analytics/page-views")
async def get_page_view_analytics(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get page view analytics (Admin only)"""
    # Blog view counts
    blog_views = db.query(
        Blog.title,
        Blog.view_count
    ).filter(Blog.is_published == True).order_by(desc(Blog.view_count)).limit(10).all()
    
    return {
        "popular_blogs": [{"title": blog.title, "views": blog.view_count} for blog in blog_views]
    }

@router.get("/reports/booking-summary")
async def get_booking_summary_report(
    start_date: datetime = None,
    end_date: datetime = None,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Generate booking summary report (Admin only)"""
    query = db.query(Booking)
    
    if start_date:
        query = query.filter(Booking.created_at >= start_date)
    if end_date:
        query = query.filter(Booking.created_at <= end_date)
    
    bookings = query.all()
    
    # Calculate revenue (if services have prices)
    total_revenue = sum(booking.service.price for booking in bookings if booking.service.price)
    
    # Service-wise breakdown
    service_breakdown = {}
    for booking in bookings:
        service_name = booking.service.name
        if service_name not in service_breakdown:
            service_breakdown[service_name] = {"count": 0, "revenue": 0}
        service_breakdown[service_name]["count"] += 1
        if booking.service.price:
            service_breakdown[service_name]["revenue"] += booking.service.price
    
    return {
        "total_bookings": len(bookings),
        "total_revenue": total_revenue,
        "service_breakdown": service_breakdown,
        "date_range": {
            "start": start_date.isoformat() if start_date else None,
            "end": end_date.isoformat() if end_date else None
        }
    }

# Bookings Management
@router.get("/bookings", response_model=List[BookingResponse])
async def get_all_bookings(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all bookings (Admin only)"""
    bookings = db.query(Booking).offset(skip).limit(limit).all()
    return bookings

# Services Management
@router.get("/services", response_model=List[ServiceResponse])
async def get_all_services(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all services (Admin only)"""
    services = db.query(Service).offset(skip).limit(limit).all()
    return services

@router.post("/services", response_model=ServiceResponse)
async def create_service(
    service: ServiceCreate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new service (Admin only)"""
    db_service = Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.put("/services/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int,
    service: ServiceUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update a service (Admin only)"""
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    for key, value in service.dict(exclude_unset=True).items():
        setattr(db_service, key, value)
    
    db.commit()
    db.refresh(db_service)
    return db_service

@router.delete("/services/{service_id}")
async def delete_service(
    service_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a service (Admin only)"""
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    db.delete(db_service)
    db.commit()
    return {"message": "Service deleted successfully"}

@router.put("/services/{service_id}/toggle")
async def toggle_service_status(
    service_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Toggle service active status (Admin only)"""
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    db_service.is_active = not db_service.is_active
    db.commit()
    return {"message": "Service status updated successfully"}

# Blogs Management
@router.get("/blogs", response_model=List[BlogResponse])
async def get_all_blogs(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all blogs (Admin only)"""
    blogs = db.query(Blog).offset(skip).limit(limit).all()
    return blogs

@router.post("/blogs", response_model=BlogResponse)
async def create_blog(
    blog: BlogCreate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new blog (Admin only)"""
    db_blog = Blog(**blog.dict(), author_id=current_user.id, is_published=True, published_at=datetime.now())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.put("/blogs/{blog_id}", response_model=BlogResponse)
async def update_blog(
    blog_id: int,
    blog: BlogUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update a blog (Admin only)"""
    db_blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not db_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    for key, value in blog.dict(exclude_unset=True).items():
        setattr(db_blog, key, value)
    
    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.delete("/blogs/{blog_id}")
async def delete_blog(
    blog_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a blog (Admin only)"""
    db_blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not db_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    db.delete(db_blog)
    db.commit()
    return {"message": "Blog deleted successfully"}

@router.put("/blogs/{blog_id}/toggle")
async def toggle_blog_status(
    blog_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Toggle blog published status (Admin only)"""
    db_blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not db_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    db_blog.is_published = not db_blog.is_published
    db.commit()
    return {"message": "Blog status updated successfully"}

# SEO Management
@router.get("/seo", response_model=List[SEOResponse])
async def get_all_seo(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all SEO data (Admin only)"""
    seo_data = db.query(SEO).offset(skip).limit(limit).all()
    return seo_data

@router.post("/seo", response_model=SEOResponse)
async def create_seo(
    seo: SEOCreate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create new SEO data (Admin only)"""
    db_seo = SEO(**seo.dict())
    db.add(db_seo)
    db.commit()
    db.refresh(db_seo)
    return db_seo

@router.put("/seo/{seo_id}", response_model=SEOResponse)
async def update_seo(
    seo_id: int,
    seo: SEOUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update SEO data (Admin only)"""
    db_seo = db.query(SEO).filter(SEO.id == seo_id).first()
    if not db_seo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SEO data not found"
        )
    
    for key, value in seo.dict(exclude_unset=True).items():
        setattr(db_seo, key, value)
    
    db.commit()
    db.refresh(db_seo)
    return db_seo

@router.delete("/seo/{seo_id}")
async def delete_seo(
    seo_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete SEO data (Admin only)"""
    db_seo = db.query(SEO).filter(SEO.id == seo_id).first()
    if not db_seo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SEO data not found"
        )
    
    db.delete(db_seo)
    db.commit()
    return {"message": "SEO data deleted successfully"}

# User Management
@router.put("/users/{user_id}/toggle")
async def toggle_user_status(
    user_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Toggle user active status (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = not user.is_active
    db.commit()
    return {"message": "User status updated successfully"}

@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role_update: dict,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update user role (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if "role" in role_update:
        user.role = role_update["role"]

    db.commit()
    return {"message": "User role updated successfully"}

# Podcasts Management
@router.get("/podcasts", response_model=List[PodcastResponse])
async def get_all_podcasts(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all podcasts (Admin only)"""
    podcasts = db.query(Podcast).offset(skip).limit(limit).all()
    return podcasts

@router.post("/podcasts", response_model=PodcastResponse)
async def create_podcast(
    podcast: PodcastCreate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new podcast (Admin only)"""
    db_podcast = Podcast(**podcast.dict())
    db.add(db_podcast)
    db.commit()
    db.refresh(db_podcast)
    return db_podcast

@router.put("/podcasts/{podcast_id}", response_model=PodcastResponse)
async def update_podcast(
    podcast_id: int,
    podcast: PodcastUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update a podcast (Admin only)"""
    db_podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not db_podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast not found"
        )

    for key, value in podcast.dict(exclude_unset=True).items():
        setattr(db_podcast, key, value)

    db.commit()
    db.refresh(db_podcast)
    return db_podcast

@router.delete("/podcasts/{podcast_id}")
async def delete_podcast(
    podcast_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a podcast (Admin only)"""
    db_podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not db_podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast not found"
        )

    db.delete(db_podcast)
    db.commit()
    return {"message": "Podcast deleted successfully"}

@router.put("/podcasts/{podcast_id}/toggle")
async def toggle_podcast_featured(
    podcast_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Toggle podcast featured status (Admin only)"""
    db_podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not db_podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast not found"
        )

    db_podcast.is_featured = not db_podcast.is_featured
    db.commit()
    return {"message": "Podcast status updated successfully"}
