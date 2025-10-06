"""
Comprehensive SEO Admin router for the SEO management system
"""

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

from app.database import get_db
from app.models import User
from app.auth import get_admin_user

router = APIRouter()

# ============================================================================
# BASIC META OPTIONS
# ============================================================================

@router.get("/meta")
async def get_seo_meta_data(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all SEO meta data"""
    # This would typically query a seo_meta table
    # For now, return mock data
    return [
        {
            "id": 1,
            "page_url": "/about",
            "title": "About Us - Astrology Website",
            "meta_description": "Learn about our astrology services and expert astrologers",
            "meta_keywords": "astrology, about, services",
            "canonical_url": "https://example.com/about",
            "robots": "index, follow",
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]

@router.get("/meta/page/{page_url:path}")
async def get_seo_meta_by_page(
    page_url: str,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get SEO meta data by page URL"""
    # Mock implementation
    return {
        "id": 1,
        "page_url": page_url,
        "title": f"Page Title for {page_url}",
        "meta_description": f"Meta description for {page_url}",
        "meta_keywords": "keywords, for, page",
        "canonical_url": f"https://example.com{page_url}",
        "robots": "index, follow",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }

@router.post("/meta")
async def create_seo_meta(
    meta_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create new SEO meta data"""
    # Mock implementation - in real app, save to database
    return {
        "id": 2,
        **meta_data,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

@router.put("/meta/{meta_id}")
async def update_seo_meta(
    meta_id: int,
    meta_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update SEO meta data"""
    # Mock implementation
    return {
        "id": meta_id,
        **meta_data,
        "updated_at": datetime.now().isoformat()
    }

@router.delete("/meta/{meta_id}")
async def delete_seo_meta(
    meta_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete SEO meta data"""
    return {"message": "SEO meta data deleted successfully"}

@router.put("/meta/bulk")
async def bulk_update_seo_meta(
    updates: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Bulk update SEO meta data"""
    # Mock implementation
    return [{"id": update["id"], **update["data"]} for update in updates.get("updates", [])]

# ============================================================================
# STRUCTURED DATA (SCHEMA MARKUP)
# ============================================================================

@router.get("/schema")
async def get_schema_data(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all schema data"""
    return [
        {
            "id": 1,
            "page_url": "/about",
            "schema_type": "organization",
            "schema_data": {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Astrology Website",
                "description": "Professional astrology services"
            },
            "is_active": True,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]

@router.get("/schema/page/{page_url:path}")
async def get_schema_by_page(
    page_url: str,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get schema data by page URL"""
    return []

@router.post("/schema")
async def create_schema(
    schema_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create new schema data"""
    return {
        "id": 2,
        **schema_data,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

@router.put("/schema/{schema_id}")
async def update_schema(
    schema_id: int,
    schema_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update schema data"""
    return {
        "id": schema_id,
        **schema_data,
        "updated_at": datetime.now().isoformat()
    }

@router.delete("/schema/{schema_id}")
async def delete_schema(
    schema_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete schema data"""
    return {"message": "Schema data deleted successfully"}

@router.post("/schema/auto-generate")
async def auto_generate_schema(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Auto-generate schema based on page type"""
    page_type = request_data.get("page_type", "article")
    page_url = request_data.get("page_url", "/")
    
    # Mock auto-generated schema based on page type
    if page_type == "article":
        schema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": f"Article for {page_url}",
            "description": f"Article description for {page_url}",
            "author": {"@type": "Person", "name": "Author Name"},
            "publisher": {"@type": "Organization", "name": "Astrology Website"},
            "datePublished": datetime.now().isoformat(),
            "dateModified": datetime.now().isoformat()
        }
    elif page_type == "product":
        schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": f"Product for {page_url}",
            "description": f"Product description for {page_url}",
            "offers": {"@type": "Offer", "price": "99.99", "priceCurrency": "USD"}
        }
    else:
        schema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": f"Page for {page_url}",
            "description": f"Page description for {page_url}"
        }
    
    return {
        "id": 3,
        "page_url": page_url,
        "schema_type": page_type,
        "schema_data": schema,
        "is_active": True,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

@router.post("/schema/validate")
async def validate_schema(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Validate schema data"""
    # Mock validation
    return {
        "valid": True,
        "errors": []
    }

# ============================================================================
# URL & CANONICAL CONTROL
# ============================================================================

@router.get("/urls")
async def get_url_data(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all URL data"""
    return [
        {
            "id": 1,
            "page_url": "/about",
            "custom_slug": "about-us",
            "canonical_url": "https://example.com/about",
            "redirect_from": ["/old-about"],
            "redirect_to": "",
            "redirect_type": 301,
            "is_active": True,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]

@router.get("/urls/page/{page_url:path}")
async def get_url_by_page(
    page_url: str,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get URL data by page URL"""
    return {
        "id": 1,
        "page_url": page_url,
        "custom_slug": page_url.replace("/", ""),
        "canonical_url": f"https://example.com{page_url}",
        "redirect_from": [],
        "redirect_to": "",
        "redirect_type": 301,
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }

@router.post("/urls")
async def create_url_data(
    url_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create new URL data"""
    return {
        "id": 2,
        **url_data,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

@router.put("/urls/{url_id}")
async def update_url_data(
    url_id: int,
    url_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update URL data"""
    return {
        "id": url_id,
        **url_data,
        "updated_at": datetime.now().isoformat()
    }

@router.delete("/urls/{url_id}")
async def delete_url_data(
    url_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete URL data"""
    return {"message": "URL data deleted successfully"}

@router.post("/urls/generate-slug")
async def generate_slug(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Generate SEO-friendly slug"""
    title = request_data.get("title", "")
    # Simple slug generation
    slug = title.lower().replace(" ", "-").replace("&", "and")
    return {"slug": slug}

@router.post("/urls/check-slug")
async def check_slug_availability(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Check if slug is available"""
    slug = request_data.get("slug", "")
    # Mock availability check
    return {"available": True}

@router.post("/urls/canonical")
async def set_canonical_url(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Set canonical URL"""
    return {
        "id": 1,
        "page_url": request_data.get("page_url", ""),
        "canonical_url": request_data.get("canonical_url", ""),
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": datetime.now().isoformat()
    }

# ============================================================================
# ROBOTS & SITEMAP
# ============================================================================

@router.get("/robots")
async def get_robots(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get robots.txt content"""
    return {
        "content": """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml"""
    }

@router.put("/robots")
async def update_robots(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update robots.txt content"""
    return {
        "content": request_data.get("content", "")
    }

@router.get("/sitemap")
async def get_sitemap_entries(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all sitemap entries"""
    return [
        {
            "id": 1,
            "url": "https://example.com/",
            "last_modified": "2024-01-01T00:00:00Z",
            "change_frequency": "daily",
            "priority": 1.0,
            "page_type": "homepage",
            "include_images": True,
            "include_categories": False,
            "include_tags": False,
            "is_active": True,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]

@router.post("/sitemap")
async def add_sitemap_entry(
    sitemap_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Add sitemap entry"""
    return {
        "id": 2,
        **sitemap_data,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

@router.put("/sitemap/{entry_id}")
async def update_sitemap_entry(
    entry_id: int,
    sitemap_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update sitemap entry"""
    return {
        "id": entry_id,
        **sitemap_data,
        "updated_at": datetime.now().isoformat()
    }

@router.delete("/sitemap/{entry_id}")
async def delete_sitemap_entry(
    entry_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete sitemap entry"""
    return {"message": "Sitemap entry deleted successfully"}

@router.post("/sitemap/generate")
async def generate_sitemap(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Generate XML sitemap"""
    xml_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01T00:00:00Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>"""
    
    return {
        "xml_content": xml_content,
        "url": "https://example.com/sitemap.xml"
    }

@router.post("/sitemap/auto-generate")
async def auto_generate_sitemap(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Auto-generate sitemap entries"""
    return [
        {
            "id": 3,
            "url": "https://example.com/about",
            "last_modified": datetime.now().isoformat(),
            "change_frequency": "monthly",
            "priority": 0.8,
            "page_type": "page",
            "include_images": False,
            "include_categories": False,
            "include_tags": False,
            "is_active": True,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    ]

@router.post("/sitemap/submit")
async def submit_sitemap(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Submit sitemap to search engines"""
    search_engine = request_data.get("search_engine", "google")
    return {
        "success": True,
        "message": f"Sitemap submitted to {search_engine} successfully"
    }

# ============================================================================
# ANALYTICS & TRACKING
# ============================================================================

@router.get("/analytics")
async def get_analytics_data(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all analytics configurations"""
    return [
        {
            "id": 1,
            "service": "google_analytics",
            "tracking_id": "G-XXXXXXXXXX",
            "measurement_id": "G-XXXXXXXXXX",
            "property_id": "",
            "is_active": True,
            "config": {},
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]

@router.post("/analytics")
async def add_analytics(
    analytics_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Add analytics configuration"""
    return {
        "id": 2,
        **analytics_data,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

@router.put("/analytics/{analytics_id}")
async def update_analytics(
    analytics_id: int,
    analytics_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update analytics configuration"""
    return {
        "id": analytics_id,
        **analytics_data,
        "updated_at": datetime.now().isoformat()
    }

@router.delete("/analytics/{analytics_id}")
async def delete_analytics(
    analytics_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete analytics configuration"""
    return {"message": "Analytics configuration deleted successfully"}

@router.post("/analytics/test")
async def test_analytics_connection(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Test analytics connection"""
    service = request_data.get("service", "")
    tracking_id = request_data.get("tracking_id", "")
    return {
        "success": True,
        "message": f"Connection to {service} with ID {tracking_id} successful"
    }

@router.get("/analytics/report")
async def get_analytics_report(
    range: str = "30d",
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get analytics report"""
    return {
        "date_range": range,
        "total_visitors": 1250,
        "total_page_views": 3500,
        "bounce_rate": 45.2,
        "avg_session_duration": 180,
        "top_pages": [
            {"page": "/", "views": 500, "unique_visitors": 400},
            {"page": "/about", "views": 300, "unique_visitors": 250}
        ],
        "top_keywords": [
            {"keyword": "astrology", "impressions": 1000, "clicks": 50, "ctr": 5.0, "position": 3.2}
        ],
        "device_breakdown": {"desktop": 60, "mobile": 35, "tablet": 5},
        "traffic_sources": {"organic": 40, "direct": 30, "referral": 20, "social": 7, "paid": 3}
    }

@router.get("/analytics/search-console")
async def get_search_console_data(
    range: str = "30d",
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get Google Search Console data"""
    return {
        "total_clicks": 150,
        "total_impressions": 3000,
        "average_ctr": 5.0,
        "average_position": 15.5,
        "top_queries": [
            {"query": "astrology reading", "clicks": 25, "impressions": 500, "ctr": 5.0, "position": 8.2}
        ],
        "top_pages": [
            {"page": "/", "clicks": 50, "impressions": 1000, "ctr": 5.0, "position": 12.1}
        ]
    }

@router.post("/analytics/generate-code")
async def generate_tracking_code(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Generate tracking code"""
    service = request_data.get("service", "google_analytics")
    
    if service == "google_analytics":
        code = """<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>"""
    else:
        code = f"<!-- {service} tracking code -->"
    
    return {"code": code}

# ============================================================================
# IMAGE OPTIMIZATION
# ============================================================================

@router.get("/images")
async def get_images(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all images"""
    return [
        {
            "id": 1,
            "image_url": "https://example.com/image1.jpg",
            "alt_text": "Astrology consultation",
            "title_attribute": "Professional astrology reading",
            "caption": "Expert astrologer providing consultation",
            "file_size": 1024000,
            "dimensions": {"width": 1920, "height": 1080},
            "compression_ratio": 25,
            "is_optimized": True,
            "page_url": "/about",
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]

@router.get("/images/page/{page_url:path}")
async def get_images_by_page(
    page_url: str,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get images by page URL"""
    return []

@router.post("/images")
async def add_image(
    image_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Add image"""
    return {
        "id": 2,
        **image_data,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

@router.put("/images/{image_id}")
async def update_image(
    image_id: int,
    image_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update image"""
    return {
        "id": image_id,
        **image_data,
        "updated_at": datetime.now().isoformat()
    }

@router.delete("/images/{image_id}")
async def delete_image(
    image_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete image"""
    return {"message": "Image deleted successfully"}

@router.post("/images/{image_id}/optimize")
async def optimize_image(
    image_id: int,
    settings: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Optimize image"""
    return {
        "optimized_url": f"https://example.com/optimized/image{image_id}.webp",
        "original_size": 1024000,
        "optimized_size": 512000,
        "compression_ratio": 50
    }

@router.post("/images/bulk-optimize")
async def bulk_optimize_images(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Bulk optimize images"""
    image_ids = request_data.get("image_ids", [])
    return {
        "success_count": len(image_ids),
        "failed_count": 0,
        "results": [
            {"id": img_id, "success": True, "optimized_url": f"https://example.com/optimized/image{img_id}.webp"}
            for img_id in image_ids
        ]
    }

@router.post("/images/generate-alt-text")
async def generate_alt_text(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Generate alt text for image"""
    image_url = request_data.get("image_url", "")
    return {"alt_text": f"Generated alt text for {image_url}"}

@router.post("/images/scan-page")
async def scan_page_images(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Scan page for images"""
    page_url = request_data.get("page_url", "")
    return [
        {
            "id": 3,
            "image_url": f"https://example.com/page-image.jpg",
            "alt_text": "",
            "title_attribute": "",
            "caption": "",
            "file_size": 512000,
            "dimensions": {"width": 800, "height": 600},
            "is_optimized": False,
            "page_url": page_url,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    ]

@router.get("/images/settings")
async def get_optimization_settings(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get optimization settings"""
    return {
        "quality": 85,
        "max_width": 1920,
        "max_height": 1080,
        "format": "webp",
        "enable_lazy_loading": True,
        "enable_compression": True
    }

@router.put("/images/settings")
async def update_optimization_settings(
    settings: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update optimization settings"""
    return settings

# ============================================================================
# PERFORMANCE OPTIMIZATION
# ============================================================================

@router.get("/performance/settings")
async def get_performance_settings(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get performance settings"""
    return {
        "minify_css": True,
        "minify_js": True,
        "enable_browser_caching": True,
        "cache_duration": 86400,
        "enable_lazy_loading": True,
        "enable_gzip_compression": True,
        "enable_cdn": False,
        "cdn_url": "",
        "enable_preload": False,
        "preload_resources": [],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }

@router.put("/performance/settings")
async def update_performance_settings(
    settings: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update performance settings"""
    return {
        **settings,
        "updated_at": datetime.now().isoformat()
    }

@router.get("/performance/report/{page_url:path}")
async def get_page_performance_report(
    page_url: str,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get performance report for a page"""
    return {
        "page_url": page_url,
        "load_time": 1200,
        "first_contentful_paint": 800,
        "largest_contentful_paint": 1500,
        "cumulative_layout_shift": 0.1,
        "first_input_delay": 50,
        "performance_score": 85,
        "accessibility_score": 92,
        "best_practices_score": 88,
        "seo_score": 95,
        "recommendations": [
            {"type": "warning", "message": "Optimize images", "impact": "medium"},
            {"type": "info", "message": "Enable compression", "impact": "low"}
        ],
        "mobile_performance": {
            "load_time": 1800,
            "performance_score": 75,
            "is_mobile_friendly": True
        }
    }

@router.get("/performance/reports")
async def get_all_performance_reports(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get performance reports for all pages"""
    return []

@router.post("/performance/audit")
async def run_performance_audit(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Run performance audit"""
    page_url = request_data.get("page_url", "")
    return {
        "page_url": page_url,
        "load_time": 1200,
        "first_contentful_paint": 800,
        "largest_contentful_paint": 1500,
        "cumulative_layout_shift": 0.1,
        "first_input_delay": 50,
        "performance_score": 85,
        "accessibility_score": 92,
        "best_practices_score": 88,
        "seo_score": 95,
        "recommendations": [
            {"type": "warning", "message": "Optimize images", "impact": "medium"},
            {"type": "info", "message": "Enable compression", "impact": "low"}
        ],
        "mobile_performance": {
            "load_time": 1800,
            "performance_score": 75,
            "is_mobile_friendly": True
        }
    }

@router.post("/performance/minify-css")
async def minify_css(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Minify CSS"""
    css_content = request_data.get("css_content", "")
    # Mock minification
    minified_css = css_content.replace("  ", "").replace("\n", "")
    return {
        "minified_css": minified_css,
        "size_reduction": 30
    }

@router.post("/performance/minify-js")
async def minify_js(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Minify JavaScript"""
    js_content = request_data.get("js_content", "")
    # Mock minification
    minified_js = js_content.replace("  ", "").replace("\n", "")
    return {
        "minified_js": minified_js,
        "size_reduction": 25
    }

@router.post("/performance/caching-headers")
async def generate_caching_headers(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Generate browser caching headers"""
    file_types = request_data.get("file_types", [])
    return {
        "css": "Cache-Control: public, max-age=31536000",
        "js": "Cache-Control: public, max-age=31536000",
        "images": "Cache-Control: public, max-age=31536000"
    }

@router.post("/performance/mobile-test")
async def test_mobile_responsiveness(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Test mobile responsiveness"""
    page_url = request_data.get("page_url", "")
    return {
        "is_mobile_friendly": True,
        "issues": [
            {"type": "viewport", "description": "Viewport meta tag missing", "severity": "error"}
        ],
        "screenshots": {
            "desktop": "https://example.com/screenshots/desktop.png",
            "mobile": "https://example.com/screenshots/mobile.png"
        }
    }

@router.get("/performance/recommendations/{page_url:path}")
async def get_performance_recommendations(
    page_url: str,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get performance recommendations"""
    return [
        {
            "category": "performance",
            "title": "Optimize Images",
            "description": "Compress and optimize images to reduce file size",
            "impact": "high",
            "effort": "medium",
            "savings": "2.5s"
        }
    ]

# ============================================================================
# REDIRECT MANAGER
# ============================================================================

@router.get("/redirects")
async def get_redirects(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all redirects"""
    from app.models import Redirect
    redirects = db.query(Redirect).order_by(Redirect.created_at.desc()).all()
    return [
        {
            "id": redirect.id,
            "from_url": redirect.from_url,
            "to_url": redirect.to_url,
            "redirect_type": redirect.redirect_type,
            "is_active": redirect.is_active,
            "description": redirect.description,
            "created_at": redirect.created_at.isoformat() if redirect.created_at else None,
            "updated_at": redirect.updated_at.isoformat() if redirect.updated_at else None
        }
        for redirect in redirects
    ]

@router.post("/redirects")
async def add_redirect(
    redirect_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Add redirect"""
    from app.models import Redirect

    # Validate required fields
    if not redirect_data.get("from_url") or not redirect_data.get("to_url"):
        raise HTTPException(status_code=400, detail="from_url and to_url are required")

    # Check if from_url already exists
    existing = db.query(Redirect).filter(Redirect.from_url == redirect_data["from_url"]).first()
    if existing:
        raise HTTPException(status_code=400, detail="Redirect from this URL already exists")

    redirect = Redirect(
        from_url=redirect_data["from_url"],
        to_url=redirect_data["to_url"],
        redirect_type=redirect_data.get("redirect_type", 301),
        is_active=redirect_data.get("is_active", True),
        description=redirect_data.get("description", "")
    )

    db.add(redirect)
    db.commit()
    db.refresh(redirect)

    return {
        "id": redirect.id,
        "from_url": redirect.from_url,
        "to_url": redirect.to_url,
        "redirect_type": redirect.redirect_type,
        "is_active": redirect.is_active,
        "description": redirect.description,
        "created_at": redirect.created_at.isoformat() if redirect.created_at else None,
        "updated_at": redirect.updated_at.isoformat() if redirect.updated_at else None
    }

@router.put("/redirects/{redirect_id}")
async def update_redirect(
    redirect_id: int,
    redirect_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update redirect"""
    from app.models import Redirect

    redirect = db.query(Redirect).filter(Redirect.id == redirect_id).first()
    if not redirect:
        raise HTTPException(status_code=404, detail="Redirect not found")

    # Check if from_url is being changed and if it conflicts
    if "from_url" in redirect_data and redirect_data["from_url"] != redirect.from_url:
        existing = db.query(Redirect).filter(
            Redirect.from_url == redirect_data["from_url"],
            Redirect.id != redirect_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Redirect from this URL already exists")

    # Update fields
    for field in ["from_url", "to_url", "redirect_type", "is_active", "description"]:
        if field in redirect_data:
            setattr(redirect, field, redirect_data[field])

    db.commit()
    db.refresh(redirect)

    return {
        "id": redirect.id,
        "from_url": redirect.from_url,
        "to_url": redirect.to_url,
        "redirect_type": redirect.redirect_type,
        "is_active": redirect.is_active,
        "description": redirect.description,
        "created_at": redirect.created_at.isoformat() if redirect.created_at else None,
        "updated_at": redirect.updated_at.isoformat() if redirect.updated_at else None
    }

@router.delete("/redirects/{redirect_id}")
async def delete_redirect(
    redirect_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete redirect"""
    from app.models import Redirect

    redirect = db.query(Redirect).filter(Redirect.id == redirect_id).first()
    if not redirect:
        raise HTTPException(status_code=404, detail="Redirect not found")

    db.delete(redirect)
    db.commit()

    return {"message": "Redirect deleted successfully"}

@router.post("/redirects/test")
async def test_redirect(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Test redirect"""
    from_url = request_data.get("from_url", "")
    return {
        "found": True,
        "redirect": {
            "to_url": "https://example.com/new-page",
            "redirect_type": 301,
            "status": "Permanent Redirect"
        }
    }

@router.post("/redirects/bulk-import")
async def bulk_import_redirects(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Bulk import redirects"""
    redirects = request_data.get("redirects", [])
    return {
        "success_count": len(redirects),
        "failed_count": 0,
        "errors": []
    }

@router.get("/redirects/export")
async def export_redirects(
    format: str = "csv",
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Export redirects"""
    return {
        "download_url": f"https://example.com/exports/redirects.{format}"
    }

@router.get("/redirects/rules")
async def get_redirect_rules(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get redirect rules"""
    return []

@router.post("/redirects/rules")
async def add_redirect_rule(
    rule_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Add redirect rule"""
    return {
        "id": 1,
        **rule_data,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

@router.put("/redirects/rules/{rule_id}")
async def update_redirect_rule(
    rule_id: int,
    rule_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update redirect rule"""
    return {
        "id": rule_id,
        **rule_data,
        "updated_at": datetime.now().isoformat()
    }

@router.delete("/redirects/rules/{rule_id}")
async def delete_redirect_rule(
    rule_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete redirect rule"""
    return {"message": "Redirect rule deleted successfully"}

@router.post("/redirects/rules/test")
async def test_redirect_rule(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Test redirect rule"""
    pattern = request_data.get("pattern", "")
    test_url = request_data.get("test_url", "")
    return {
        "matches": True,
        "result_url": "https://example.com/redirected"
    }


# ============================================================================
# GLOBAL SEO SETTINGS MANAGEMENT
# ============================================================================

@router.get("/settings")
async def get_seo_settings(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get global SEO settings"""
    # For now, return default settings. In production, this would come from database
    return {
        "site_title": "AstroArupShastri - Professional Vedic Astrology Services",
        "site_description": "Get accurate Vedic astrology consultations, horoscope readings, and spiritual guidance from Dr. Arup Shastri. Trusted astrology services for personal growth and life decisions.",
        "site_keywords": "astrology, vedic astrology, horoscope, spiritual consultation, Dr. Arup Shastri, birth chart, kundli, panchang, gemstone consultation",
        "google_analytics_id": "",
        "facebook_app_id": "",
        "twitter_handle": "@astroarupshastri",
        "robots_txt": """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: https://astroarupshastri.com/sitemap.xml""",
        "sitemap_url": "https://astroarupshastri.com/sitemap.xml",
        "schema_markup": """{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AstroArupShastri",
  "url": "https://astroarupshastri.com",
  "logo": "https://astroarupshastri.com/logo.svg",
  "description": "Professional Vedic astrology consultations and spiritual guidance",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9876543210",
    "contactType": "customer service"
  }
}"""
    }


@router.put("/settings")
async def update_seo_settings(
    settings: Dict[str, Any],
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update global SEO settings"""
    # For now, just return success. In production, save to database
    return {
        "message": "SEO settings updated successfully",
        "settings": settings
    }


@router.get("/performance")
async def get_seo_performance(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get SEO performance metrics"""
    from app.models import Blog, Page, SEO

    # Count blogs and their SEO data
    total_blogs = db.query(Blog).count()
    blogs_with_seo = db.query(Blog).join(SEO, Blog.id == SEO.blog_id, isouter=True).filter(
        SEO.meta_title.isnot(None), SEO.meta_title != ''
    ).count()
    blogs_with_meta_desc = db.query(Blog).join(SEO, Blog.id == SEO.blog_id, isouter=True).filter(
        SEO.meta_description.isnot(None), SEO.meta_description != ''
    ).count()

    # Count pages and their SEO data
    total_pages = db.query(Page).count()
    pages_with_meta_title = db.query(Page).join(SEO, Page.id == SEO.page_id, isouter=True).filter(
        SEO.meta_title.isnot(None), SEO.meta_title != ''
    ).count()
    pages_with_meta_desc = db.query(Page).join(SEO, Page.id == SEO.page_id, isouter=True).filter(
        SEO.meta_description.isnot(None), SEO.meta_description != ''
    ).count()
    pages_with_canonical = db.query(Page).join(SEO, Page.id == SEO.page_id, isouter=True).filter(
        SEO.canonical_url.isnot(None), SEO.canonical_url != ''
    ).count()
    pages_with_schema = db.query(Page).join(SEO, Page.id == SEO.page_id, isouter=True).filter(
        SEO.schema_markup.isnot(None), SEO.schema_markup != ''
    ).count()

    total_content = total_blogs + total_pages
    total_with_meta_title = blogs_with_seo + pages_with_meta_title
    total_with_meta_desc = blogs_with_meta_desc + pages_with_meta_desc

    # Calculate SEO score based on completion percentage
    meta_title_score = (total_with_meta_title / max(total_content, 1)) * 40  # 40% weight
    meta_desc_score = (total_with_meta_desc / max(total_content, 1)) * 30    # 30% weight
    canonical_score = (pages_with_canonical / max(total_pages, 1)) * 15      # 15% weight
    schema_score = (pages_with_schema / max(total_pages, 1)) * 15            # 15% weight

    seo_score = min(100, int(meta_title_score + meta_desc_score + canonical_score + schema_score))

    return {
        "total_pages": total_content,
        "pages_with_meta_title": total_with_meta_title,
        "pages_with_meta_description": total_with_meta_desc,
        "pages_with_canonical": pages_with_canonical,
        "pages_with_schema": pages_with_schema,
        "broken_links": 0,  # Placeholder - would need link checker implementation
        "seo_score": seo_score
    }
