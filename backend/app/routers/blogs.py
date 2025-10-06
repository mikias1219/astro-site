"""
Blogs router for managing blog posts
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Blog, User
from app.schemas import BlogCreate, BlogUpdate, BlogResponse
from app.auth import get_admin_or_editor_user

router = APIRouter()

@router.get("/", response_model=List[BlogResponse])
async def get_blogs(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all blog posts"""
    try:
        query = db.query(Blog)

        if published_only:
            query = query.filter(Blog.is_published == True)

        blogs = query.order_by(Blog.created_at.desc()).offset(skip).limit(limit).all()

        # Log for debugging
        print(f"Found {len(blogs)} blogs")

        return blogs
    except Exception as e:
        print(f"Error in get_blogs: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

@router.get("/{blog_id}", response_model=BlogResponse)
async def get_blog(blog_id: int, db: Session = Depends(get_db)):
    """Get a specific blog post by ID"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Increment view count
    blog.view_count += 1
    db.commit()
    
    return blog

@router.get("/slug/{slug}", response_model=BlogResponse)
async def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a blog post by slug"""
    blog = db.query(Blog).filter(Blog.slug == slug, Blog.is_published == True).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Increment view count
    blog.view_count += 1
    db.commit()
    
    return blog

@router.post("/", response_model=BlogResponse)
async def create_blog(
    blog: BlogCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Create a new blog post (Admin/Editor only)"""
    # Check if slug already exists
    existing_blog = db.query(Blog).filter(Blog.slug == blog.slug).first()
    if existing_blog:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blog post with this slug already exists"
        )
    
    db_blog = Blog(**blog.dict(), author_id=current_user.id)
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.put("/{blog_id}", response_model=BlogResponse)
async def update_blog(
    blog_id: int,
    blog_update: BlogUpdate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Update a blog post (Admin/Editor only)"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Check if new slug conflicts with existing blog posts
    if blog_update.slug and blog_update.slug != blog.slug:
        existing_blog = db.query(Blog).filter(Blog.slug == blog_update.slug).first()
        if existing_blog:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Blog post with this slug already exists"
            )
    
    update_data = blog_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(blog, field, value)
    
    # Set published_at when publishing for the first time
    if blog_update.is_published and not blog.published_at:
        blog.published_at = datetime.now()
    
    db.commit()
    db.refresh(blog)
    return blog

@router.delete("/{blog_id}")
async def delete_blog(
    blog_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Delete a blog post (Admin/Editor only)"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    db.delete(blog)
    db.commit()
    return {"message": "Blog post deleted successfully"}

@router.get("/popular/", response_model=List[BlogResponse])
async def get_popular_blogs(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get popular blog posts by view count"""
    blogs = db.query(Blog).filter(
        Blog.is_published == True
    ).order_by(Blog.view_count.desc()).limit(limit).all()
    return blogs
