# Astrology Website - Hostinger VPS Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Astrology Website to a Hostinger VPS with MySQL database compatibility.

## Project Structure

```
astrology-site/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── app/                # Application code
│   ├── requirements.txt    # Python dependencies
│   ├── env.example         # Environment variables template
│   ├── migrate_to_mysql.py # Database migration script
│   └── astrology_website.db # SQLite database (development)
├── src/                    # Next.js frontend
├── out/                    # Built frontend (static files)
├── deploy-production.sh    # Production deployment script
└── DEPLOYMENT_GUIDE.md     # This file
```

## Prerequisites

### Hostinger VPS Requirements
- Ubuntu 20.04+ or CentOS 7+
- At least 2GB RAM (4GB recommended)
- 20GB storage minimum
- MySQL/MariaDB database
- Domain name configured

### System Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv mysql-server nginx certbot python3-certbot-nginx
```

## Quick Deployment (Automated)

### 1. Upload Project Files
Upload the entire project directory to your Hostinger VPS using SCP, FTP, or Git:

```bash
# Using SCP
scp -r astrology-site user@your-vps-ip:/home/user/

# Or using Git
git clone your-repo-url astrology-site
cd astrology-site
```

### 2. Run Automated Deployment
```bash
# Make deployment script executable
chmod +x deploy-production.sh

# Run deployment script
./deploy-production.sh
```

The script will:
- Install system dependencies
- Set up Python virtual environment
- Configure MySQL database
- Create environment configuration
- Set up Gunicorn for production
- Configure Nginx
- Optionally set up SSL certificates
- Create monitoring and backup scripts

## Manual Deployment Steps

### Step 1: Database Setup

#### Create MySQL Database
```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE astrology_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'astrology_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON astrology_website.* TO 'astrology_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Migrate from SQLite (if needed)
If you have existing SQLite data:

```bash
cd backend
python migrate_to_mysql.py
```

### Step 2: Backend Configuration

#### Setup Environment Variables
```bash
cd backend
cp env.example .env
nano .env
```

Update the `.env` file with your production settings:

```env
# Database Configuration
DATABASE_URL=mysql+pymysql://astrology_user:your_password@localhost/astrology_website

# JWT Configuration
SECRET_KEY=your-super-secret-key-here-change-this
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
HOST=0.0.0.0
PORT=8000

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,http://yourdomain.com

# Frontend Configuration
FRONTEND_URL=https://yourdomain.com
```

#### Install Backend Dependencies
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn
```

#### Initialize Database
```bash
# Initialize database tables
python init_db.py
```

### Step 3: Frontend Configuration

#### Build Frontend
```bash
# Install dependencies
npm install

# Create production environment file
echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com" > .env.local

# Build for production
npm run build
```

### Step 4: Production Server Setup

#### Gunicorn Configuration
Create systemd service for backend:

```bash
sudo nano /etc/systemd/system/astrology-backend.service
```

Add the following content:

```ini
[Unit]
Description=Astrology Website Backend
After=network.target

[Service]
User=your-user
Group=your-user
WorkingDirectory=/home/your-user/astrology-site/backend
Environment=PATH=/home/your-user/astrology-site/backend/venv/bin
ExecStart=/home/your-user/astrology-site/backend/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --log-file /home/your-user/astrology-site/logs/gunicorn.log --log-level info
Restart=always

[Install]
WantedBy=multi-user.target
```

#### Enable and Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable astrology-backend
sudo systemctl start astrology-backend
```

### Step 5: Nginx Configuration

#### Backend API Configuration
```bash
sudo nano /etc/nginx/sites-available/astrology-api
```

Add the following:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Logs
    access_log /home/your-user/astrology-site/logs/nginx_api_access.log;
    error_log /home/your-user/astrology-site/logs/nginx_api_error.log;
}
```

#### Frontend Configuration
```bash
sudo nano /etc/nginx/sites-available/astrology-frontend
```

Add the following:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /home/your-user/astrology-site/out;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files with caching
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Logs
    access_log /home/your-user/astrology-site/logs/nginx_frontend_access.log;
    error_log /home/your-user/astrology-site/logs/nginx_frontend_error.log;
}
```

#### Enable Sites
```bash
sudo ln -sf /etc/nginx/sites-available/astrology-api /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/astrology-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: SSL Configuration

#### Let's Encrypt SSL Certificates
```bash
# For frontend
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For API
sudo certbot --nginx -d api.yourdomain.com
```

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | MySQL database connection URL | mysql+pymysql://user:pass@localhost/db |
| SECRET_KEY | JWT secret key (generate random) | openssl rand -hex 32 |
| ALLOWED_ORIGINS | CORS allowed origins | https://domain.com,http://domain.com |
| SMTP_* | Email configuration | smtp.gmail.com |
| DEBUG | Debug mode (False for production) | False |

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | API base URL | https://api.yourdomain.com |

## Monitoring and Maintenance

### Check Service Status
```bash
# Backend service
sudo systemctl status astrology-backend

# Nginx
sudo systemctl status nginx

# View logs
tail -f /home/your-user/astrology-site/logs/gunicorn.log
tail -f /home/your-user/astrology-site/logs/nginx_frontend_access.log
```

### Backup Script
The deployment script creates a backup script at `/home/your-user/backup.sh`:

```bash
# Run backup
./backup.sh

# Setup automated backups (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/your-user/astrology-site/backup.sh
```

### Monitoring Script
Check system status with the monitoring script:

```bash
./monitor.sh
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Test MySQL connection
mysql -u astrology_user -p astrology_website -e "SELECT 1;"

# Check database URL in .env file
cat backend/.env | grep DATABASE_URL
```

#### Permission Issues
```bash
# Fix log directory permissions
sudo chown -R your-user:your-user /home/your-user/astrology-site/logs

# Fix nginx permissions
sudo chown -R www-data:www-data /home/your-user/astrology-site/out
```

#### Port Issues
```bash
# Check if port 8000 is available
sudo netstat -tulpn | grep :8000

# Check firewall
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
```

#### SSL Issues
```bash
# Renew SSL certificates
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

## Performance Optimization

### Database Optimization
```sql
-- Add indexes for better performance
ALTER TABLE bookings ADD INDEX idx_user_id (user_id);
ALTER TABLE bookings ADD INDEX idx_service_id (service_id);
ALTER TABLE blogs ADD INDEX idx_slug (slug);
ALTER TABLE pages ADD INDEX idx_slug (slug);
```

### Nginx Optimization
Add to `/etc/nginx/nginx.conf`:
```nginx
worker_processes auto;
worker_connections 1024;

# Enable gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop

# Monitor resource usage
htop
```

## Security Checklist

- [ ] Change default MySQL root password
- [ ] Use strong SECRET_KEY (32+ characters)
- [ ] Configure firewall (UFW/iptables)
- [ ] Enable SSL/TLS certificates
- [ ] Update system packages regularly
- [ ] Configure log rotation
- [ ] Set proper file permissions
- [ ] Disable root SSH login
- [ ] Use fail2ban for SSH protection

## Support

For issues or questions:
1. Check application logs in `/logs/` directory
2. Review systemd service status
3. Test API endpoints directly
4. Verify database connectivity
5. Check Nginx error logs

## Version Information

- FastAPI: 0.104.1
- Next.js: 14.2.10
- MySQL: 8.0+
- Python: 3.8+
- Node.js: 18+

---

**Note**: Always backup your data before making changes to production systems.
