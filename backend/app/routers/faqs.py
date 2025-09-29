"""
FAQs router for managing frequently asked questions
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import FAQ, User
from app.schemas import FAQCreate, FAQUpdate, FAQResponse
from app.auth import get_admin_or_editor_user

router = APIRouter()

@router.get("/", response_model=List[FAQResponse])
async def get_faqs(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all FAQs"""
    query = db.query(FAQ)
    
    if active_only:
        query = query.filter(FAQ.is_active == True)
    
    if category:
        query = query.filter(FAQ.category == category)
    
    faqs = query.order_by(FAQ.order.asc()).offset(skip).limit(limit).all()
    return faqs

@router.get("/categories")
async def get_faq_categories(db: Session = Depends(get_db)):
    """Get all FAQ categories"""
    categories = db.query(FAQ.category).filter(
        FAQ.is_active == True,
        FAQ.category.isnot(None)
    ).distinct().all()
    return [cat[0] for cat in categories]

@router.get("/{faq_id}", response_model=FAQResponse)
async def get_faq(faq_id: int, db: Session = Depends(get_db)):
    """Get a specific FAQ by ID"""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )
    return faq

@router.post("/", response_model=FAQResponse)
async def create_faq(
    faq: FAQCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Create a new FAQ (Admin/Editor only)"""
    db_faq = FAQ(**faq.dict())
    db.add(db_faq)
    db.commit()
    db.refresh(db_faq)
    return db_faq

@router.put("/{faq_id}", response_model=FAQResponse)
async def update_faq(
    faq_id: int,
    faq_update: FAQUpdate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Update an FAQ (Admin/Editor only)"""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )
    
    update_data = faq_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faq, field, value)
    
    db.commit()
    db.refresh(faq)
    return faq

@router.delete("/{faq_id}")
async def delete_faq(
    faq_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Delete an FAQ (Admin/Editor only)"""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )
    
    db.delete(faq)
    db.commit()
    return {"message": "FAQ deleted successfully"}
