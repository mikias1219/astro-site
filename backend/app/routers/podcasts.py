"""
Podcast router for astrology videos and content
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import desc
import re

from app.database import get_db
from app.models import Podcast, User
from app.schemas import PodcastCreate, PodcastUpdate, PodcastResponse
from app.auth import get_admin_or_editor_user

router = APIRouter()

def extract_youtube_info(video_url: str) -> tuple[str, str, str]:
    """Extract YouTube video ID and create embed URL and thumbnail URL"""
    if not video_url:
        return "", "", ""

    # YouTube URL patterns
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/v\/([a-zA-Z0-9_-]{11})',
    ]

    video_id = ""
    for pattern in patterns:
        match = re.search(pattern, video_url)
        if match:
            video_id = match.group(1)
            break

    if video_id:
        embed_url = f"https://www.youtube.com/embed/{video_id}"
        thumbnail_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
        return video_id, embed_url, thumbnail_url

    return "", "", ""

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

    return {"categories": category_list}

@router.post("/", response_model=PodcastResponse)
async def create_podcast(
    podcast: PodcastCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Create a new podcast (Admin/Editor only)"""
    podcast_data = podcast.dict()

    # Process YouTube URL if provided
    if podcast_data.get('video_url'):
        video_id, embed_url, thumbnail = extract_youtube_info(podcast_data['video_url'])
        if video_id:
            podcast_data['youtube_video_id'] = video_id
            podcast_data['embed_url'] = embed_url
            # Only set thumbnail if not already provided
            if not podcast_data.get('thumbnail_url'):
                podcast_data['thumbnail_url'] = thumbnail

    db_podcast = Podcast(**podcast_data)
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

    # Process YouTube URL if it's being updated
    if 'video_url' in update_data and update_data['video_url']:
        video_id, embed_url, thumbnail = extract_youtube_info(update_data['video_url'])
        if video_id:
            update_data['youtube_video_id'] = video_id
            update_data['embed_url'] = embed_url
            # Only set thumbnail if not already provided in update
            if not update_data.get('thumbnail_url'):
                update_data['thumbnail_url'] = thumbnail

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
