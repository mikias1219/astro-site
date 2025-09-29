"""
SEO router for managing meta tags, titles, descriptions, and sitemap
"""

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import SEO, Page, Blog, User
from app.schemas import SEOCreate, SEOUpdate, SEOResponse
from app.auth import get_admin_or_editor_user

router = APIRouter()

@router.get("/", response_model=List[SEOResponse])
async def get_seo_data(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all SEO data"""
    seo_data = db.query(SEO).offset(skip).limit(limit).all()
    return seo_data

@router.get("/page/{page_slug}", response_model=SEOResponse)
async def get_seo_by_page_slug(page_slug: str, db: Session = Depends(get_db)):
    """Get SEO data for a specific page by slug"""
    page = db.query(Page).filter(Page.slug == page_slug).first()
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found"
        )
    
    seo_data = db.query(SEO).filter(SEO.page_id == page.id).first()
    if not seo_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SEO data not found for this page"
        )
    
    return seo_data

@router.get("/blog/{blog_slug}", response_model=SEOResponse)
async def get_seo_by_blog_slug(blog_slug: str, db: Session = Depends(get_db)):
    """Get SEO data for a specific blog post by slug"""
    blog = db.query(Blog).filter(Blog.slug == blog_slug).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    seo_data = db.query(SEO).filter(SEO.blog_id == blog.id).first()
    if not seo_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SEO data not found for this blog post"
        )
    
    return seo_data

@router.post("/", response_model=SEOResponse)
async def create_seo_data(
    seo: SEOCreate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Create SEO data (Admin/Editor only)"""
    # Validate that either page_id or blog_id is provided, but not both
    if not seo.page_id and not seo.blog_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either page_id or blog_id must be provided"
        )
    
    if seo.page_id and seo.blog_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot provide both page_id and blog_id"
        )
    
    # Check if page or blog exists
    if seo.page_id:
        page = db.query(Page).filter(Page.id == seo.page_id).first()
        if not page:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Page not found"
            )
        # Check if SEO data already exists for this page
        existing_seo = db.query(SEO).filter(SEO.page_id == seo.page_id).first()
        if existing_seo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="SEO data already exists for this page"
            )
    
    if seo.blog_id:
        blog = db.query(Blog).filter(Blog.id == seo.blog_id).first()
        if not blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog post not found"
            )
        # Check if SEO data already exists for this blog
        existing_seo = db.query(SEO).filter(SEO.blog_id == seo.blog_id).first()
        if existing_seo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="SEO data already exists for this blog post"
            )
    
    db_seo = SEO(**seo.dict())
    db.add(db_seo)
    db.commit()
    db.refresh(db_seo)
    return db_seo

@router.put("/{seo_id}", response_model=SEOResponse)
async def update_seo_data(
    seo_id: int,
    seo_update: SEOUpdate,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Update SEO data (Admin/Editor only)"""
    seo_data = db.query(SEO).filter(SEO.id == seo_id).first()
    if not seo_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SEO data not found"
        )
    
    update_data = seo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(seo_data, field, value)
    
    db.commit()
    db.refresh(seo_data)
    return seo_data

@router.delete("/{seo_id}")
async def delete_seo_data(
    seo_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Delete SEO data (Admin/Editor only)"""
    seo_data = db.query(SEO).filter(SEO.id == seo_id).first()
    if not seo_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SEO data not found"
        )
    
    db.delete(seo_data)
    db.commit()
    return {"message": "SEO data deleted successfully"}

@router.get("/sitemap.xml")
async def get_sitemap(db: Session = Depends(get_db)):
    """Generate XML sitemap"""
    # Get all published pages and blogs
    pages = db.query(Page).filter(Page.is_published == True).all()
    blogs = db.query(Blog).filter(Blog.is_published == True).all()
    
    # Generate XML sitemap
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Add pages
    for page in pages:
        xml_content += f'  <url>\n'
        xml_content += f'    <loc>https://yourwebsite.com/{page.slug}</loc>\n'
        xml_content += f'    <lastmod>{page.updated_at.isoformat() if page.updated_at else page.created_at.isoformat()}</lastmod>\n'
        xml_content += f'    <changefreq>weekly</changefreq>\n'
        xml_content += f'    <priority>0.8</priority>\n'
        xml_content += f'  </url>\n'
    
    # Add blog posts
    for blog in blogs:
        xml_content += f'  <url>\n'
        xml_content += f'    <loc>https://yourwebsite.com/blog/{blog.slug}</loc>\n'
        xml_content += f'    <lastmod>{blog.updated_at.isoformat() if blog.updated_at else blog.created_at.isoformat()}</lastmod>\n'
        xml_content += f'    <changefreq>monthly</changefreq>\n'
        xml_content += f'    <priority>0.6</priority>\n'
        xml_content += f'  </url>\n'
    
    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")

@router.get("/robots.txt")
async def get_robots_txt():
    """Generate robots.txt file"""
    robots_content = """User-agent: *
Allow: /

Sitemap: https://yourwebsite.com/api/seo/sitemap.xml
"""
    return Response(content=robots_content, media_type="text/plain")
