"""
Podcast router for astrology videos and content
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import desc

from app.database import get_db
from app.models import Podcast, User
from app.schemas import PodcastCreate, PodcastUpdate, PodcastResponse
from app.auth import get_admin_or_editor_user

router = APIRouter()

@router.get("/", response_model=List[PodcastResponse])
async def get_podcasts(
    category: Optional[str] = None,
    featured_only: bool = False,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get podcasts with optional filters"""
    query = db.query(Podcast)
    
    if category:
        query = query.filter(Podcast.category == category)
    if featured_only:
        query = query.filter(Podcast.is_featured == True)
    
    podcasts = query.order_by(desc(Podcast.created_at)).offset(skip).limit(limit).all()
    
    # If no podcasts exist, return sample data
    if not podcasts:
        sample_podcasts = [
            PodcastResponse(
                id=999001,
                title="करोड़ों की सेना, अरबों का बजट… फिर भी असुरक्षित",
                description="जानिए पर्दे के पीछे की साजिश और ज्योतिष की दृष्टि से क्या कहता है भविष्य।",
                video_url="https://www.youtube.com/watch?v=sample1",
                thumbnail_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
                duration="10:00",
                category="Politics",
                is_featured=True,
                view_count=1250,
                created_at="2024-01-15T10:00:00",
                updated_at=None
            ),
            PodcastResponse(
                id=999002,
                title="ईरान इज़राइल युद्ध या अमेरिकी स्क्रिप्ट?",
                description="जानिए पर्दे के पीछे की साजिश। Israel Iran Ceasefire, Trump Politics या अनीति।",
                video_url="https://www.youtube.com/watch?v=sample2",
                thumbnail_url="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=225&fit=crop",
                duration="07:12",
                category="International",
                is_featured=True,
                view_count=980,
                created_at="2024-01-14T15:30:00",
                updated_at=None
            ),
            PodcastResponse(
                id=999003,
                title="Share Market Astrology। Stock Market Prediction",
                description="Dr. Vinay Bajrangi के साथ शेयर मार्केट की ज्योतिषीय भविष्यवाणी।",
                video_url="https://www.youtube.com/watch?v=sample3",
                thumbnail_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
                duration="06:12",
                category="Finance",
                is_featured=False,
                view_count=750,
                created_at="2024-01-13T12:00:00",
                updated_at=None
            )
        ]
        return sample_podcasts
    
    return podcasts

@router.get("/featured", response_model=List[PodcastResponse])
async def get_featured_podcasts(
    limit: int = 6,
    db: Session = Depends(get_db)
):
    """Get featured podcasts"""
    podcasts = db.query(Podcast).filter(
        Podcast.is_featured == True
    ).order_by(desc(Podcast.created_at)).limit(limit).all()
    
    # If no featured podcasts exist, return sample data
    if not podcasts:
        sample_podcasts = [
            PodcastResponse(
                id=999001,
                title="करोड़ों की सेना, अरबों का बजट… फिर भी असुरक्षित",
                description="जानिए पर्दे के पीछे की साजिश और ज्योतिष की दृष्टि से क्या कहता है भविष्य।",
                video_url="https://www.youtube.com/watch?v=sample1",
                thumbnail_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
                duration="10:00",
                category="Politics",
                is_featured=True,
                view_count=1250,
                created_at="2024-01-15T10:00:00",
                updated_at=None
            ),
            PodcastResponse(
                id=999002,
                title="ईरान इज़राइल युद्ध या अमेरिकी स्क्रिप्ट?",
                description="जानिए पर्दे के पीछे की साजिश। Israel Iran Ceasefire, Trump Politics या अनीति।",
                video_url="https://www.youtube.com/watch?v=sample2",
                thumbnail_url="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=225&fit=crop",
                duration="07:12",
                category="International",
                is_featured=True,
                view_count=980,
                created_at="2024-01-14T15:30:00",
                updated_at=None
            )
        ]
        return sample_podcasts
    
    return podcasts

@router.get("/{podcast_id}", response_model=PodcastResponse)
async def get_podcast(podcast_id: int, db: Session = Depends(get_db)):
    """Get a specific podcast by ID"""
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast not found"
        )
    
    # Increment view count
    podcast.view_count += 1
    db.commit()
    db.refresh(podcast)
    
    return podcast

@router.get("/categories/list")
async def get_podcast_categories(db: Session = Depends(get_db)):
    """Get list of podcast categories"""
    categories = db.query(Podcast.category).distinct().all()
    category_list = [cat[0] for cat in categories if cat[0]]
    
    # If no categories exist, return sample categories
    if not category_list:
        category_list = ["Politics", "International", "Finance", "Astrology", "Spirituality"]
    
    return {"categories": category_list}

@router.post("/", response_model=PodcastResponse)
async def create_podcast(
    podcast: PodcastCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Create a new podcast (Admin/Editor only)"""
    db_podcast = Podcast(**podcast.dict())
    db.add(db_podcast)
    db.commit()
    db.refresh(db_podcast)
    return db_podcast

@router.put("/{podcast_id}", response_model=PodcastResponse)
async def update_podcast(
    podcast_id: int,
    podcast_update: PodcastUpdate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Update a podcast (Admin/Editor only)"""
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast not found"
        )
    
    update_data = podcast_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(podcast, field, value)
    
    db.commit()
    db.refresh(podcast)
    return podcast

@router.delete("/{podcast_id}")
async def delete_podcast(
    podcast_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Delete a podcast (Admin/Editor only)"""
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast not found"
        )
    
    db.delete(podcast)
    db.commit()
    return {"message": "Podcast deleted successfully"}
