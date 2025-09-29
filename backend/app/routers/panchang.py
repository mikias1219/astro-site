"""
Panchang router for daily astrological calendar
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from app.database import get_db
from app.models import Panchang, User
from app.schemas import PanchangCreate, PanchangResponse
from app.auth import get_admin_or_editor_user

router = APIRouter()

@router.get("/", response_model=List[PanchangResponse])
async def get_panchang(
    date_filter: Optional[date] = None,
    skip: int = 0,
    limit: int = 30,
    db: Session = Depends(get_db)
):
    """Get panchang data for a specific date or date range"""
    query = db.query(Panchang)
    
    if date_filter:
        query = query.filter(Panchang.date == date_filter)
    else:
        # Default to today
        today = datetime.now().date()
        query = query.filter(Panchang.date == today)
    
    panchang_data = query.offset(skip).limit(limit).all()
    return panchang_data

@router.get("/today", response_model=PanchangResponse)
async def get_today_panchang(db: Session = Depends(get_db)):
    """Get today's panchang data"""
    today = datetime.now().date()
    panchang = db.query(Panchang).filter(Panchang.date == today).first()
    
    if not panchang:
        # Return sample data if no panchang exists for today
        return PanchangResponse(
            id=0,
            date=datetime.now(),
            sunrise="06:30",
            sunset="18:30",
            moonrise="20:15",
            moonset="08:45",
            tithi="Shukla Paksha, Dwitiya",
            tithi_end_time="14:30",
            nakshatra="Rohini",
            nakshatra_end_time="16:45",
            yoga="Siddhi",
            yoga_end_time="12:20",
            karan="Bava",
            karan_end_time="10:15",
            amanta_month="Kartik",
            purnimanta_month="Kartik",
            vikram_samvat="2081",
            shaka_samvat="1946",
            created_at=datetime.now(),
            updated_at=None
        )
    
    return panchang

@router.post("/", response_model=PanchangResponse)
async def create_panchang(
    panchang: PanchangCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Create panchang data (Admin/Editor only)"""
    # Check if panchang already exists for this date
    existing = db.query(Panchang).filter(Panchang.date == panchang.date).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Panchang already exists for this date"
        )
    
    db_panchang = Panchang(**panchang.dict())
    db.add(db_panchang)
    db.commit()
    db.refresh(db_panchang)
    return db_panchang

@router.put("/{panchang_id}", response_model=PanchangResponse)
async def update_panchang(
    panchang_id: int,
    panchang_update: PanchangCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Update panchang data (Admin/Editor only)"""
    panchang = db.query(Panchang).filter(Panchang.id == panchang_id).first()
    if not panchang:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Panchang not found"
        )
    
    update_data = panchang_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(panchang, field, value)
    
    db.commit()
    db.refresh(panchang)
    return panchang

@router.delete("/{panchang_id}")
async def delete_panchang(
    panchang_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Delete panchang data (Admin/Editor only)"""
    panchang = db.query(Panchang).filter(Panchang.id == panchang_id).first()
    if not panchang:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Panchang not found"
        )
    
    db.delete(panchang)
    db.commit()
    return {"message": "Panchang deleted successfully"}
