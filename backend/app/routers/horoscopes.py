"""
Horoscope router for daily/weekly/monthly horoscopes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from app.database import get_db
from app.models import Horoscope, User
from app.schemas import HoroscopeCreate, HoroscopeResponse
from app.auth import get_admin_or_editor_user

router = APIRouter()

# Zodiac signs
ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

@router.get("/", response_model=List[HoroscopeResponse])
async def get_horoscopes(
    zodiac_sign: Optional[str] = None,
    period_type: Optional[str] = None,
    date_filter: Optional[date] = None,
    skip: int = 0,
    limit: int = 12,
    db: Session = Depends(get_db)
):
    """Get horoscopes with optional filters"""
    query = db.query(Horoscope)
    
    if zodiac_sign:
        query = query.filter(Horoscope.zodiac_sign == zodiac_sign)
    if period_type:
        query = query.filter(Horoscope.period_type == period_type)
    if date_filter:
        query = query.filter(Horoscope.date == date_filter)
    
    horoscopes = query.order_by(Horoscope.date.desc()).offset(skip).limit(limit).all()
    return horoscopes

@router.get("/daily", response_model=List[HoroscopeResponse])
async def get_daily_horoscopes(
    date_filter: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get daily horoscopes for all zodiac signs"""
    target_date = date_filter or datetime.now().date()
    
    horoscopes = db.query(Horoscope).filter(
        Horoscope.period_type == "daily",
        Horoscope.date == target_date
    ).all()
    
    # If no horoscopes exist for today, return sample data
    if not horoscopes:
        sample_horoscopes = []
        for sign in ZODIAC_SIGNS:
            sample_horoscopes.append(HoroscopeResponse(
                id=0,
                zodiac_sign=sign,
                date=datetime.now(),
                period_type="daily",
                content=f"Today brings new opportunities for {sign}. Trust your instincts and stay positive. Good fortune awaits those who take action.",
                love_score=7,
                career_score=8,
                health_score=6,
                lucky_color="Orange",
                lucky_number="7",
                created_at=datetime.now(),
                updated_at=None
            ))
        return sample_horoscopes
    
    return horoscopes

@router.get("/weekly", response_model=List[HoroscopeResponse])
async def get_weekly_horoscopes(
    date_filter: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get weekly horoscopes for all zodiac signs"""
    target_date = date_filter or datetime.now().date()
    
    horoscopes = db.query(Horoscope).filter(
        Horoscope.period_type == "weekly",
        Horoscope.date == target_date
    ).all()
    
    # If no horoscopes exist, return sample data
    if not horoscopes:
        sample_horoscopes = []
        for sign in ZODIAC_SIGNS:
            sample_horoscopes.append(HoroscopeResponse(
                id=0,
                zodiac_sign=sign,
                date=datetime.now(),
                period_type="weekly",
                content=f"This week is favorable for {sign}. Focus on your goals and maintain positive energy. Relationships will flourish.",
                love_score=8,
                career_score=7,
                health_score=8,
                lucky_color="Blue",
                lucky_number="3",
                created_at=datetime.now(),
                updated_at=None
            ))
        return sample_horoscopes
    
    return horoscopes

@router.get("/monthly", response_model=List[HoroscopeResponse])
async def get_monthly_horoscopes(
    date_filter: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get monthly horoscopes for all zodiac signs"""
    target_date = date_filter or datetime.now().date()
    
    horoscopes = db.query(Horoscope).filter(
        Horoscope.period_type == "monthly",
        Horoscope.date == target_date
    ).all()
    
    # If no horoscopes exist, return sample data
    if not horoscopes:
        sample_horoscopes = []
        for sign in ZODIAC_SIGNS:
            sample_horoscopes.append(HoroscopeResponse(
                id=0,
                zodiac_sign=sign,
                date=datetime.now(),
                period_type="monthly",
                content=f"This month brings significant changes for {sign}. Embrace new opportunities and trust the journey ahead.",
                love_score=9,
                career_score=8,
                health_score=7,
                lucky_color="Green",
                lucky_number="5",
                created_at=datetime.now(),
                updated_at=None
            ))
        return sample_horoscopes
    
    return horoscopes

@router.get("/{zodiac_sign}", response_model=List[HoroscopeResponse])
async def get_horoscope_by_sign(
    zodiac_sign: str,
    period_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get horoscopes for a specific zodiac sign"""
    if zodiac_sign not in ZODIAC_SIGNS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid zodiac sign"
        )
    
    query = db.query(Horoscope).filter(Horoscope.zodiac_sign == zodiac_sign)
    
    if period_type:
        query = query.filter(Horoscope.period_type == period_type)
    
    horoscopes = query.order_by(Horoscope.date.desc()).limit(10).all()
    
    # If no horoscopes exist, return sample data
    if not horoscopes:
        sample_horoscope = HoroscopeResponse(
            id=0,
            zodiac_sign=zodiac_sign,
            date=datetime.now(),
            period_type=period_type or "daily",
            content=f"Today brings new opportunities for {zodiac_sign}. Trust your instincts and stay positive. Good fortune awaits those who take action.",
            love_score=7,
            career_score=8,
            health_score=6,
            lucky_color="Orange",
            lucky_number="7",
            created_at=datetime.now(),
            updated_at=None
        )
        return [sample_horoscope]
    
    return horoscopes

@router.post("/", response_model=HoroscopeResponse)
async def create_horoscope(
    horoscope: HoroscopeCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Create horoscope (Admin/Editor only)"""
    if horoscope.zodiac_sign not in ZODIAC_SIGNS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid zodiac sign"
        )
    
    if horoscope.period_type not in ["daily", "weekly", "monthly"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid period type. Must be daily, weekly, or monthly"
        )
    
    db_horoscope = Horoscope(**horoscope.dict())
    db.add(db_horoscope)
    db.commit()
    db.refresh(db_horoscope)
    return db_horoscope

@router.put("/{horoscope_id}", response_model=HoroscopeResponse)
async def update_horoscope(
    horoscope_id: int,
    horoscope_update: HoroscopeCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Update horoscope (Admin/Editor only)"""
    horoscope = db.query(Horoscope).filter(Horoscope.id == horoscope_id).first()
    if not horoscope:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horoscope not found"
        )
    
    update_data = horoscope_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(horoscope, field, value)
    
    db.commit()
    db.refresh(horoscope)
    return horoscope

@router.delete("/{horoscope_id}")
async def delete_horoscope(
    horoscope_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Delete horoscope (Admin/Editor only)"""
    horoscope = db.query(Horoscope).filter(Horoscope.id == horoscope_id).first()
    if not horoscope:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horoscope not found"
        )
    
    db.delete(horoscope)
    db.commit()
    return {"message": "Horoscope deleted successfully"}
