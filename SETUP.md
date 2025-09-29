# Astrology Website Setup Guide

This guide will help you set up and run the astrology website with both frontend and backend components.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8 or higher
- Git

### 1. Backend Setup

The backend is a FastAPI application that provides the API for the astrology website.

#### Start the Backend Server

```bash
# Make the script executable (if not already done)
chmod +x start-backend.sh

# Start the backend server
./start-backend.sh
```

This script will:
- Create a Python virtual environment
- Install all required dependencies
- Initialize the database with sample data
- Start the FastAPI server on http://localhost:8000

#### Manual Backend Setup (Alternative)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup

The frontend is a Next.js application.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:3000

## 🔑 Admin Access

### Default Admin Credentials
- **Username:** admin
- **Password:** admin123

### Admin URLs
- **Login:** http://localhost:3000/admin/login
- **Register:** http://localhost:3000/admin/register
- **Dashboard:** http://localhost:3000/admin

## 📱 Contact Information

The website includes the following contact numbers:
- **India:** +91 91473 27266
- **Bangladesh:** +880 1832294062

## 🛠️ API Documentation

Once the backend is running, you can access:
- **Interactive API Docs:** http://localhost:8000/docs
- **ReDoc Documentation:** http://localhost:8000/redoc

## 📁 Project Structure

```
astro-site/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routers/        # API route handlers
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── auth.py         # Authentication utilities
│   │   └── database.py     # Database configuration
│   ├── main.py             # FastAPI application
│   ├── init_db.py          # Database initialization
│   └── requirements.txt    # Python dependencies
├── src/                    # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   └── lib/               # Utility functions
├── public/                # Static assets
└── start-backend.sh       # Backend startup script
```

## 🔧 Features

### Frontend Features
- Responsive design with Tailwind CSS
- Admin dashboard with authentication
- Contact forms with phone number integration
- Service pages and calculators
- Blog and podcast sections
- Horoscope and panchang displays

### Backend Features
- JWT-based authentication
- Role-based access control (Admin, Editor, User)
- RESTful API endpoints
- Database models for all entities
- Admin dashboard statistics
- Booking management system
- Content management (blogs, podcasts, horoscopes)

## 🗄️ Database

The application uses SQLite for development. The database is automatically created and initialized with sample data when you run `init_db.py`.

### Sample Data Includes:
- Admin user (admin/admin123)
- Test user (testuser/test123)
- Sample services
- Sample bookings

## 🔐 Authentication

The application uses JWT tokens for authentication. Admin users can:
- Login to the admin dashboard
- View statistics and analytics
- Manage bookings and users
- Access all admin features

## 📞 Support

For technical support or questions:
- **India:** +91 91473 27266
- **Bangladesh:** +880 1832294062

## 🚀 Deployment

### Backend Deployment
1. Set up a production database (PostgreSQL recommended)
2. Update database configuration in `backend/app/database.py`
3. Set environment variables for production
4. Deploy using a WSGI server like Gunicorn

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `out` directory to a static hosting service
3. Update API URLs in `src/lib/api.ts` for production

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Ensure Python 3.8+ is installed
   - Check if port 8000 is available
   - Verify all dependencies are installed

2. **Frontend won't start:**
   - Ensure Node.js 18+ is installed
   - Run `npm install` to install dependencies
   - Check if port 3000 is available

3. **Database errors:**
   - Delete `backend/astrology_website.db` and run `init_db.py` again
   - Check file permissions

4. **API connection issues:**
   - Ensure backend is running on http://localhost:8000
   - Check CORS settings in `backend/main.py`

## 📝 License

This project is proprietary software. All rights reserved.

