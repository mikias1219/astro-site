#!/bin/bash

# CloudPanel Deployment Script for Astrology Website
# This script deploys the astrology website to CloudPanel-managed server

set -e  # Exit on any error

echo "🚀 Starting CloudPanel Deployment for Astrology Website"
echo "======================================================"
echo "CloudPanel Server: srv596142 (88.222.245.41)"
echo ""

# Configuration - Update these variables
DOMAIN="yourdomain.com"  # Replace with your actual domain
SITE_USER="astrology"    # CloudPanel site user (change this)
PROJECT_DIR="/home/$SITE_USER/astrology-site"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR"
VENV_DIR="$BACKEND_DIR/venv"
LOG_DIR="$PROJECT_DIR/logs"

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

if ! command_exists node; then
    print_warning "Node.js not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

print_status "Pre-deployment checks completed"

# Create necessary directories
print_status "Creating directories..."
mkdir -p "$LOG_DIR"
mkdir -p "$BACKEND_DIR"

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
echo "3. Database Name: astrology_website"
echo "4. Database User: astrology_user"
echo "5. Set a strong password"
echo "6. Host: localhost"
echo ""
read -p "Have you created the database in CloudPanel? (y/N): " DB_CREATED

if [[ ! $DB_CREATED =~ ^[Yy]$ ]]; then
    print_warning "Please create the database first, then run this script again."
    exit 1
fi

# Get database credentials
read -p "Enter MySQL database name: " DB_NAME
read -p "Enter MySQL username: " DB_USER
read -s -p "Enter MySQL password: " DB_PASSWORD
echo ""
read -p "Enter your domain name: " DOMAIN

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
PORT=8001

# CORS Configuration
ALLOWED_ORIGINS=https://$DOMAIN,http://$DOMAIN

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
sudo tee /etc/systemd/system/astrology-backend.service > /dev/null << EOF
[Unit]
Description=Astrology Website Backend (CloudPanel)
After=network.target

[Service]
User=$SITE_USER
Group=$SITE_USER
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$VENV_DIR/bin
ExecStart=$VENV_DIR/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8001 --log-file $LOG_DIR/gunicorn.log --log-level info
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
sudo systemctl enable astrology-backend
sudo systemctl start astrology-backend

# Verify service is running
sleep 3
if sudo systemctl is-active --quiet astrology-backend; then
    print_status "Backend service started successfully"
else
    print_error "Backend service failed to start. Check logs:"
    sudo journalctl -u astrology-backend -n 20
    exit 1
fi

# Build frontend
print_status "Building frontend..."
cd "$FRONTEND_DIR"
npm install

# Create production environment file
echo "NEXT_PUBLIC_API_URL=https://$DOMAIN/api" > .env.local

# Build for production
npm run build

# Create backup script
print_status "Creating backup script..."
cat > "$PROJECT_DIR/backup.sh" << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/astrology/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# Database backup
mysqldump -h localhost -u astrology_user -p astrology_website > "$BACKUP_DIR/db_backup_$DATE.sql"

# Files backup
tar -czf "$BACKUP_DIR/files_backup_$DATE.tar.gz" -C /home/astrology astrology-site

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x "$PROJECT_DIR/backup.sh"

# Create monitoring script
print_status "Creating monitoring script..."
cat > "$PROJECT_DIR/monitor.sh" << 'EOF'
#!/bin/bash
echo "=== CloudPanel Astrology Website Status ==="
echo "Date: $(date)"
echo "Server: srv596142 (88.222.245.41)"
echo ""

echo "=== Services Status ==="
sudo systemctl status astrology-backend --no-pager -l
echo ""

echo "=== Disk Usage ==="
df -h /home/astrology
echo ""

echo "=== Memory Usage ==="
free -h
echo ""

echo "=== Backend Logs (last 10 lines) ==="
tail -10 /home/astrology/astrology-site/logs/gunicorn.log
echo ""

echo "=== Active Connections ==="
netstat -tlnp | grep :8001 || echo "Backend port 8001 not listening"
EOF

chmod +x "$PROJECT_DIR/monitor.sh"

# CloudPanel configuration instructions
print_status "CloudPanel Configuration Required:"
echo ""
echo "Please complete these steps in CloudPanel (https://88.222.245.41:8443):"
echo ""
echo "1. 🌐 Create Site:"
echo "   - Go to Sites → Add Site"
echo "   - Domain: $DOMAIN"
echo "   - Site User: $SITE_USER"
echo ""
echo "2. 🔒 Enable SSL:"
echo "   - Go to Sites → $DOMAIN → SSL/TLS"
echo "   - Enable Let's Encrypt"
echo "   - Add domains: $DOMAIN and www.$DOMAIN"
echo ""
echo "3. ⚙️ Configure Vhost:"
echo "   - Go to Sites → $DOMAIN → Vhost"
echo "   - Replace the server block with the configuration from CLOUDPANEL_DEPLOYMENT_GUIDE.md"
echo ""
echo "4. 🌐 DNS Configuration:"
echo "   - Point your domain DNS to: 88.222.245.41"
echo "   - Add A record: @ → 88.222.245.41"
echo "   - Add CNAME record: www → $DOMAIN"
echo ""

print_status "Deployment completed successfully!"
echo ""
echo "🎉 Summary:"
echo "   ✅ Python backend deployed and running"
echo "   ✅ Frontend built for production"
echo "   ✅ Database initialized"
echo "   ✅ Backup and monitoring scripts created"
echo ""
echo "🔗 URLs:"
echo "   Frontend: https://$DOMAIN"
echo "   API: https://$DOMAIN/api"
echo "   API Docs: https://$DOMAIN/api/docs"
echo ""
echo "🛠️  Useful Commands:"
echo "   Check status: sudo systemctl status astrology-backend"
echo "   View logs: tail -f $LOG_DIR/gunicorn.log"
echo "   Restart backend: sudo systemctl restart astrology-backend"
echo "   Backup data: $PROJECT_DIR/backup.sh"
echo "   Monitor system: $PROJECT_DIR/monitor.sh"
echo ""
echo "📞 Support:"
echo "   CloudPanel: https://88.222.245.41:8443"
echo "   Logs: $LOG_DIR/"
echo ""
print_warning "Remember to complete the CloudPanel configuration steps above!"
