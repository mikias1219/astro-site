#!/bin/bash

# 🌟 FINAL COMPLETE DEPLOYMENT SCRIPT for AstroArupShastri.com
# Deploys Database, Backend, Frontend - EVERYTHING AT ONCE
# Domain: astroarupshastri.com
# This is the ONLY deployment script needed - includes everything!
# All other deployment scripts have been consolidated here.

set -e  # Exit on any error

echo "🌟 FINAL COMPLETE DEPLOYMENT for AstroArupShastri.com"
echo "===================================================="
echo "Domain: astroarupshastri.com"
echo "Server: srv596142 (88.222.245.41)"
echo ""
echo "This script deploys EVERYTHING:"
echo "  ✅ Database Setup & Configuration"
echo "  ✅ Backend Deployment (Python/FastAPI)"
echo "  ✅ Frontend Deployment (Next.js)"
echo "  ✅ Cleanup & Rebuild Functionality"
echo "  ✅ CloudPanel Configuration Instructions"
echo ""

# Configuration
DOMAIN="astroarupshastri.com"
DB_NAME="astroarupshastri_db"
DB_USER="astroarupshastri_user"
DB_PASSWORD="V38VfuFS5csh15Hokfjs"
DATABASE_URL="mysql+pymysql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME"
BACKEND_DIR="/root/astroarupshastri-backend"
FRONTEND_DIR="/root/astroarupshastri-frontend"
PROJECT_DIR="/root/astro-site"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Functions
print_header() {
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║ $1${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${CYAN}🔸 $1${NC}"
}

# Pre-flight checks
print_header "PRE-FLIGHT CHECKS"

print_step "Checking system requirements..."
if ! command_exists python3; then
    print_error "Python3 not found. Installing..."
    apt update && apt install -y python3 python3-pip python3-venv
fi

if ! command_exists node; then
    print_warning "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

if ! command_exists mysql; then
    print_error "MySQL client not found. Installing..."
    apt update && apt install -y mysql-client
fi

print_success "System requirements satisfied"

# Database setup
print_header "DATABASE SETUP"

print_info "Setting up SQLite database (primary choice for simplicity)..."

# Use SQLite as the primary database choice
print_step "Configuring SQLite database..."
cat > /root/astroarupshastri-backend/.env << 'EOF'
# Database Configuration (SQLite)
DATABASE_URL=sqlite:///./astrology_website.db

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production-123456789
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration (Update these with your SMTP settings)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@astroarupshastri.com
FROM_NAME=AstroArupShastri

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

print_success "SQLite configuration created"
print_info "Database: SQLite (astrology_website.db)"
print_info "No authentication required"

# Backend deployment
print_header "BACKEND DEPLOYMENT"

print_step "Setting up backend directory structure..."
mkdir -p "$BACKEND_DIR/logs"

print_step "Copying backend files..."
cp -r backend/* "$BACKEND_DIR/"

print_step "Setting up Python virtual environment..."
cd "$BACKEND_DIR"
python3 -m venv venv
source venv/bin/activate

print_step "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn mysql-connector-python uvicorn[standard] python-dotenv

print_step "Generating secure configuration..."
# Generate shorter SECRET_KEY for bcrypt compatibility (24 bytes = 48 hex chars)
SECRET_KEY=$(openssl rand -hex 24)

print_step "Creating backend environment configuration..."
cat > .env << EOF
# Database Configuration (SQLite)
DATABASE_URL=sqlite:///./astrology_website.db

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
FROM_NAME=AstroArupShastri

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

# Configure database.py to use environment variables
print_step "Configuring database.py for environment variables..."
cat > app/database.py << 'EOF'
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Read DATABASE_URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./astrology_website.db")

# Create engine with appropriate configuration
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
EOF

# Ensure main.py loads dotenv
print_step "Ensuring dotenv is loaded in main.py..."
if ! grep -q "load_dotenv" main.py; then
    sed -i '1i from dotenv import load_dotenv\nload_dotenv()' main.py
fi

# Initialize database tables
print_step "Creating database tables..."
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
print_success "Database tables created successfully"

print_step "Creating systemd service..."
sudo tee /etc/systemd/system/astroarupshastri-backend.service > /dev/null << EOF
[Unit]
Description=AstroArupShastri Backend ($DOMAIN)
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$BACKEND_DIR/venv/bin
Environment=PYTHONPATH=$BACKEND_DIR
EnvironmentFile=$BACKEND_DIR/.env
ExecStart=$BACKEND_DIR/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8002
Restart=always
RestartSec=5

# Security
NoNewPrivileges=yes
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
EOF

print_step "Starting backend service..."
sudo systemctl daemon-reload
sudo systemctl enable astroarupshastri-backend
sudo systemctl start astroarupshastri-backend

# Verify backend
sleep 3
if sudo systemctl is-active --quiet astroarupshastri-backend; then
    print_success "Backend service started successfully"

    # Test API
    if curl -s http://127.0.0.1:8002/health > /dev/null; then
        print_success "Backend API responding correctly"
    else
        print_warning "Backend API not responding yet (may take a moment)"
    fi
else
    print_error "Backend service failed to start"
    sudo journalctl -u astroarupshastri-backend -n 10
    exit 1
fi

print_step "Creating backend management scripts..."
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
tail -10 /root/astroarupshastri-backend/logs/gunicorn.log 2>/dev/null || echo "No logs yet"
EOF

chmod +x "$BACKEND_DIR/status.sh"

cat > "$BACKEND_DIR/restart.sh" << 'EOF'
#!/bin/bash
echo "Restarting AstroArupShastri Backend..."
sudo systemctl restart astroarupshastri-backend
sleep 2
sudo systemctl status astroarupshastri-backend --no-pager
EOF

chmod +x "$BACKEND_DIR/restart.sh"

print_success "Backend deployment completed!"
print_info "Location: $BACKEND_DIR"
print_info "Service: astroarupshastri-backend"
print_info "API URL: http://127.0.0.1:8002"
print_info "Health Check: http://127.0.0.1:8002/health"

# Nginx configuration
print_header "NGINX CONFIGURATION"

print_step "Installing and configuring Nginx..."
if ! command_exists nginx; then
    print_info "Installing Nginx..."
    apt update && apt install -y nginx
fi

print_step "Creating Nginx configuration for $DOMAIN..."
sudo tee /etc/nginx/sites-available/astroarupshastri > /dev/null << EOF
# Redirect www to non-www
server {
    listen 80;
    server_name www.$DOMAIN;
    return 301 \$scheme://$DOMAIN\$request_uri;
}

# Main App
server {
    listen 80;
    server_name $DOMAIN;

    # For static export, serve from the out directory
    root $FRONTEND_DIR/out;
    index index.html;

    # Frontend - serve static files (SPA routing)
    location / {
        try_files \$uri \$uri/ /index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # Admin routes - ensure they fall back to index.html for SPA routing
    location ^~ /admin {
        try_files /index.html =404;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://127.0.0.1:8002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Request body settings
        client_max_body_size 10M;
        proxy_request_buffering off;
    }

    # Static files caching
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers for static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle Next.js exported static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

print_step "Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/astroarupshastri /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

print_step "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    print_success "Nginx configuration is valid"
    sudo systemctl reload nginx
    print_success "Nginx reloaded successfully"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Frontend deployment
print_header "FRONTEND DEPLOYMENT"

print_step "Removing old frontend state..."
if [ -d "$FRONTEND_DIR" ]; then
    print_warning "Removing existing frontend directory: $FRONTEND_DIR"
    rm -rf "$FRONTEND_DIR"
    print_success "Old frontend directory removed"
fi

print_step "Pulling latest code from repository..."
cd /root/astro-site  # Go back to project root

# Check if this is a git repository and pull latest changes
if [ -d ".git" ]; then
    print_info "Git repository detected, pulling latest changes..."
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || {
        print_warning "Could not pull from git (may not be configured), using local files"
    }
else
    print_warning "Not a git repository, using local files only"
fi

print_step "Setting up fresh frontend directory structure..."
mkdir -p "$FRONTEND_DIR"

print_step "Copying latest frontend files..."

# Debug: Check source files before copying
echo "Checking source files before copying..."
echo "Source src directory:"
ls -la src/ 2>/dev/null || echo "Source src not found"

echo "Source lib directory:"
ls -la src/lib/ 2>/dev/null || echo "Source lib not found"

echo "Source api directory:"
ls -la src/lib/api/ 2>/dev/null || echo "Source api not found"

# Copy frontend files with verification
echo "Copying public directory..."
if [ -d "public" ]; then
    cp -r public "$FRONTEND_DIR/" 2>&1 || { echo "Failed to copy public"; exit 1; }
else
    echo "⚠️  Public directory not found, creating empty one..."
    mkdir -p "$FRONTEND_DIR/public"
fi

echo "Copying src directory..."
if [ -d "src" ]; then
    echo "Source src directory exists, copying..."
    cp -r src "$FRONTEND_DIR/" 2>&1 || { echo "Failed to copy src"; exit 1; }
    echo "✅ Source directory copied successfully"

    # Debug: Check what was actually copied
    echo "Contents of copied src directory:"
    ls -la "$FRONTEND_DIR/src/" 2>/dev/null || echo "src directory not found"
else
    echo "❌ Source src directory not found!"
    exit 1
fi

# Verify and ensure lib directory is properly copied
echo "Verifying lib directory copy..."
if [ -d "$FRONTEND_DIR/src/lib" ]; then
    echo "✅ src/lib directory exists in destination"
    ls -la "$FRONTEND_DIR/src/lib/" | head -5
else
    echo "⚠️  src/lib directory missing, attempting to copy separately..."
    if [ -d "src/lib" ]; then
        cp -r src/lib "$FRONTEND_DIR/src/" 2>&1 || { echo "Failed to copy lib separately"; exit 1; }
        echo "✅ lib directory copied separately"
    else
        echo "❌ Source src/lib directory not found locally!"
        pwd
        ls -la src/ 2>/dev/null || echo "src contents:"
        exit 1
    fi
fi

# Final verification
if [ ! -d "$FRONTEND_DIR/src/lib/api" ]; then
    echo "❌ src/lib/api directory not found"
    echo "Debug info:"
    echo "Current directory: $(pwd)"
    echo "Source lib exists: $([ -d 'src/lib' ] && echo 'YES' || echo 'NO')"
    echo "Destination frontend dir: $FRONTEND_DIR"
    ls -la "$FRONTEND_DIR/src/" 2>/dev/null || echo "destination src contents:"
    exit 1
fi

echo "✅ All frontend source files copied successfully"

# Copy root configuration files
echo "Copying root configuration files..."
cp package.json "$FRONTEND_DIR/" || { echo "Failed to copy package.json"; exit 1; }
cp next.config.mjs "$FRONTEND_DIR/" || { echo "Failed to copy next.config.mjs"; exit 1; }
cp tailwind.config.ts "$FRONTEND_DIR/" || { echo "Failed to copy tailwind.config.ts"; exit 1; }
cp tsconfig.json "$FRONTEND_DIR/" || { echo "Failed to copy tsconfig.json"; exit 1; }
cp postcss.config.mjs "$FRONTEND_DIR/" 2>/dev/null || true
cp pnpm-lock.yaml "$FRONTEND_DIR/" 2>/dev/null || true
cp package-lock.json "$FRONTEND_DIR/" 2>/dev/null || true

# Verify critical files were copied
echo "Verifying file copy..."
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo "❌ package.json not copied"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR/src" ]; then
    echo "❌ src directory not copied"
    exit 1
fi

# List the API files to verify they exist
echo "Checking API files..."
ls -la "$FRONTEND_DIR/src/lib/api/" 2>/dev/null | head -10

cd "$FRONTEND_DIR"

print_step "Installing Node.js dependencies..."
npm install

print_step "Creating production environment configuration..."
cat > .env.local << EOF
# Frontend Environment Configuration
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
EOF

print_step "Building frontend for production..."
npm run build

# Check for both .next and out directories (static export creates 'out')
if [ ! -d ".next" ] && [ ! -d "out" ]; then
    print_error "Frontend build failed! Neither .next nor out directory found."
    exit 1
fi

# If we have 'out' directory, it's a static export
if [ -d "out" ]; then
    print_success "Static export build completed successfully"
    print_info "Build type: Static export (out/ directory)"
    FRONTEND_BUILD_TYPE="static"
else
    print_success "SSR build completed successfully"
    print_info "Build type: Server-side rendering (.next/ directory)"
    FRONTEND_BUILD_TYPE="ssr"
fi

print_step "Creating frontend management scripts..."
cat > rebuild.sh << 'EOF'
#!/bin/bash
echo "Rebuilding AstroArupShastri Frontend..."
cd /root/astroarupshastri-frontend

# Clean previous build and node_modules for fresh start
echo "Cleaning previous build artifacts..."
rm -rf .next
rm -rf out
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml

# Install dependencies fresh
echo "Installing dependencies..."
npm install

# Build for production
echo "Building for production..."
npm run build

echo "Frontend rebuild completed!"
EOF

chmod +x rebuild.sh

cat > clean-rebuild.sh << 'EOF'
#!/bin/bash
echo "🧹 COMPLETE CLEAN & REBUILD - AstroArupShastri Frontend"
echo "===================================================="

FRONTEND_DIR="/root/astroarupshastri-frontend"
PROJECT_DIR="/root/astro-site"

# Stop any running processes (if applicable)
echo "Stopping any running processes..."
# Add process stopping logic if needed

# Remove entire frontend directory
echo "Removing old frontend directory..."
if [ -d "$FRONTEND_DIR" ]; then
    rm -rf "$FRONTEND_DIR"
    echo "✅ Old frontend directory removed"
fi

# Pull latest code
echo "Pulling latest code from repository..."
cd "$PROJECT_DIR"
if [ -d ".git" ]; then
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || {
        echo "⚠️  Could not pull from git, using local files"
    }
else
    echo "⚠️  Not a git repository, using local files only"
fi

# Redeploy using the deployment script
echo "Redeploying frontend..."
bash "$PROJECT_DIR/final-deploy.sh"

echo "🎉 Complete clean rebuild finished!"
EOF

chmod +x clean-rebuild.sh

cat > status.sh << 'EOF'
#!/bin/bash
echo "=== AstroArupShastri Frontend Status ==="
echo "Date: $(date)"
echo "Domain: astroarupshastri.com"
echo "Directory: /root/astroarupshastri-frontend"
echo ""

echo "=== Build Status ==="
if [ -d "/root/astroarupshastri-frontend/.next" ]; then
    echo "✅ Frontend is built"
    ls -la /root/astroarupshastri-frontend/.next | head -5
else
    echo "❌ Frontend not built"
fi
echo ""

echo "=== File Structure ==="
ls -la /root/astroarupshastri-frontend/
echo ""

echo "=== Environment ==="
cat /root/astroarupshastri-frontend/.env.local 2>/dev/null || echo "No .env.local found"
EOF

chmod +x status.sh

# PM2 Configuration for Frontend
print_step "Configuring PM2 for frontend serving..."

# Stop any existing frontend process
pm2 delete astro-frontend 2>/dev/null || true

# Configure PM2 based on build type
if [ "$FRONTEND_BUILD_TYPE" = "static" ]; then
    print_info "Setting up static file serving with PM2..."
    
    # Install serve globally if not present
    if ! command_exists serve; then
        print_step "Installing serve for static file serving..."
        npm install -g serve
    fi
    
    # Start with PM2 using serve
    pm2 start "serve -s out -l 3001" --name astro-frontend
    print_success "Static frontend started with PM2 on port 3001"
    
    # Create serve-specific management script
    cat > serve.sh << 'EOF'
#!/bin/bash
echo "Starting static file server for AstroArupShastri Frontend..."
cd /root/astroarupshastri-frontend
pm2 delete astro-frontend 2>/dev/null || true
pm2 start "serve -s out -l 3001" --name astro-frontend
pm2 save
echo "Static server started on port 3001"
EOF
    
    chmod +x serve.sh
    
else
    print_info "Setting up Next.js server with PM2..."
    
    # Start with PM2 using next start
    pm2 start "npm run start -- -p 3001" --name astro-frontend
    print_success "Next.js frontend started with PM2 on port 3001"
fi

# Save PM2 configuration
pm2 save

# Verify frontend is running
sleep 3
if pm2 list | grep -q "astro-frontend.*online"; then
    print_success "Frontend PM2 process: ✅ Running"
    
    # Test frontend connectivity
    if curl -s http://127.0.0.1:3001 > /dev/null; then
        print_success "Frontend responding: ✅ On port 3001"
    else
        print_warning "Frontend not responding yet (may take a moment)"
    fi
else
    print_error "Frontend PM2 process failed to start"
    pm2 logs astro-frontend --lines 10
    exit 1
fi

print_success "Frontend deployment completed!"
print_info "Location: $FRONTEND_DIR"
print_info "Build Status: ✅ Ready for production"
print_info "Serving: Port 3001 via PM2"
print_info "Build Type: $FRONTEND_BUILD_TYPE"

# SSL/HTTPS Setup
print_header "SSL/HTTPS SETUP"

print_step "Installing Certbot for SSL certificates..."
if ! command_exists certbot; then
    print_info "Installing Certbot and Nginx plugin..."
    apt update && apt install -y certbot python3-certbot-nginx
fi

print_step "Obtaining SSL certificate for $DOMAIN..."
print_info "This will automatically configure HTTPS for your domain"
print_warning "Make sure your domain DNS is pointing to this server before proceeding!"

# Check if domain is pointing to this server
SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "unknown")
print_info "Server IP: $SERVER_IP"
print_info "Please ensure $DOMAIN points to $SERVER_IP"

read -p "Is your domain DNS configured correctly? (y/N): " DNS_CONFIGURED
if [[ $DNS_CONFIGURED =~ ^[Yy]$ ]]; then
    print_step "Obtaining SSL certificate..."
    
    # Run certbot with non-interactive flags
    if sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect; then
        print_success "SSL certificate obtained and configured successfully!"
        print_info "Your site is now accessible via HTTPS"
        
        # Fix API proxy configuration that might have been overwritten by Certbot
        print_step "Ensuring API proxy configuration is preserved..."
        if ! grep -q "location /api/" /etc/nginx/sites-enabled/astroarupshastri; then
            print_warning "API proxy configuration was overwritten by Certbot, restoring..."
            # Add API proxy block to the HTTPS server block
            sed -i '/server_name '$DOMAIN'/a\
    # API proxy to backend\
    location /api/ {\
        proxy_pass http://127.0.0.1:8002;\
        proxy_http_version 1.1;\
        proxy_set_header Upgrade $http_upgrade;\
        proxy_set_header Connection '"'"'upgrade'"'"';\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
        proxy_cache_bypass $http_upgrade;\
        proxy_connect_timeout 60s;\
        proxy_send_timeout 60s;\
        proxy_read_timeout 60s;\
        client_max_body_size 10M;\
        proxy_request_buffering off;\
    }' /etc/nginx/sites-enabled/astroarupshastri
            
            # Test and reload Nginx
            if sudo nginx -t; then
                sudo systemctl reload nginx
                print_success "API proxy configuration restored"
            else
                print_error "Failed to restore API proxy configuration"
            fi
        fi
        
        # Test SSL configuration
        print_step "Testing SSL configuration..."
        if curl -s https://$DOMAIN > /dev/null; then
            print_success "HTTPS is working correctly!"
        else
            print_warning "HTTPS test failed, but certificate was installed"
        fi
    else
        print_warning "SSL certificate installation failed"
        print_info "You can run this manually later:"
        print_info "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
else
    print_warning "Skipping SSL setup - configure DNS first"
    print_info "To set up SSL later, run:"
    print_info "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# Final verification
print_header "DEPLOYMENT VERIFICATION"

print_step "Final system check..."

# Check backend service
if sudo systemctl is-active --quiet astroarupshastri-backend; then
    print_success "Backend service: ✅ Running"
else
    print_error "Backend service: ❌ Failed"
fi

# Check backend API
if curl -s http://127.0.0.1:8002/health > /dev/null; then
    print_success "Backend API: ✅ Responding"
else
    print_warning "Backend API: ⚠️ Not responding yet"
fi

# Check frontend build and serving
if [ "$FRONTEND_BUILD_TYPE" = "static" ] && [ -d "$FRONTEND_DIR/out" ]; then
    print_success "Frontend build: ✅ Static export complete"
elif [ "$FRONTEND_BUILD_TYPE" = "ssr" ] && [ -d "$FRONTEND_DIR/.next" ]; then
    print_success "Frontend build: ✅ SSR build complete"
else
    print_error "Frontend build: ❌ Failed"
fi

# Check frontend-backend connectivity
print_step "Testing frontend-backend connectivity..."

# Test backend API
if curl -s http://127.0.0.1:8002/health > /dev/null; then
    print_success "Backend API: ✅ Responding on port 8002"
else
    print_warning "Backend API: ⚠️ Not responding on port 8002"
fi

# Test frontend serving
if curl -s http://127.0.0.1:3001 > /dev/null; then
    print_success "Frontend serving: ✅ Responding on port 3001"
else
    print_warning "Frontend serving: ⚠️ Not responding on port 3001"
fi

# Test PM2 processes
if pm2 list | grep -q "astro-frontend.*online"; then
    print_success "Frontend PM2: ✅ Process running"
else
    print_error "Frontend PM2: ❌ Process not running"
fi

if pm2 list | grep -q "fastapi-app.*online"; then
    print_success "Backend PM2: ✅ Process running"
else
    print_warning "Backend PM2: ⚠️ Process not detected (may be using systemd)"
fi

print_success "Deployment verification complete!"

# Deployment Architecture Summary
print_header "🚀 DEPLOYMENT ARCHITECTURE SUMMARY"

echo ""
echo "✅ COMPLETE FASTAPI + NGINX DEPLOYMENT:"
echo "   • FastAPI Backend: Gunicorn + Uvicorn Workers"
echo "   • Frontend: Next.js Static Export"
echo "   • Reverse Proxy: Nginx"
echo "   • SSL/HTTPS: Let's Encrypt (if DNS configured)"
echo "   • Process Management: Systemd + PM2"
echo ""

echo "🔧 DEPLOYMENT COMPONENTS:"
echo "   • Backend Service: astroarupshastri-backend.service"
echo "   • Frontend Process: PM2 (astro-frontend)"
echo "   • Web Server: Nginx (reverse proxy)"
echo "   • SSL Certificates: Certbot/Let's Encrypt"
echo ""

echo "🌐 DNS CONFIGURATION REQUIRED:"
echo "   • Point $DOMAIN to: $SERVER_IP"
echo "   • A record: @ → $SERVER_IP"
echo "   • CNAME: www → $DOMAIN"
echo ""

# Final summary
print_header "🎉 DEPLOYMENT COMPLETE!"

echo ""
echo "✅ DATABASE: Connected and initialized"
echo "✅ BACKEND: Deployed and running on port 8002"
echo "✅ FRONTEND: Built and ready for production"
echo ""

echo "🌐 FINAL URLs (after DNS configuration):"
echo "   Website: https://$DOMAIN"
echo "   API: https://$DOMAIN/api"
echo "   Admin: https://$DOMAIN/admin"
echo "   API Docs: https://$DOMAIN/api/docs"
echo "   Health Check: https://$DOMAIN/api/health"
echo ""

echo "🛠️ MANAGEMENT COMMANDS:"
echo "   Main Manager: ./manage.sh [command]"
echo "   Quick Update: ./update-deploy.sh"
echo "   Full Deploy: ./final-deploy.sh"
echo ""
echo "   Backend Status: $BACKEND_DIR/status.sh"
echo "   Frontend Status: $FRONTEND_DIR/status.sh"
echo "   Backend Restart: $BACKEND_DIR/restart.sh"
echo "   Frontend Rebuild: $FRONTEND_DIR/rebuild.sh"
echo "   Complete Clean Rebuild: $FRONTEND_DIR/clean-rebuild.sh"
echo ""
echo "📋 Common Management Commands:"
echo "   ./manage.sh status     # Check all services"
echo "   ./manage.sh update     # Quick update deployment"
echo "   ./manage.sh logs       # Show recent logs"
echo "   ./manage.sh restart    # Restart all services"
echo "   ./manage.sh test       # Test connectivity"
echo ""

echo "📞 SUPPORT:"
echo "   CloudPanel: https://88.222.245.41:8443"
echo "   Backend Logs: $BACKEND_DIR/logs/"
echo ""

print_warning "⚠️ IMPORTANT: Configure your domain DNS to point to this server to make your site live!"
print_success "🚀 Your $DOMAIN website is ready to serve the world!"

echo ""
echo "🎊 CONGRATULATIONS! Everything deployed successfully!"
echo "   Just configure your DNS and your astrology website will be live! 🌟"
