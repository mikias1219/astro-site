"""
Pages router for managing website pages
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Page, User
from app.schemas import PageCreate, PageUpdate, PageResponse
from app.auth import get_admin_or_editor_user

router = APIRouter()

@router.get("/", response_model=List[PageResponse])
async def get_pages(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all pages"""
    query = db.query(Page)
    
    if published_only:
        query = query.filter(Page.is_published == True)
    
    pages = query.offset(skip).limit(limit).all()
    return pages

@router.get("/{page_id}", response_model=PageResponse)
async def get_page(page_id: int, db: Session = Depends(get_db)):
    """Get a specific page by ID"""
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found"
        )
    return page

@router.get("/slug/{slug}", response_model=PageResponse)
async def get_page_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a page by slug"""
    page = db.query(Page).filter(Page.slug == slug, Page.is_published == True).first()
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found"
        )
    return page

@router.post("/", response_model=PageResponse)
async def create_page(
    page: PageCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Create a new page (Admin/Editor only)"""
    # Check if slug already exists
    existing_page = db.query(Page).filter(Page.slug == page.slug).first()
    if existing_page:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page with this slug already exists"
        )
    
    db_page = Page(**page.dict(), author_id=current_user.id)
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page

@router.put("/{page_id}", response_model=PageResponse)
async def update_page(
    page_id: int,
    page_update: PageUpdate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Update a page (Admin/Editor only)"""
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found"
        )
    
    # Check if new slug conflicts with existing pages
    if page_update.slug and page_update.slug != page.slug:
        existing_page = db.query(Page).filter(Page.slug == page_update.slug).first()
        if existing_page:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Page with this slug already exists"
            )
    
    update_data = page_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(page, field, value)
    
    db.commit()
    db.refresh(page)
    return page

@router.delete("/{page_id}")
async def delete_page(
    page_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Delete a page (Admin/Editor only)"""
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found"
        )
    
    db.delete(page)
    db.commit()
    return {"message": "Page deleted successfully"}
