#!/bin/bash

# Production Deployment Script for Hostinger VPS
# This script deploys the astrology website backend to production

set -e  # Exit on any error

echo "🚀 Starting Production Deployment for Astrology Website"
echo "=================================================="

# Configuration - Update these variables
DOMAIN="yourdomain.com"  # Replace with your actual domain
PROJECT_DIR="/home/$(whoami)/astrology-site"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR"
VENV_DIR="$BACKEND_DIR/venv"
LOG_DIR="$PROJECT_DIR/logs"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p "$LOG_DIR"
mkdir -p "$BACKEND_DIR"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system requirements
echo "🔍 Checking system requirements..."
if ! command_exists python3; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

if ! command_exists mysql; then
    echo "❌ MySQL client is not installed. Please install MySQL client first."
    exit 1
fi

# Install system dependencies
echo "📦 Installing system dependencies..."
sudo apt update
sudo apt install -y python3-pip python3-venv mysql-server nginx certbot python3-certbot-nginx

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv "$VENV_DIR"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Install Python dependencies
echo "📥 Installing Python dependencies..."
cd "$BACKEND_DIR"
pip install --upgrade pip
pip install -r requirements.txt

# Database setup
echo "🗄️ Setting up MySQL database..."
read -p "Enter MySQL root password: " MYSQL_ROOT_PASSWORD
read -p "Enter database name for astrology website: " DB_NAME
read -p "Enter MySQL username for the application: " DB_USER
read -s -p "Enter MySQL password for the application: " DB_PASSWORD
echo ""

# Create database and user
sudo mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

# Create .env file
echo "⚙️ Creating environment configuration..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=mysql+pymysql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME

# JWT Configuration
SECRET_KEY=$(openssl rand -hex 32)
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
HOST=0.0.0.0
PORT=8000

# CORS Configuration
ALLOWED_ORIGINS=https://$DOMAIN,http://$DOMAIN

# Frontend Configuration
FRONTEND_URL=https://$DOMAIN

# Email Verification Configuration
EMAIL_VERIFICATION_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1
EOF

# Initialize database
echo "🗄️ Initializing database..."
python init_db.py

# Optional: Run database migration if you have existing SQLite data
read -p "Do you have existing SQLite data to migrate? (y/N): " MIGRATE_DATA
if [[ $MIGRATE_DATA =~ ^[Yy]$ ]]; then
    echo "🔄 Running database migration..."
    python migrate_to_mysql.py
fi

# Install Gunicorn for production
echo "🚀 Installing Gunicorn..."
pip install gunicorn

# Create Gunicorn service file
echo "📝 Creating systemd service..."
sudo tee /etc/systemd/system/astrology-backend.service > /dev/null << EOF
[Unit]
Description=Astrology Website Backend
After=network.target

[Service]
User=$(whoami)
Group=$(whoami)
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$VENV_DIR/bin
ExecStart=$VENV_DIR/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --log-file $LOG_DIR/gunicorn.log --log-level info
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
echo "🔄 Starting backend service..."
sudo systemctl daemon-reload
sudo systemctl enable astrology-backend
sudo systemctl start astrology-backend

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/astrology-backend > /dev/null << EOF
server {
    listen 80;
    server_name api.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Static files (if any)
    location /static/ {
        alias $BACKEND_DIR/static/;
    }

    # Logs
    access_log $LOG_DIR/nginx_access.log;
    error_log $LOG_DIR/nginx_error.log;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/astrology-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Configure SSL with Let's Encrypt (optional)
read -p "Do you want to configure SSL with Let's Encrypt? (y/N): " CONFIG_SSL
if [[ $CONFIG_SSL =~ ^[Yy]$ ]]; then
    echo "🔒 Configuring SSL certificate..."
    sudo certbot --nginx -d api.$DOMAIN
fi

# Build and deploy frontend (Next.js)
echo "🎨 Building frontend..."
cd "$FRONTEND_DIR"
npm install
npm run build

# Configure frontend Nginx site
sudo tee /etc/nginx/sites-available/astrology-frontend > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    root $FRONTEND_DIR/out;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Logs
    access_log $LOG_DIR/frontend_access.log;
    error_log $LOG_DIR/frontend_error.log;
}
EOF

# Enable frontend site
sudo ln -sf /etc/nginx/sites-available/astrology-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Configure SSL for frontend (optional)
if [[ $CONFIG_SSL =~ ^[Yy]$ ]]; then
    echo "🔒 Configuring SSL certificate for frontend..."
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
fi

# Create backup script
echo "💾 Creating backup script..."
cat > "$PROJECT_DIR/backup.sh" << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/$(whoami)/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# Database backup
mysqldump -u astrology_user -p astrology_website > "$BACKUP_DIR/db_backup_$DATE.sql"

# File backup
tar -czf "$BACKUP_DIR/files_backup_$DATE.tar.gz" -C /home/$(whoami) astrology-site

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x "$PROJECT_DIR/backup.sh"

# Create monitoring script
echo "📊 Creating monitoring script..."
cat > "$PROJECT_DIR/monitor.sh" << 'EOF'
#!/bin/bash
echo "=== System Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""

echo "=== Services Status ==="
sudo systemctl status astrology-backend --no-pager -l
echo ""
sudo systemctl status nginx --no-pager -l
echo ""

echo "=== Disk Usage ==="
df -h
echo ""

echo "=== Memory Usage ==="
free -h
echo ""

echo "=== Backend Logs (last 20 lines) ==="
tail -20 /home/$(whoami)/astrology-site/logs/gunicorn.log
EOF

chmod +x "$PROJECT_DIR/monitor.sh"

echo "✅ Deployment completed successfully!"
echo ""
echo "🌟 Your astrology website is now live at:"
echo "   Frontend: https://$DOMAIN"
echo "   Backend API: https://api.$DOMAIN"
echo ""
echo "🔧 Useful commands:"
echo "   Check backend status: sudo systemctl status astrology-backend"
echo "   Check nginx status: sudo systemctl status nginx"
echo "   View backend logs: tail -f $LOG_DIR/gunicorn.log"
echo "   Restart backend: sudo systemctl restart astrology-backend"
echo "   Backup data: $PROJECT_DIR/backup.sh"
echo "   Monitor system: $PROJECT_DIR/monitor.sh"
echo ""
echo "⚠️  Important next steps:"
echo "   1. Update your DNS records to point to this server"
echo "   2. Configure email settings in $BACKEND_DIR/.env"
echo "   3. Test the website functionality"
echo "   4. Set up regular backups (consider cron job for backup.sh)"
echo ""
echo "📞 Support: Check logs in $LOG_DIR for any issues"
