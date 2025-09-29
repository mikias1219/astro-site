"""
Testimonials router for managing customer testimonials
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Testimonial, User
from app.schemas import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from app.auth import get_current_active_user, get_admin_or_editor_user

router = APIRouter()

@router.get("/", response_model=List[TestimonialResponse])
async def get_testimonials(
    skip: int = 0,
    limit: int = 100,
    approved_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all testimonials"""
    query = db.query(Testimonial)
    
    if approved_only:
        query = query.filter(Testimonial.is_approved == True)
    
    testimonials = query.order_by(Testimonial.created_at.desc()).offset(skip).limit(limit).all()
    return testimonials

@router.get("/{testimonial_id}", response_model=TestimonialResponse)
async def get_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    """Get a specific testimonial by ID"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    return testimonial

@router.post("/", response_model=TestimonialResponse)
async def create_testimonial(
    testimonial: TestimonialCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new testimonial"""
    db_testimonial = Testimonial(
        **testimonial.dict(),
        user_id=current_user.id,
        is_approved=False  # Requires admin approval
    )
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: int,
    testimonial_update: TestimonialUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a testimonial"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    # Users can only update their own testimonials
    if current_user.role not in ["admin", "editor"] and testimonial.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # If user updates their testimonial, reset approval status
    if current_user.role not in ["admin", "editor"]:
        testimonial_update.is_approved = False
    
    update_data = testimonial_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(testimonial, field, value)
    
    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.delete("/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a testimonial"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    # Users can only delete their own testimonials, admins can delete any
    if current_user.role not in ["admin", "editor"] and testimonial.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db.delete(testimonial)
    db.commit()
    return {"message": "Testimonial deleted successfully"}

@router.post("/{testimonial_id}/approve")
async def approve_testimonial(
    testimonial_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Approve a testimonial (Admin/Editor only)"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    testimonial.is_approved = True
    db.commit()
    
    return {"message": "Testimonial approved successfully"}

@router.post("/{testimonial_id}/reject")
async def reject_testimonial(
    testimonial_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Reject a testimonial (Admin/Editor only)"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    testimonial.is_approved = False
    db.commit()
    
    return {"message": "Testimonial rejected successfully"}
