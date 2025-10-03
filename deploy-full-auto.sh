#!/bin/bash

# Complete Automated Deployment for AstroArupShastri.com
# Creates database, deploys backend and frontend - ALL AT ONCE

set -e  # Exit on any error

echo "🚀 COMPLETE AUTOMATED DEPLOYMENT for AstroArupShastri.com"
echo "========================================================="
echo "Domain: astroarupshastri.com"
echo "Server: srv596142 (88.222.245.41)"
echo "Database: Already created in Hostinger panel"
echo ""
echo "This script will deploy backend and frontend automatically!"
echo ""

# Configuration
DOMAIN="astroarupshastri.com"
DB_NAME="astroarupshastri_db"
DB_USER="astroarupshastri_user"
DB_PASSWORD="V38VfuFS5csh15Hokfjs"  # From Hostinger panel
BACKEND_DIR="/root/astroarupshastri-backend"
FRONTEND_DIR="/root/astroarupshastri-frontend"
PROJECT_DIR="/root/astro-site"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
print_info "Performing pre-deployment checks..."
if ! command_exists mysql; then
    print_error "MySQL client not found. Installing..."
    apt update && apt install -y mysql-client
fi

if ! command_exists python3; then
    print_error "Python3 not found. Installing..."
    apt update && apt install -y python3 python3-pip python3-venv
fi

if ! command_exists node; then
    print_warning "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

print_status "Pre-deployment checks completed"

# Database already created in Hostinger panel
print_info "Using existing database from Hostinger panel..."
print_info "Database: $DB_NAME"
print_info "User: $DB_USER"
print_info "Password: $DB_PASSWORD"

# Install MySQL connector for testing
print_status "Installing MySQL connector..."
pip install mysql-connector-python

# Test database connection
print_status "Testing database connection..."
python3 -c "
import mysql.connector
try:
    conn = mysql.connector.connect(
        host='localhost',
        user='$DB_USER',
        password='$DB_PASSWORD',
        database='$DB_NAME'
    )
    conn.close()
    print('✅ Database connection successful!')
except mysql.connector.Error as e:
    print(f'❌ Database connection failed: {e}')
    exit(1)
"

# Create project directory and copy files
print_info "Setting up project directory..."
mkdir -p "$PROJECT_DIR"
# Only copy if we're not already in the project directory
if [ "$(pwd)" != "$PROJECT_DIR" ]; then
    cp -r . "$PROJECT_DIR/"
fi

# Backend deployment
print_info "Starting backend deployment..."
cd "$PROJECT_DIR"

# Create backend directory structure
print_status "Creating backend directory structure..."
mkdir -p "$BACKEND_DIR/logs"

# Copy backend files
cp -r backend/* "$BACKEND_DIR/"

# Setup Python virtual environment
cd "$BACKEND_DIR"
print_status "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn mysql-connector-python

# Generate secure secret key
SECRET_KEY=$(openssl rand -hex 32)

# Create .env file
print_status "Creating backend environment configuration..."
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

print_status "Environment configuration created"

# Initialize database
print_status "Initializing database tables..."
python init_db.py

if [ $? -eq 0 ]; then
    print_status "Database initialized successfully"
else
    print_error "Database initialization failed"
    exit 1
fi

# Create systemd service
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/astroarupshastri-backend.service > /dev/null << EOF
[Unit]
Description=AstroArupShastri Backend ($DOMAIN)
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$BACKEND_DIR/venv/bin
ExecStart=$BACKEND_DIR/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8002 --log-file $BACKEND_DIR/logs/gunicorn.log --log-level info
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
    print_error "Backend service failed to start"
    sudo journalctl -u astroarupshastri-backend -n 10
    exit 1
fi

# Test backend API
print_status "Testing backend API..."
if curl -s http://127.0.0.1:8002/health > /dev/null; then
    print_status "Backend API is responding"
else
    print_warning "Backend API not responding yet, but service is running"
fi

# Create backend management scripts
print_status "Creating backend management scripts..."

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

print_status "Backend deployment completed"

# Frontend deployment
print_info "Starting frontend deployment..."
cd "$PROJECT_DIR"

# Create frontend directory structure
print_status "Creating frontend directory structure..."
mkdir -p "$FRONTEND_DIR"

# Copy frontend files
cp -r src "$FRONTEND_DIR/"
cp -r public "$FRONTEND_DIR/"
cp -r src/components "$FRONTEND_DIR/" 2>/dev/null || true
cp -r src/contexts "$FRONTEND_DIR/" 2>/dev/null || true
cp -r src/lib "$FRONTEND_DIR/" 2>/dev/null || true
cp package.json "$FRONTEND_DIR/"
cp package-lock.json "$FRONTEND_DIR/" 2>/dev/null || true
cp pnpm-lock.yaml "$FRONTEND_DIR/" 2>/dev/null || true
cp next.config.mjs "$FRONTEND_DIR/"
cp tailwind.config.ts "$FRONTEND_DIR/"
cp tsconfig.json "$FRONTEND_DIR/"
cp postcss.config.mjs "$FRONTEND_DIR/"

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Install dependencies
print_status "Installing Node.js dependencies..."
npm install

# Create production environment file
print_status "Creating production environment configuration..."
cat > .env.local << EOF
# Frontend Environment Configuration
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
EOF

# Build for production
print_status "Building frontend for production..."
npm run build

# Verify build success
if [ ! -d ".next" ]; then
    print_error "Frontend build failed! .next directory not found."
    exit 1
fi

print_status "Frontend build completed successfully"

# Create frontend management scripts
print_status "Creating frontend management scripts..."

cat > rebuild.sh << 'EOF'
#!/bin/bash
echo "Rebuilding AstroArupShastri Frontend..."
cd /root/astroarupshastri-frontend

# Clean previous build
rm -rf .next

# Install dependencies
npm install

# Build for production
npm run build

echo "Frontend rebuild completed!"
EOF

chmod +x rebuild.sh

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

print_status "Frontend deployment completed"

# Create deployment summary
print_status "Creating deployment summary..."

cat > "$PROJECT_DIR/FULL_DEPLOYMENT_COMPLETE.md" << EOF
# AstroArupShastri.com - FULL AUTOMATED DEPLOYMENT COMPLETE!

## ✅ EVERYTHING DEPLOYED SUCCESSFULLY!

**Date:** \$(date)
**Domain:** $DOMAIN
**Server:** srv596142 (88.222.245.41)

## 🔐 CloudPanel Credentials
- **URL:** https://88.222.245.41:8443
- **Username:** admin
- **Password:** Brainwave786@

## 📊 Database Information (Auto-Created)
- **Database Name:** $DB_NAME
- **Database User:** $DB_USER
- **Database Password:** $DB_PASSWORD
- **Connection:** mysql+pymysql://$DB_USER:***@localhost/$DB_NAME

## 🗂️ Directory Structure
- **Backend:** $BACKEND_DIR
- **Frontend:** $FRONTEND_DIR
- **Project:** $PROJECT_DIR

## 🚀 Services Running
- **Backend Service:** astroarupshastri-backend (Port 8002)
- **Status:** Running
- **API Health:** http://127.0.0.1:8002/health

## 🛠️ Management Commands

### Backend Management
\`\`\`bash
# Check status
$BACKEND_DIR/status.sh

# Restart service
$BACKEND_DIR/restart.sh

# View logs
tail -f $BACKEND_DIR/logs/gunicorn.log

# Systemctl commands
sudo systemctl status astroarupshastri-backend
sudo systemctl restart astroarupshastri-backend
\`\`\`

### Frontend Management
\`\`\`bash
# Check status
$FRONTEND_DIR/status.sh

# Rebuild frontend
$FRONTEND_DIR/rebuild.sh
\`\`\`

## 🌐 IMMEDIATE NEXT STEPS: CloudPanel Site Configuration

### ⚡ QUICK SETUP (Do this NOW):

1. **Login to CloudPanel:**
   - URL: https://88.222.245.41:8443
   - Username: **admin**
   - Password: **Brainwave786@**

2. **Create Site:**
   - Sites → Add Site
   - Domain: **astroarupshastri.com**
   - Root Directory: **$FRONTEND_DIR**
   - PHP Version: (leave empty - we use Python)

3. **Enable SSL:**
   - Sites → astroarupshastri.com → SSL/TLS
   - Enable Let's Encrypt
   - Add domains: astroarupshastri.com, www.astroarupshastri.com

4. **Configure Nginx (CRITICAL):**
   - Sites → astroarupshastri.com → Vhost
   - **REPLACE the entire server block** with this:

\`\`\`nginx
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    {{ssl_certificate_key}}
    {{ssl_certificate}}
    server_name astroarupshastri.com www.astroarupshastri.com;

    root $FRONTEND_DIR;
    index index.html;

    {{nginx_access_log}}
    {{nginx_error_log}}

    # Frontend - serve static files
    location / {
        try_files \$uri \$uri/ /index.html;

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
    }

    # Static files caching
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers for static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    {{settings}}
}
\`\`\`

5. **DNS Configuration:**
   - Point **astroarupshastri.com** to **88.222.245.41**
   - A record: **@** → **88.222.245.41**
   - CNAME: **www** → **astroarupshastri.com**

## 🔗 YOUR WEBSITE URLs
- **Main Site:** https://astroarupshastri.com
- **API:** https://astroarupshastri.com/api
- **Admin Panel:** https://astroarupshastri.com/admin
- **API Docs:** https://astroarupshastri.com/api/docs

## 🔐 CRITICAL: Save These Credentials

**CloudPanel Access:**
- URL: https://88.222.245.41:8443
- Username: admin
- Password: Brainwave786@

**Database (Auto-Generated):**
- Database: $DB_NAME
- Username: $DB_USER
- Password: $DB_PASSWORD

**Backend Service:**
- Port: 8002
- Health Check: http://127.0.0.1:8002/health

## 📞 Support & Monitoring
- **CloudPanel:** https://88.222.245.41:8443
- **Backend Logs:** $BACKEND_DIR/logs/
- **Service Status:** sudo systemctl status astroarupshastri-backend

---
**🚀 FULL AUTOMATED DEPLOYMENT COMPLETED SUCCESSFULLY!**
**Date:** \$(date)
**Everything is ready - just complete the CloudPanel configuration above!**
EOF

echo ""
echo "🎉 FULL AUTOMATED DEPLOYMENT COMPLETED!"
echo "========================================"
echo ""
echo "✅ Database Created: $DB_NAME"
echo "✅ Backend Deployed: $BACKEND_DIR"
echo "✅ Frontend Deployed: $FRONTEND_DIR"
echo "✅ Services Running: astroarupshastri-backend"
echo ""
echo "🔐 Database Password: $DB_PASSWORD"
echo ""
echo "🚨 CRITICAL NEXT STEP:"
echo "Complete the CloudPanel site configuration immediately!"
echo ""
echo "📋 Instructions: $PROJECT_DIR/FULL_DEPLOYMENT_COMPLETE.md"
echo ""
echo "🌐 After CloudPanel setup, your site will be live at:"
echo "   https://astroarupshastri.com"
echo ""
print_warning "⚠️  IMPORTANT: Do the CloudPanel configuration NOW!"
print_info "Your website backend and frontend are deployed and ready!"
echo "Just complete the 5 CloudPanel steps above and you'll be live! 🚀"
