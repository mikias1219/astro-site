# Astrology Website Backend API

A comprehensive FastAPI backend system for an astrology consultation website similar to vinaybajrangi.com. This system provides authentication, content management, booking system, SEO features, and admin dashboard APIs.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Editor, User)
- Secure password hashing with bcrypt
- User registration and login endpoints

### 📝 Content Management
- CRUD APIs for pages, blogs, FAQs, and testimonials
- Rich-text/Markdown support for content
- Content publishing workflow
- Image support for blogs and services

### 📅 Booking System
- Complete appointment booking system
- Service management with pricing and duration
- Booking status management (Pending, Confirmed, Completed, Cancelled)
- Email notifications for bookings
- Admin booking management

### 🔍 SEO Features
- Meta tags, titles, and descriptions management
- Open Graph tags support
- Schema markup support
- XML sitemap generation
- Robots.txt generation

### 📊 Admin Dashboard
- Comprehensive analytics and statistics
- User management
- Booking management and reporting
- Content moderation
- Dashboard analytics

### 🗄️ Database
- SQLite for development and testing
- PostgreSQL/MySQL support for production
- SQLAlchemy ORM with proper relationships
- Database migrations support

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication utilities
│   ├── email_service.py     # Email service
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # Authentication routes
│       ├── services.py      # Service management
│       ├── bookings.py      # Booking system
│       ├── pages.py         # Page management
│       ├── blogs.py         # Blog management
│       ├── faqs.py          # FAQ management
│       ├── testimonials.py  # Testimonial management
│       ├── seo.py           # SEO features
│       └── admin.py         # Admin dashboard
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
├── env.example             # Environment variables example
└── README.md               # This file
```

## Installation & Setup

### 1. Clone and Setup Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment example file
cp env.example .env

# Edit .env file with your configuration
# At minimum, change the SECRET_KEY
```

### 3. Database Setup

The system uses SQLite by default for development. For production, configure PostgreSQL or MySQL:

```bash
# For SQLite (default - no additional setup needed)
# Database file will be created automatically

# For PostgreSQL:
# 1. Install PostgreSQL
# 2. Create database: CREATE DATABASE astrology_website;
# 3. Update DATABASE_URL in .env

# For MySQL:
# 1. Install MySQL
# 2. Create database: CREATE DATABASE astrology_website;
# 3. Update DATABASE_URL in .env
```

### 4. Run the Application

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/me` - Update current user

### Services
- `GET /api/services/` - Get all services
- `GET /api/services/{id}` - Get specific service
- `POST /api/services/` - Create service (Admin/Editor)
- `PUT /api/services/{id}` - Update service (Admin/Editor)
- `DELETE /api/services/{id}` - Delete service (Admin/Editor)

### Bookings
- `GET /api/bookings/` - Get all bookings (Admin/Editor)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/{id}` - Get specific booking
- `POST /api/bookings/` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking
- `POST /api/bookings/{id}/confirm` - Confirm booking (Admin/Editor)

### Pages
- `GET /api/pages/` - Get all pages
- `GET /api/pages/{id}` - Get page by ID
- `GET /api/pages/slug/{slug}` - Get page by slug
- `POST /api/pages/` - Create page (Admin/Editor)
- `PUT /api/pages/{id}` - Update page (Admin/Editor)
- `DELETE /api/pages/{id}` - Delete page (Admin/Editor)

### Blogs
- `GET /api/blogs/` - Get all blog posts
- `GET /api/blogs/{id}` - Get blog post by ID
- `GET /api/blogs/slug/{slug}` - Get blog post by slug
- `GET /api/blogs/popular/` - Get popular blog posts
- `POST /api/blogs/` - Create blog post (Admin/Editor)
- `PUT /api/blogs/{id}` - Update blog post (Admin/Editor)
- `DELETE /api/blogs/{id}` - Delete blog post (Admin/Editor)

### FAQs
- `GET /api/faqs/` - Get all FAQs
- `GET /api/faqs/categories` - Get FAQ categories
- `GET /api/faqs/{id}` - Get specific FAQ
- `POST /api/faqs/` - Create FAQ (Admin/Editor)
- `PUT /api/faqs/{id}` - Update FAQ (Admin/Editor)
- `DELETE /api/faqs/{id}` - Delete FAQ (Admin/Editor)

### Testimonials
- `GET /api/testimonials/` - Get all testimonials
- `GET /api/testimonials/{id}` - Get specific testimonial
- `POST /api/testimonials/` - Create testimonial
- `PUT /api/testimonials/{id}` - Update testimonial
- `DELETE /api/testimonials/{id}` - Delete testimonial
- `POST /api/testimonials/{id}/approve` - Approve testimonial (Admin/Editor)
- `POST /api/testimonials/{id}/reject` - Reject testimonial (Admin/Editor)

### SEO
- `GET /api/seo/` - Get all SEO data
- `GET /api/seo/page/{slug}` - Get SEO data for page
- `GET /api/seo/blog/{slug}` - Get SEO data for blog post
- `POST /api/seo/` - Create SEO data (Admin/Editor)
- `PUT /api/seo/{id}` - Update SEO data (Admin/Editor)
- `DELETE /api/seo/{id}` - Delete SEO data (Admin/Editor)
- `GET /api/seo/sitemap.xml` - Get XML sitemap
- `GET /api/seo/robots.txt` - Get robots.txt

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/users/{id}` - Get specific user (Admin only)
- `PUT /api/admin/users/{id}` - Update user role (Admin only)
- `GET /api/admin/bookings/stats` - Get booking statistics
- `GET /api/admin/analytics/page-views` - Get page view analytics
- `GET /api/admin/reports/booking-summary` - Generate booking report

## Database Models

### User
- User authentication and profile information
- Role-based access control (Admin, Editor, User)

### Service
- Astrology services with pricing and duration
- Service types (Consultation, Online Report, etc.)

### Booking
- Appointment booking system
- Customer information and booking details
- Status tracking

### Page
- Static website pages
- Content management with rich text

### Blog
- Blog posts with view tracking
- Publishing workflow

### FAQ
- Frequently asked questions
- Categorization and ordering

### Testimonial
- Customer testimonials
- Approval workflow

### SEO
- Meta tags and SEO optimization
- Linked to pages and blogs

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=sqlite:///./astrology_website.db

# JWT
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@astrologywebsite.com
FROM_NAME=Astrology Website
```

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## Production Deployment

### 1. Environment Setup
- Use PostgreSQL or MySQL for production
- Set strong SECRET_KEY
- Configure proper CORS origins
- Set up email service

### 2. Database Migration
```bash
# Install Alembic for database migrations
pip install alembic

# Initialize migrations
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

### 3. Production Server
```bash
# Using Gunicorn with Uvicorn workers
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Security Considerations

- Change default SECRET_KEY in production
- Use HTTPS in production
- Configure proper CORS origins
- Implement rate limiting
- Use environment variables for sensitive data
- Regular security updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository.
