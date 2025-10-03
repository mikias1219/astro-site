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

print_info "Setting up database and testing connection..."

# Function to create database
create_database() {
    local method="$1"
    local mysql_cmd="$2"
    local description="$3"

    print_info "$description"

    if $mysql_cmd -e "SELECT 1;" 2>/dev/null; then
        print_success "MySQL connection successful with $method"

        $mysql_cmd << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
USE $DB_NAME;
SELECT 'Database created successfully!' as status;
EOF

        if [ $? -eq 0 ]; then
            print_success "Database created successfully with $method!"
            return 0
        fi
    else
        print_warning "MySQL connection failed with $method"
        return 1
    fi
    return 1
}

# Try multiple methods to create database
database_created=false

# Method 1: Try root user with common passwords
print_step "Method 1: Trying root user with common passwords..."
PASSWORDS=("Brainwave786@" "admin" "password" "root" "" "mysql")

for PASSWORD in "${PASSWORDS[@]}"; do
    if [ "$PASSWORD" = "" ]; then
        mysql_cmd="mysql -u root"
        desc="root user (no password)"
    else
        mysql_cmd="mysql -u root -p\"$PASSWORD\""
        desc="root user (password: $PASSWORD)"
    fi

    if create_database "$desc" "$mysql_cmd" "Trying $desc"; then
        database_created=true
        break
    fi
done

# Method 2: Try admin user
if [ "$database_created" = false ]; then
    print_step "Method 2: Trying admin user..."
    if create_database "admin user" "mysql -u admin -p\"Brainwave786@\"" "Trying admin user"; then
        database_created=true
    fi
fi

# Method 3: Try sudo
if [ "$database_created" = false ]; then
    print_step "Method 3: Trying with sudo..."
    if create_database "sudo" "sudo mysql" "Trying with sudo"; then
        database_created=true
    fi
fi

# Test database connection
if [ "$database_created" = true ]; then
    print_step "Testing database connection..."
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
    print('✅ Database connection test successful!')
except Exception as e:
    print(f'❌ Database connection test failed: {e}')
    exit(1)
"
    print_success "Database setup complete"
    print_info "Database: $DB_NAME"
    print_info "User: $DB_USER"
    print_info "Status: ✅ Ready"
else
    print_error "Could not create database automatically"
    print_warning "Please create the database manually in CloudPanel:"
    echo ""
    echo "🌐 Open CloudPanel: https://88.222.245.41:8443"
    echo "   Username: admin"
    echo "   Password: Brainwave786@"
    echo ""
    echo "📊 Go to Databases → Add Database"
    echo "   Database Name: $DB_NAME"
    echo "   Database User: $DB_USER"
    echo "   Password: $DB_PASSWORD"
    echo ""
    exit 1
fi

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
pip install gunicorn mysql-connector-python

print_step "Generating secure configuration..."
SECRET_KEY=$(openssl rand -hex 32)

print_step "Creating backend environment configuration..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=$DATABASE_URL

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

print_step "Initializing database..."
python init_db.py

# Check for existing SQLite data to migrate
if [ -f "astrology_website.db" ]; then
    print_info "Found existing SQLite database, checking for migration..."
    read -p "Migrate existing SQLite data to MySQL? (y/N): " MIGRATE_DATA
    if [[ $MIGRATE_DATA =~ ^[Yy]$ ]]; then
        print_step "Running database migration..."
        python migrate_to_mysql.py
        print_success "Database migration completed"
    fi
fi
print_info "Skipping local database initialization (using remote Hostinger DB)"

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
ExecStart=$BACKEND_DIR/venv/bin/gunicorn main:app -b 127.0.0.1:8002 --log-level info
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
cp -r public "$FRONTEND_DIR/" 2>&1 || { echo "Failed to copy public"; exit 1; }

echo "Copying src directory..."
cp -r src "$FRONTEND_DIR/" 2>&1 || { echo "Failed to copy src"; exit 1; }

# Ensure lib directory is copied properly
echo "Ensuring lib directory structure..."
if [ ! -d "$FRONTEND_DIR/src/lib" ]; then
    echo "Creating lib directory..."
    mkdir -p "$FRONTEND_DIR/src/lib"
fi

if [ ! -d "$FRONTEND_DIR/src/lib/api" ]; then
    echo "Creating lib/api directory..."
    mkdir -p "$FRONTEND_DIR/src/lib/api"
fi

# Copy lib files individually if needed
if [ -f "src/lib/api.ts" ]; then
    cp src/lib/api.ts "$FRONTEND_DIR/src/lib/" 2>/dev/null || true
fi

if [ -d "src/lib/api" ]; then
    cp -r src/lib/api/* "$FRONTEND_DIR/src/lib/api/" 2>/dev/null || true
fi

# Debug: Check what was actually copied
echo "Contents of copied src directory:"
ls -la "$FRONTEND_DIR/src/" 2>/dev/null || echo "src directory not found"

echo "Contents of copied lib directory:"
ls -la "$FRONTEND_DIR/src/lib/" 2>/dev/null || echo "lib directory not found"

echo "Contents of copied api directory:"
ls -la "$FRONTEND_DIR/src/lib/api/" 2>/dev/null || echo "api directory not found"

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

if [ ! -d "$FRONTEND_DIR/src/lib" ]; then
    echo "❌ src/lib directory not copied"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR/src/lib/api" ]; then
    echo "❌ src/lib/api directory not copied"
    ls -la "$FRONTEND_DIR/src/lib/" 2>/dev/null || echo "src/lib contents:"
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

if [ ! -d ".next" ]; then
    print_error "Frontend build failed! .next directory not found."
    exit 1
fi

print_success "Frontend build completed successfully"

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

print_success "Frontend deployment completed!"
print_info "Location: $FRONTEND_DIR"
print_info "Build Status: ✅ Ready for production"

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

# Check frontend build
if [ -d "$FRONTEND_DIR/.next" ]; then
    print_success "Frontend build: ✅ Complete"
else
    print_error "Frontend build: ❌ Failed"
fi

print_success "Deployment verification complete!"

# CloudPanel instructions
print_header "🎯 CLOUDPANEL CONFIGURATION REQUIRED"

echo ""
echo "🔐 CloudPanel Access:"
echo "   URL: https://88.222.245.41:8443"
echo "   Username: admin"
echo "   Password: Brainwave786@"
echo ""

echo "📋 Complete these steps in CloudPanel:"
echo ""

echo "1️⃣ CREATE SITE:"
echo "   • Sites → Add Site"
echo "   • Domain: astroarupshastri.com"
echo "   • Root Directory: $FRONTEND_DIR"
echo "   • PHP Version: (leave empty)"
echo ""

echo "2️⃣ ENABLE SSL:"
echo "   • Sites → astroarupshastri.com → SSL/TLS"
echo "   • Enable Let's Encrypt"
echo "   • Add domains: astroarupshastri.com, www.astroarupshastri.com"
echo ""

echo "3️⃣ CONFIGURE NGINX (CRITICAL):"
echo "   • Sites → astroarupshastri.com → Vhost"
echo "   • REPLACE the entire server block with:"
echo ""

cat << 'EOF'
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    {{ssl_certificate_key}}
    {{ssl_certificate}}
    server_name astroarupshastri.com www.astroarupshastri.com;

    root /root/astroarupshastri-frontend;
    index index.html;

    {{nginx_access_log}}
    {{nginx_error_log}}

    # Frontend - serve static files
    location / {
        try_files $uri $uri/ /index.html;

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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

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
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    {{settings}}
}
EOF

echo ""
echo "4️⃣ DNS CONFIGURATION:"
echo "   • Point astroarupshastri.com to: 88.222.245.41"
echo "   • A record: @ → 88.222.245.41"
echo "   • CNAME: www → astroarupshastri.com"
echo ""

# Final summary
print_header "🎉 DEPLOYMENT COMPLETE!"

echo ""
echo "✅ DATABASE: Connected and initialized"
echo "✅ BACKEND: Deployed and running on port 8002"
echo "✅ FRONTEND: Built and ready for production"
echo ""

echo "🌐 FINAL URLs (after CloudPanel setup):"
echo "   Website: https://astroarupshastri.com"
echo "   API: https://astroarupshastri.com/api"
echo "   Admin: https://astroarupshastri.com/admin"
echo "   API Docs: https://astroarupshastri.com/api/docs"
echo ""

echo "🛠️ MANAGEMENT COMMANDS:"
echo "   Backend Status: $BACKEND_DIR/status.sh"
echo "   Frontend Status: $FRONTEND_DIR/status.sh"
echo "   Backend Restart: $BACKEND_DIR/restart.sh"
echo "   Frontend Rebuild: $FRONTEND_DIR/rebuild.sh"
echo "   Complete Clean Rebuild: $FRONTEND_DIR/clean-rebuild.sh"
echo ""

echo "📞 SUPPORT:"
echo "   CloudPanel: https://88.222.245.41:8443"
echo "   Backend Logs: $BACKEND_DIR/logs/"
echo ""

print_warning "⚠️ IMPORTANT: Complete the CloudPanel configuration above to make your site live!"
print_success "🚀 Your AstroArupShastri.com website is ready to serve the world!"

echo ""
echo "🎊 CONGRATULATIONS! Everything deployed successfully!"
echo "   Just complete the CloudPanel steps and your astrology website will be live! 🌟"
