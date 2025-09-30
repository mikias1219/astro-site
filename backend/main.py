"""
FastAPI Backend for Astrology Website
Main application entry point
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import uvicorn

from app.database import engine, Base
from app.routers import auth, users, pages, blogs, bookings, seo, seo_admin, admin, services, faqs, testimonials, panchang, horoscopes, podcasts, calculators

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

# Initialize FastAPI app
app = FastAPI(
    title="Astrology Website API",
    description="Backend API for astrology consultation website",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
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
app.include_router(podcasts.router, prefix="/api/podcasts", tags=["Podcasts"])
app.include_router(calculators.router, prefix="/api/calculators", tags=["Calculators"])

@app.get("/")
async def root():
    return {"message": "Astrology Website API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
