#!/bin/bash

# CloudPanel Backend Deployment Script for Astrology Website
# Deploys to: astroarupshastri-backend

set -e  # Exit on any error

echo "🚀 Deploying Astrology Website Backend"
echo "======================================"
echo "Domain: astroarupshastri.com"
echo "Backend Folder: astroarupshastri-backend"
echo "Server: srv596142 (88.222.245.41)"
echo ""

# Configuration
DOMAIN="astroarupshastri.com"
BACKEND_DIR="/root/astroarupshastri-backend"
VENV_DIR="$BACKEND_DIR/venv"
LOG_DIR="$BACKEND_DIR/logs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
echo "🔍 Performing pre-deployment checks..."
if ! command_exists python3; then
    print_error "Python3 is not installed. Please install Python3 first."
    exit 1
fi

print_status "Pre-deployment checks completed"

# Create backend directory structure
print_status "Creating backend directory structure..."
mkdir -p "$BACKEND_DIR"
mkdir -p "$LOG_DIR"

# Copy backend files
print_status "Copying backend files..."
cp -r backend/* "$BACKEND_DIR/"

# Setup Python virtual environment
print_status "Setting up Python virtual environment..."
cd "$BACKEND_DIR"
if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
fi
source "$VENV_DIR/bin/activate"

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# Database setup instructions
print_warning "Database Setup Required:"
echo ""
echo "Please create a MySQL database in CloudPanel:"
echo "1. Login to CloudPanel: https://88.222.245.41:8443"
echo "2. Go to Databases → Add Database"
echo "3. Database Name: astroarupshastri_db"
echo "4. Database User: astroarupshastri_user"
echo "5. Set a strong password"
echo "6. Host: localhost"
echo ""
read -p "Have you created the database in CloudPanel? (y/N): " DB_CREATED

if [[ ! $DB_CREATED =~ ^[Yy]$ ]]; then
    print_warning "Please create the database first, then run this script again."
    exit 1
fi

# Get database credentials
read -p "Enter MySQL database name [astroarupshastri_db]: " DB_NAME
DB_NAME=${DB_NAME:-astroarupshastri_db}
read -p "Enter MySQL username [astroarupshastri_user]: " DB_USER
DB_USER=${DB_USER:-astroarupshastri_user}
read -s -p "Enter MySQL password: " DB_PASSWORD
echo ""

# Generate secure secret key
SECRET_KEY=$(openssl rand -hex 32)

# Create .env file
print_status "Creating environment configuration..."
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
FROM_EMAIL=noreply@$DOMAIN
FROM_NAME=Astrology Website

# Application Configuration
DEBUG=False
HOST=127.0.0.1
PORT=8002

# CORS Configuration
ALLOWED_ORIGINS=https://$DOMAIN,http://$DOMAIN,https://www.$DOMAIN,http://www.$DOMAIN

# Frontend Configuration
FRONTEND_URL=https://$DOMAIN

# Email Verification Configuration
EMAIL_VERIFICATION_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1
EOF

print_status "Environment configuration created"

# Initialize database
print_status "Initializing database..."
python init_db.py

# Optional: Run database migration if user has existing data
read -p "Do you have existing SQLite data to migrate? (y/N): " MIGRATE_DATA
if [[ $MIGRATE_DATA =~ ^[Yy]$ ]]; then
    print_status "Running database migration..."
    python migrate_to_mysql.py
fi

# Create systemd service
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/astroarupshastri-backend.service > /dev/null << EOF
[Unit]
Description=Astrology Website Backend (astroarupshastri.com)
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$VENV_DIR/bin
ExecStart=$VENV_DIR/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8002 --log-file $LOG_DIR/gunicorn.log --log-level info
Restart=always
RestartSec=5

# Security
NoNewPrivileges=yes
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
print_status "Starting backend service..."
sudo systemctl daemon-reload
sudo systemctl enable astroarupshastri-backend
sudo systemctl start astroarupshastri-backend

# Verify service is running
sleep 3
if sudo systemctl is-active --quiet astroarupshastri-backend; then
    print_status "Backend service started successfully"
else
    print_error "Backend service failed to start. Check logs:"
    sudo journalctl -u astroarupshastri-backend -n 20
    exit 1
fi

# Create backend management scripts
print_status "Creating backend management scripts..."

# Create status check script
cat > "$BACKEND_DIR/status.sh" << 'EOF'
#!/bin/bash
echo "=== AstroArupShastri Backend Status ==="
echo "Date: $(date)"
echo "Domain: astroarupshastri.com"
echo "Port: 8002"
echo ""

echo "=== Service Status ==="
sudo systemctl status astroarupshastri-backend --no-pager -l
echo ""

echo "=== Backend Health Check ==="
curl -s http://127.0.0.1:8002/health || echo "Health check failed"
echo ""

echo "=== Recent Logs ==="
tail -10 /root/astroarupshastri-backend/logs/gunicorn.log
EOF

chmod +x "$BACKEND_DIR/status.sh"

# Create restart script
cat > "$BACKEND_DIR/restart.sh" << 'EOF'
#!/bin/bash
echo "Restarting AstroArupShastri Backend..."
sudo systemctl restart astroarupshastri-backend
sleep 2
sudo systemctl status astroarupshastri-backend --no-pager
EOF

chmod +x "$BACKEND_DIR/restart.sh"

print_status "Backend deployment completed successfully!"
echo ""
echo "🎉 Backend Summary:"
echo "   ✅ Python backend deployed to: $BACKEND_DIR"
echo "   ✅ Service running on port 8002"
echo "   ✅ Database initialized"
echo "   ✅ Environment configured for $DOMAIN"
echo ""
echo "🔗 Backend URLs:"
echo "   API: http://127.0.0.1:8002"
echo "   Health: http://127.0.0.1:8002/health"
echo "   Docs: http://127.0.0.1:8002/docs"
echo ""
echo "🛠️  Backend Management:"
echo "   Status: $BACKEND_DIR/status.sh"
echo "   Restart: $BACKEND_DIR/restart.sh"
echo "   Logs: tail -f $LOG_DIR/gunicorn.log"
echo ""
echo "⚠️  Next: Run the frontend deployment script"
echo "   ./deploy-frontend.sh"
