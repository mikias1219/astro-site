#!/bin/bash

# Fix Database Connection for AstroArupShastri Backend
# Run this on your server after creating database in CloudPanel

echo "🔧 Fixing Database Connection for AstroArupShastri"
echo "================================================"

BACKEND_DIR="/root/astroarupshastri-backend"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found: $BACKEND_DIR"
    echo "Please run ./deploy-backend.sh first"
    exit 1
fi

cd "$BACKEND_DIR"

# Get database credentials
echo "Enter your CloudPanel database credentials:"
read -p "Database Name [astroarupshastri_db]: " DB_NAME
DB_NAME=${DB_NAME:-astroarupshastri_db}
read -p "Database User [astroarupshastri_user]: " DB_USER
DB_USER=${DB_USER:-astroarupshastri_user}
read -s -p "Database Password: " DB_PASSWORD
echo ""

# Backup existing .env file
if [ -f ".env" ]; then
    cp .env .env.backup
    echo "✅ Backed up existing .env file to .env.backup"
fi

# Generate secure secret key
SECRET_KEY=$(openssl rand -hex 32)

# Create new .env file with correct database credentials
cat > .env << EOF
# Database Configuration
DATABASE_URL=mysql+pymysql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME

# JWT Configuration
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration (Update these with your SMTP settings)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@astroarupshastri.com
FROM_NAME=Astrology Website

# Application Configuration
DEBUG=False
HOST=127.0.0.1
PORT=8002

# CORS Configuration
ALLOWED_ORIGINS=https://astroarupshastri.com,http://astroarupshastri.com,https://www.astroarupshastri.com,http://www.astroarupshastri.com

# Frontend Configuration
FRONTEND_URL=https://astroarupshastri.com

# Email Verification Configuration
EMAIL_VERIFICATION_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1
EOF

echo "✅ Updated .env file with database credentials"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   URL: mysql+pymysql://$DB_USER:***@localhost/$DB_NAME"

# Activate virtual environment
echo "🐍 Activating virtual environment..."
source venv/bin/activate

# Test database connection
echo "🧪 Testing database connection..."
python -c "
import os
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

DATABASE_URL = os.getenv('DATABASE_URL')
try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute('SELECT 1')
        print('✅ Database connection successful!')
except SQLAlchemyError as e:
    print(f'❌ Database connection failed: {e}')
    exit(1)
"

if [ $? -eq 0 ]; then
    echo "✅ Database connection test passed!"
else
    echo "❌ Database connection test failed!"
    echo "Please check your database credentials and ensure the database exists in CloudPanel."
    exit 1
fi

# Initialize database
echo "🗄️ Initializing database tables..."
python init_db.py

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully!"
else
    echo "❌ Database initialization failed!"
    exit 1
fi

# Restart backend service
echo "🔄 Restarting backend service..."
sudo systemctl restart astroarupshastri-backend

# Verify service is running
sleep 3
if sudo systemctl is-active --quiet astroarupshastri-backend; then
    echo "✅ Backend service restarted successfully!"
else
    echo "❌ Backend service failed to restart. Check logs:"
    sudo journalctl -u astroarupshastri-backend -n 10
fi

echo ""
echo "🎉 Database fix completed!"
echo "=========================="
echo ""
echo "🧪 Test the backend:"
echo "   curl http://127.0.0.1:8002/health"
echo ""
echo "📊 Check service status:"
echo "   sudo systemctl status astroarupshastri-backend"
echo ""
echo "📝 View logs:"
echo "   tail -f /root/astroarupshastri-backend/logs/gunicorn.log"
