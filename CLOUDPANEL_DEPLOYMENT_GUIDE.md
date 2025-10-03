# Astrology Website - CloudPanel Deployment Guide

## Overview

This guide provides instructions for deploying the Astrology Website to a CloudPanel-managed server with MySQL database compatibility.

## CloudPanel Server Information

Based on your login details:
- **Server**: srv596142
- **CloudPanel URL**: https://88.222.245.41:8443
- **SSH Access**: Available
- **User**: rabbyhussain725@gmail.com

## Prerequisites

### CloudPanel Setup Requirements
- ✅ CloudPanel access (you have this)
- ✅ Domain name configured in CloudPanel
- ✅ MySQL database created in CloudPanel
- ✅ SSH access to server

### System Information
- **OS**: Ubuntu/Debian (CloudPanel standard)
- **Web Server**: Nginx (managed by CloudPanel)
- **Database**: MySQL/MariaDB (managed by CloudPanel)
- **SSL**: Let's Encrypt (managed by CloudPanel)

## Deployment Steps

### Step 1: Access CloudPanel

1. Go to your CloudPanel URL: https://88.222.245.41:8443
2. Login with your credentials:
   - Email: rabbyhussain725@gmail.com
   - Password: [your password]

### Step 2: Create Database

1. In CloudPanel, go to **Databases** section
2. Click **Add Database**
3. Fill in the details:
   - **Database Name**: `astrology_website`
   - **Database User**: `astrology_user`
   - **Password**: Choose a strong password
   - **Host**: `localhost`
4. Note down the database credentials for later use

### Step 3: Create Site

1. In CloudPanel, go to **Sites** section
2. Click **Add Site**
3. Configure the site:
   - **Domain**: yourdomain.com (replace with your actual domain)
   - **Site User**: Create new user or use existing
   - **PHP Version**: Not needed (we're using Python)
   - **Vhost Template**: Select appropriate template

### Step 4: Upload Project Files

#### Option A: Using CloudPanel File Manager
1. In CloudPanel, go to **Sites** → your site → **File Manager**
2. Upload the entire `astrology-site` project directory

#### Option B: Using SCP/SFTP
```bash
# Connect via SSH (replace with your actual server details)
ssh root@88.222.245.41

# Create project directory
mkdir -p /home/your-site-user/astrology-site
cd /home/your-site-user/astrology-site

# Upload files using scp or rsync
# From your local machine:
scp -r /path/to/local/astrology-site root@88.222.245.41:/home/your-site-user/
```

### Step 5: Backend Setup

#### SSH into Server
```bash
ssh root@88.222.245.41
cd /home/your-site-user/astrology-site/backend
```

#### Setup Python Environment
```bash
# Install Python and pip if not available
apt update
apt install -y python3 python3-pip python3-venv

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

#### Configure Environment Variables
```bash
# Create .env file
nano .env
```

Add the following content (update with your actual values):

```env
# Database Configuration (from CloudPanel database)
DATABASE_URL=mysql+pymysql://astrology_user:your_db_password@localhost/astrology_website

# JWT Configuration
SECRET_KEY=your-super-secret-key-here-change-this-generate-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Astrology Website

# Application Configuration
DEBUG=False
HOST=127.0.0.1
PORT=8001

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,http://yourdomain.com

# Frontend Configuration
FRONTEND_URL=https://yourdomain.com

# Email Verification Configuration
EMAIL_VERIFICATION_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1
```

#### Initialize Database
```bash
# Initialize database tables
python init_db.py
```

#### Optional: Migrate Existing Data
If you have existing SQLite data to migrate:
```bash
python migrate_to_mysql.py
```

### Step 6: Frontend Setup

#### Build Frontend
```bash
cd /home/your-site-user/astrology-site

# Install Node.js dependencies
npm install

# Create production environment file
echo "NEXT_PUBLIC_API_URL=https://yourdomain.com/api" > .env.local

# Build for production
npm run build
```

### Step 7: Configure CloudPanel Site

#### Update Site Configuration

1. In CloudPanel, go to **Sites** → your site
2. Click **SSL/TLS** tab
3. Enable **Let's Encrypt** for SSL certificate
4. Add your domain and www.yourdomain.com

#### Configure Nginx (Vhost)

1. In CloudPanel, go to **Sites** → your site → **Vhost**
2. Modify the Nginx configuration to proxy API requests:

```nginx
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    {{ssl_certificate_key}}
    {{ssl_certificate}}
    server_name yourdomain.com www.yourdomain.com;

    {{root}}

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
        proxy_pass http://127.0.0.1:8001;
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
```

### Step 8: Setup Process Manager

#### Create Systemd Service
```bash
# Create systemd service file
sudo nano /etc/systemd/system/astrology-backend.service
```

Add the following content:

```ini
[Unit]
Description=Astrology Website Backend
After=network.target

[Service]
User=your-site-user
Group=your-site-user
WorkingDirectory=/home/your-site-user/astrology-site/backend
Environment=PATH=/home/your-site-user/astrology-site/backend/venv/bin
ExecStart=/home/your-site-user/astrology-site/backend/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8001 --log-file /home/your-site-user/astrology-site/logs/gunicorn.log --log-level info
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

#### Enable and Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable astrology-backend
sudo systemctl start astrology-backend
```

### Step 9: Configure Domain

1. Point your domain DNS to the server IP: `88.222.245.41`
2. In CloudPanel, ensure the domain is properly configured
3. Wait for DNS propagation (can take up to 24 hours)

### Step 10: Final Testing

#### Test Backend API
```bash
# Test backend health
curl http://127.0.0.1:8001/health

# Test API docs
curl http://127.0.0.1:8001/docs
```

#### Test Frontend
Access your domain in a browser to test the frontend.

## CloudPanel-Specific Deployment Script

Create a CloudPanel-specific deployment script:

```bash
#!/bin/bash

# CloudPanel Deployment Script for Astrology Website

set -e

echo "🚀 Starting CloudPanel Deployment for Astrology Website"
echo "===================================================="

# Configuration - Update these variables
DOMAIN="yourdomain.com"
SITE_USER="your-cloudpanel-site-user"
PROJECT_DIR="/home/$SITE_USER/astrology-site"
BACKEND_DIR="$PROJECT_DIR/backend"
VENV_DIR="$BACKEND_DIR/venv"
LOG_DIR="$PROJECT_DIR/logs"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p "$LOG_DIR"

# Setup Python environment
cd "$BACKEND_DIR"
echo "🐍 Setting up Python virtual environment..."
python3 -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# Database configuration will be done through CloudPanel interface
echo "🗄️ Please create MySQL database in CloudPanel:"
echo "   - Database Name: astrology_website"
echo "   - Database User: astrology_user"
echo "   - Note the password for .env file"

# Setup systemd service
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/astrology-backend.service > /dev/null << EOF
[Unit]
Description=Astrology Website Backend
After=network.target

[Service]
User=$SITE_USER
Group=$SITE_USER
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$VENV_DIR/bin
ExecStart=$VENV_DIR/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8001 --log-file $LOG_DIR/gunicorn.log --log-level info
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable astrology-backend
sudo systemctl start astrology-backend

# Build frontend
echo "🎨 Building frontend..."
cd "$PROJECT_DIR"
npm install
npm run build

echo "✅ Backend deployment completed!"
echo "✅ Frontend build completed!"
echo ""
echo "📋 Next steps:"
echo "1. Create database in CloudPanel"
echo "2. Update .env file with database credentials"
echo "3. Configure site in CloudPanel with the Nginx config above"
echo "4. Point domain DNS to server IP: 88.222.245.41"
echo "5. Enable SSL in CloudPanel"
echo ""
echo "🌟 Your site will be available at: https://$DOMAIN"
```

## Monitoring and Maintenance

### Check Service Status
```bash
# Check backend service
sudo systemctl status astrology-backend

# View logs
tail -f /home/your-site-user/astrology-site/logs/gunicorn.log
```

### CloudPanel Management
- **Sites**: Manage domains, SSL, and site settings
- **Databases**: Database management and backups
- **Cron Jobs**: Schedule automated tasks
- **File Manager**: Upload/manage files
- **Backups**: Create and restore backups

## Troubleshooting

### Common CloudPanel Issues

#### Permission Issues
```bash
# Fix permissions
sudo chown -R your-site-user:your-site-user /home/your-site-user/astrology-site
```

#### Database Connection
```bash
# Test database connection
mysql -h localhost -u astrology_user -p astrology_website -e "SELECT 1;"
```

#### Service Not Starting
```bash
# Check service status
sudo systemctl status astrology-backend

# Check logs
sudo journalctl -u astrology-backend -f
```

## Security Considerations

### CloudPanel Security
- ✅ Use strong passwords
- ✅ Enable two-factor authentication (you already have this)
- ✅ Keep CloudPanel updated
- ✅ Use SSL certificates
- ✅ Regular backups

### Application Security
- ✅ Change SECRET_KEY in production
- ✅ Use environment variables for sensitive data
- ✅ Configure proper CORS origins
- ✅ Regular security updates

## Support

For CloudPanel-specific issues:
- CloudPanel Documentation: https://www.cloudpanel.io/docs/v2/
- Check service logs in `/home/your-site-user/astrology-site/logs/`
- Use CloudPanel's built-in monitoring tools

---

**Server Details:**
- IP: 88.222.245.41
- CloudPanel: https://88.222.245.41:8443
- SSH: Available
- User: rabbyhussain725@gmail.com

**Note**: Always backup your data before making changes in production.
