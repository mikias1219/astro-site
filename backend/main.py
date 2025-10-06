"""
FastAPI Backend for Astrology Website
Main application entry point
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
import uvicorn
import os
import sys
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

from app.database import engine, Base, get_db
from app.models import User, Blog, Service
from app.routers import auth, users, pages, blogs, bookings, seo, seo_admin, admin, services, faqs, testimonials, panchang, horoscopes, calculators, kundli, matching, numerology

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🔄 Creating database tables...", file=sys.stderr)
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully", file=sys.stderr)

        # Test database connection
        from app.database import get_db
        db = next(get_db())
        blog_count = db.query(Blog).count()
        print(f"✅ Database connection verified: {blog_count} blogs found", file=sys.stderr)
        db.close()

    except Exception as e:
        print(f"❌ Database initialization failed: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        raise

    yield
    # Shutdown
    print("🛑 Shutting down AstroArupShastri Backend", file=sys.stderr)

# Initialize FastAPI app
app = FastAPI(
    title="Astrology Website API",
    description="Backend API for astrology consultation website",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - configured for production
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,https://astroarupshastri.com,https://www.astroarupshastri.com"  # Default for development and production
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],  # Production-ready origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/admin/users", tags=["User Management"])
app.include_router(pages.router, prefix="/api/pages", tags=["Pages"])
app.include_router(blogs.router, prefix="/api/blogs", tags=["Blogs"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(seo.router, prefix="/api/seo", tags=["SEO"])
app.include_router(seo_admin.router, prefix="/api/admin/seo", tags=["SEO Admin"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(services.router, prefix="/api/services", tags=["Services"])
app.include_router(faqs.router, prefix="/api/faqs", tags=["FAQs"])
app.include_router(testimonials.router, prefix="/api/testimonials", tags=["Testimonials"])
app.include_router(panchang.router, prefix="/api/panchang", tags=["Panchang"])
app.include_router(horoscopes.router, prefix="/api/horoscopes", tags=["Horoscopes"])
app.include_router(calculators.router, prefix="/api/calculators", tags=["Calculators"])
app.include_router(kundli.router, prefix="/api", tags=["Kundli"])
app.include_router(matching.router, prefix="/api", tags=["Matching"])
app.include_router(numerology.router, prefix="/api", tags=["Numerology"])

@app.get("/")
async def root():
    return {"message": "Astrology Website API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/health")
async def api_health_check(db: Session = Depends(get_db)):
    """Detailed health check for API endpoints"""
    try:
        # Test database connection
        blog_count = db.query(Blog).count()
        user_count = db.query(User).count()
        service_count = db.query(Service).count()

        return {
            "status": "healthy",
            "database": {
                "blogs": blog_count,
                "users": user_count,
                "services": service_count,
                "connection": "ok"
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    # Diagnostic logging for production debugging
    import sys
    print("🚀 Starting AstroArupShastri Backend...", file=sys.stderr)
    print(f"Python version: {sys.version}", file=sys.stderr)
    print(f"Working directory: {os.getcwd()}", file=sys.stderr)

    # Test database connection
    try:
        from app.database import get_db
        db = next(get_db())
        from app.models import Blog
        blog_count = db.query(Blog).count()
        print(f"✅ Database connection successful: {blog_count} blogs found", file=sys.stderr)
        db.close()
    except Exception as e:
        print(f"❌ Database connection failed: {e}", file=sys.stderr)
        sys.exit(1)

    print("🎯 Starting uvicorn server...", file=sys.stderr)
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
