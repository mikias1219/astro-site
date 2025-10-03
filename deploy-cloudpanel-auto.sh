#!/bin/bash

# CloudPanel Auto Deployment Script for AstroArupShastri.com
# Deploys backend and frontend (database must be created in CloudPanel first)

set -e  # Exit on any error

echo "🚀 CloudPanel Auto Deployment for AstroArupShastri.com"
echo "===================================================="
echo "Domain: astroarupshastri.com"
echo "Server: srv596142 (88.222.245.41)"
echo "Panel Credentials: admin / Brainwave786@"
echo ""

# Configuration
DOMAIN="astroarupshastri.com"
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

# Database setup instructions
print_warning "IMPORTANT: Create Database in CloudPanel First!"
echo ""
echo "🔐 Login to CloudPanel: https://88.222.245.41:8443"
echo "   Username: admin"
echo "   Password: Brainwave786@"
echo ""
echo "📊 Go to Databases → Add Database"
echo "   Database Name: astroarupshastri_db"
echo "   Database User: astroarupshastri_user"
echo "   Password: Choose a strong password (remember it!)"
echo "   Host: localhost"
echo ""
read -p "Have you created the database in CloudPanel? (y/N): " DB_CREATED

if [[ ! $DB_CREATED =~ ^[Yy]$ ]]; then
    print_warning "Please create the database in CloudPanel first, then run this script again."
    echo ""
    echo "CloudPanel Steps:"
    echo "1. Login: https://88.222.245.41:8443"
    echo "2. Username: admin"
    echo "3. Password: Brainwave786@"
    echo "4. Databases → Add Database"
    echo "5. Fill in the details above"
    echo ""
    exit 1
fi

# Get database credentials
print_info "Enter database credentials from CloudPanel:"
read -p "Database Name [astroarupshastri_db]: " DB_NAME
DB_NAME=${DB_NAME:-astroarupshastri_db}
read -p "Database User [astroarupshastri_user]: " DB_USER
DB_USER=${DB_USER:-astroarupshastri_user}
read -s -p "Database Password: " DB_PASSWORD
echo ""

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
cp -r . "$PROJECT_DIR/"

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
cp -r components "$FRONTEND_DIR/"
cp -r contexts "$FRONTEND_DIR/"
cp -r lib "$FRONTEND_DIR/"
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

cat > "$PROJECT_DIR/CLOUDPANEL_DEPLOYMENT_COMPLETE.md" << EOF
# AstroArupShastri.com - CloudPanel Deployment Complete!

## ✅ Deployment Completed Successfully!

**Date:** \$(date)
**Domain:** $DOMAIN
**Server:** srv596142 (88.222.245.41)

## 🔐 CloudPanel Credentials
- **URL:** https://88.222.245.41:8443
- **Username:** admin
- **Password:** Brainwave786@

## 📊 Database Information
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

## 🌐 NEXT STEPS: Complete CloudPanel Configuration

### 1. Create Site in CloudPanel
1. Login to CloudPanel: https://88.222.245.41:8443
2. Go to **Sites** → **Add Site**
3. Configure:
   - **Domain:** $DOMAIN
   - **Root Directory:** $FRONTEND_DIR
   - **PHP Version:** Not needed (Python backend)

### 2. Enable SSL
1. Go to **Sites** → **$DOMAIN** → **SSL/TLS**
2. Enable **Let's Encrypt**
3. Add domains: **$DOMAIN** and **www.$DOMAIN**

### 3. Configure Nginx Vhost
Replace the server block in **Sites** → **$DOMAIN** → **Vhost** with:

\`\`\`nginx
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    {{ssl_certificate_key}}
    {{ssl_certificate}}
    server_name $DOMAIN www.$DOMAIN;

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

### 4. DNS Configuration
Point your domain DNS to: **88.222.245.41**
- A record: **@** → **88.222.245.41**
- CNAME record: **www** → **$DOMAIN**

## 🔗 Final URLs
- **Website:** https://$DOMAIN
- **API:** https://$DOMAIN/api
- **Admin:** https://$DOMAIN/admin
- **API Docs:** https://$DOMAIN/api/docs

## 🔐 Important Credentials
Keep these credentials safe:

**CloudPanel:**
- URL: https://88.222.245.41:8443
- Username: admin
- Password: Brainwave786@

**Database:**
- Host: localhost
- Database: $DB_NAME
- Username: $DB_USER
- Password: $DB_PASSWORD

**Backend:**
- API URL: http://127.0.0.1:8002
- Health Check: http://127.0.0.1:8002/health

## 📞 Support
- **CloudPanel:** https://88.222.245.41:8443
- **Backend Logs:** $BACKEND_DIR/logs/
- **Deployment Summary:** $PROJECT_DIR/CLOUDPANEL_DEPLOYMENT_COMPLETE.md

---
**Deployment completed on:** \$(date)
**Panel Credentials:** admin / Brainwave786@
EOF

echo ""
echo "🎉 CLOUDPANEL DEPLOYMENT SUCCESSFUL!"
echo "====================================="
echo ""
echo "📊 Database Connected:"
echo "   Name: $DB_NAME"
echo "   User: $DB_USER"
echo "   Password: $DB_PASSWORD"
echo ""
echo "📁 Directories Created:"
echo "   Backend: $BACKEND_DIR"
echo "   Frontend: $FRONTEND_DIR"
echo ""
echo "🚀 Services Running:"
echo "   Backend: astroarupshastri-backend (Port 8002)"
echo "   Status: ✅ Running"
echo ""
echo "🔐 CloudPanel Credentials:"
echo "   URL: https://88.222.245.41:8443"
echo "   Username: admin"
echo "   Password: Brainwave786@"
echo ""
echo "📋 Next Steps:"
echo "1. Complete CloudPanel site configuration (see CLOUDPANEL_DEPLOYMENT_COMPLETE.md)"
echo "2. Point DNS to 88.222.245.41"
echo "3. Test the website at https://$DOMAIN"
echo ""
echo "📖 Full documentation: $PROJECT_DIR/CLOUDPANEL_DEPLOYMENT_COMPLETE.md"
echo ""
print_warning "IMPORTANT: Complete the CloudPanel configuration steps above!"
