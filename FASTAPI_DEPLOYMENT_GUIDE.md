# FastAPI Deployment Guide: Hostinger VPS with Nginx, Gunicorn, Uvicorn & HTTPS

This guide explains how to deploy your FastAPI async application on Hostinger VPS using Ubuntu, Gunicorn + Uvicorn, Nginx reverse proxy, and Let's Encrypt SSL certificates.

## 🏗️ Deployment Architecture

```
Internet → Nginx (Port 80/443) → FastAPI Backend (Port 8002) → Database
                ↓
         Frontend (Static Files)
```

### Components:
- **FastAPI Backend**: Async Python application with Gunicorn + Uvicorn workers
- **Frontend**: Next.js static export served by Nginx
- **Reverse Proxy**: Nginx handles SSL termination and routing
- **SSL/HTTPS**: Let's Encrypt certificates via Certbot
- **Process Management**: Systemd for backend, PM2 for frontend

## 🚀 Quick Deployment

The `final-deploy.sh` script handles everything automatically:

```bash
# Make script executable
chmod +x final-deploy.sh

# Run deployment
./final-deploy.sh
```

## 📋 Manual Deployment Steps

### 1. System Requirements

```bash
# Update system
sudo apt update

# Install required packages
sudo apt install nginx python3 python3-venv git curl
```

### 2. FastAPI Backend Setup

#### Install Dependencies
```bash
cd backend/
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn uvicorn[standard]
```

#### Configure Environment
```bash
# Create .env file
cat > .env << EOF
DATABASE_URL=sqlite:///./astroarupshastri.db
SECRET_KEY=$(openssl rand -hex 32)
DEBUG=False
HOST=127.0.0.1
PORT=8002
ALLOWED_ORIGINS=https://yourdomain.com,http://yourdomain.com
EOF
```

### 3. Systemd Service Configuration

Create `/etc/systemd/system/astroarupshastri-backend.service`:

```ini
[Unit]
Description=AstroArupShastri Backend
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=/root/astroarupshastri-backend
Environment=PATH=/root/astroarupshastri-backend/venv/bin
EnvironmentFile=/root/astroarupshastri-backend/.env
ExecStart=/root/astroarupshastri-backend/venv/bin/gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 127.0.0.1:8002 --log-level info
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

#### Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable astroarupshastri-backend
sudo systemctl start astroarupshastri-backend
```

### 4. Nginx Configuration

Create `/etc/nginx/sites-available/astroarupshastri`:

```nginx
# Redirect www to non-www
server {
    listen 80;
    server_name www.yourdomain.com;
    return 301 $scheme://yourdomain.com$request_uri;
}

# Main App
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend static files
    root /root/astroarupshastri-frontend/out;
    index index.html;

    # Frontend - serve static files (SPA routing)
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

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/astroarupshastri /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL/HTTPS Setup

#### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

#### Obtain SSL Certificate
```bash
# Make sure DNS is pointing to your server first!
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will automatically:
- Obtain SSL certificates from Let's Encrypt
- Update Nginx configuration
- Set up automatic renewal

## 🔧 Key Configuration Details

### Gunicorn Configuration

The deployment uses Gunicorn with Uvicorn workers for optimal async performance:

```bash
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 127.0.0.1:8002 \
  --log-level info
```

**Why this configuration?**
- **4 workers**: Optimal for most VPS setups (CPU cores × 2)
- **UvicornWorker**: Handles async FastAPI applications efficiently
- **127.0.0.1**: Only accessible from localhost (secure)
- **Port 8002**: Avoids conflicts with other services

### Nginx Reverse Proxy

Nginx serves multiple purposes:
1. **SSL Termination**: Handles HTTPS encryption
2. **Static File Serving**: Serves frontend files efficiently
3. **API Routing**: Proxies `/api/` requests to FastAPI backend
4. **Security Headers**: Adds security headers to all responses
5. **Caching**: Caches static assets for better performance

### Process Management

- **Backend**: Systemd service for reliability and auto-restart
- **Frontend**: PM2 for process monitoring and management

## 🛠️ Management Commands

### Backend Management
```bash
# Check status
sudo systemctl status astroarupshastri-backend

# View logs
sudo journalctl -u astroarupshastri-backend -f

# Restart service
sudo systemctl restart astroarupshastri-backend

# Test API
curl http://127.0.0.1:8002/health
```

### Frontend Management
```bash
# Check PM2 status
pm2 list

# View frontend logs
pm2 logs astro-frontend

# Restart frontend
pm2 restart astro-frontend

# Test frontend
curl http://127.0.0.1:3001
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Management
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## 🔍 Troubleshooting

### Backend Issues

**Service won't start:**
```bash
# Check service status
sudo systemctl status astroarupshastri-backend

# View detailed logs
sudo journalctl -u astroarupshastri-backend -n 50

# Check if port is in use
sudo netstat -tlnp | grep 8002
```

**API not responding:**
```bash
# Test local connection
curl http://127.0.0.1:8002/health

# Check if service is running
sudo systemctl is-active astroarupshastri-backend

# Check environment variables
sudo systemctl show astroarupshastri-backend -p Environment
```

### Frontend Issues

**Frontend not loading:**
```bash
# Check PM2 status
pm2 list

# View PM2 logs
pm2 logs astro-frontend --lines 50

# Check if build exists
ls -la /root/astroarupshastri-frontend/out/

# Test local serving
curl http://127.0.0.1:3001
```

### Nginx Issues

**502 Bad Gateway:**
```bash
# Check if backend is running
curl http://127.0.0.1:8002/health

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t
```

**SSL Issues:**
```bash
# Check certificate status
sudo certbot certificates

# Test SSL configuration
openssl s_client -connect yourdomain.com:443

# Renew certificates
sudo certbot renew --force-renewal
```

## 🔐 Security Considerations

### Backend Security
- Service runs as non-root user (recommended)
- Only accessible from localhost
- Environment variables for sensitive data
- CORS properly configured

### Nginx Security
- Security headers added to all responses
- Static file caching with appropriate headers
- SSL/TLS encryption enforced
- Rate limiting (can be added)

### SSL/TLS
- Let's Encrypt certificates with auto-renewal
- HTTPS redirect enforced
- Strong cipher suites (modern browsers)

## 📊 Performance Optimization

### Backend Performance
- **Worker Count**: Adjust based on CPU cores
- **Database Connection Pooling**: Configure in your app
- **Caching**: Implement Redis if needed
- **Logging**: Use structured logging

### Frontend Performance
- **Static Export**: Pre-built files for faster serving
- **Caching**: Long-term caching for static assets
- **Compression**: Enable gzip in Nginx
- **CDN**: Consider CloudFlare for global distribution

### Nginx Performance
- **Worker Processes**: Set to CPU cores
- **Keep-Alive**: Enable for better connection reuse
- **Gzip**: Compress text files
- **Buffer Sizes**: Optimize for your traffic

## 🔄 Deployment Updates

### Code Updates
```bash
# Pull latest code
cd /root/astro-site
git pull origin main

# Restart backend
sudo systemctl restart astroarupshastri-backend

# Rebuild frontend
cd /root/astroarupshastri-frontend
npm run build
pm2 restart astro-frontend
```

### Database Updates
```bash
# Run migrations (if using Alembic)
cd /root/astroarupshastri-backend
source venv/bin/activate
alembic upgrade head
```

## 📈 Monitoring

### Health Checks
- **Backend**: `curl https://yourdomain.com/api/health`
- **Frontend**: `curl https://yourdomain.com`
- **SSL**: `curl -I https://yourdomain.com`

### Log Monitoring
```bash
# Backend logs
sudo journalctl -u astroarupshastri-backend -f

# Frontend logs
pm2 logs astro-frontend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
```

## 🎯 Production Checklist

- [ ] Domain DNS pointing to server
- [ ] SSL certificates installed and working
- [ ] Backend service running and healthy
- [ ] Frontend building and serving correctly
- [ ] Nginx configuration tested and reloaded
- [ ] Security headers implemented
- [ ] Monitoring and logging configured
- [ ] Backup strategy in place
- [ ] SSL auto-renewal working
- [ ] Performance optimized

## 🆘 Support

If you encounter issues:

1. Check the logs first
2. Verify all services are running
3. Test each component individually
4. Check DNS configuration
5. Verify SSL certificate status

For additional help, refer to:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Gunicorn Documentation](https://gunicorn.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

**🎉 Congratulations!** Your FastAPI application is now deployed with production-grade infrastructure including HTTPS, reverse proxy, and proper process management.
