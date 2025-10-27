# Production Deployment Guide

## Server Information
- **Server Address**: 88.222.245.41
- **User**: root
- **SSH Key**: ~/.ssh/id_ed25519
- **Project Directory**: /root/astro folder (or your preferred location)

## Pre-Deployment Checklist
- [x] Code committed and pushed to GitHub
- [x] Build tested locally
- [x] All dependencies installed
- [x] Environment variables configured
- [x] Database migrations prepared
- [x] SSL certificates configured

## Step 1: SSH into Server

```bash
ssh -i ~/.ssh/id_ed25519 root@88.222.245.41
```

## Step 2: Navigate to Project Directory

```bash
cd /root/astro
# or create if doesn't exist
mkdir -p /root/astro && cd /root/astro
```

## Step 3: Clone or Pull Repository

### First Time Setup
```bash
git clone git@github.com:mikias1219/astro-site.git .
cd /root/astro
```

### For Subsequent Updates
```bash
cd /root/astro
git pull origin main
```

## Step 4: Install Dependencies

### Frontend Dependencies
```bash
npm install --legacy-peer-deps
```

### Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

## Step 5: Build Frontend

```bash
npm run build
```

## Step 6: Apply Database Migrations

### For MySQL (Production)
```bash
mysql -h localhost -u root -p your_database < backend/migrations/add_content_to_blogs.sql
```

Or connect to MySQL directly and run:
```sql
ALTER TABLE blogs ADD COLUMN content LONGTEXT;
```

### For SQLite (Development)
```bash
sqlite3 backend/astrology_website.db < backend/migrations/add_content_to_blogs.sql
```

## Step 7: Start Services

### Using final-deploy.sh
```bash
chmod +x final-deploy.sh
./final-deploy.sh
```

### Or Manual Start

#### Start Backend (FastAPI)
```bash
cd backend
python3 main.py &
# Or with Uvicorn for production:
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 &
```

#### Start Frontend (Next.js)
```bash
npm start
# Or with PM2:
pm2 start "npm start" --name "astro-site"
```

## Step 8: Configure Nginx (If Using)

Create `/etc/nginx/sites-available/astro-site`:

```nginx
upstream backend {
    server localhost:8000;
}

upstream frontend {
    server localhost:3001;
}

server {
    listen 80;
    listen 443 ssl http2;
    server_name astroarupshastri.com www.astroarupshastri.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers if needed
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    }

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/astro-site /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Step 9: Environment Variables

Create `.env.local` in project root:

```env
# Frontend
NEXT_PUBLIC_API_URL=https://astroarupshastri.com/api
NEXT_PUBLIC_SITE_URL=https://astroarupshastri.com

# Backend
DATABASE_URL=mysql://user:password@localhost/astrology_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Step 10: Verify Deployment

```bash
# Check frontend
curl -I http://localhost:3001
# Expected: 200 OK

# Check backend
curl -I http://localhost:8000/api/blogs
# Expected: 200 OK or 401 Unauthorized (if auth required)

# Check from outside
curl -I https://astroarupshastri.com
# Expected: 200 OK with content
```

## Step 11: Set Up Monitoring

### Using PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'astro-backend',
      script: 'backend/main.py',
      interpreter: 'python3',
      instances: 1,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'astro-frontend',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### Check Logs
```bash
pm2 logs
# Or specific app
pm2 logs astro-frontend
pm2 logs astro-backend
```

## Troubleshooting

### Issue: Build fails with dependency errors
```bash
npm install --legacy-peer-deps --force
npm run build
```

### Issue: Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000
# Kill process if needed
kill -9 <PID>

# Try with verbose logging
python3 backend/main.py --log-level debug
```

### Issue: Frontend won't connect to backend
- Check firewall rules
- Verify API URL in `.env.local`
- Check CORS settings in backend
- Test with: `curl http://localhost:8000/api/blogs`

### Issue: Database migration failed
```bash
# Check if column exists
mysql -u root -p -e "SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME='blogs' AND COLUMN_NAME='content';"

# If it doesn't exist, run migration again
mysql -u root -p your_database < backend/migrations/add_content_to_blogs.sql
```

## Backup Strategy

### Daily Backup
```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
mysqldump -u root -p your_database > $BACKUP_DIR/db_$DATE.sql

# Backup code
tar -czf $BACKUP_DIR/code_$DATE.tar.gz /root/astro

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /root/backup.sh
```

## Performance Optimization

### Enable Compression
In Nginx config:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_proxied any;
```

### Cache Control
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization
```sql
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_published ON blogs(is_published);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);
```

## Rollback Procedure

If deployment goes wrong:
```bash
# Revert to previous commit
cd /root/astro
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push origin main --force

# Rebuild
npm run build
pm2 restart all
```

## Post-Deployment Verification

1. **Frontend Tests**
   - [ ] Homepage loads
   - [ ] Blog pages load
   - [ ] Admin panel accessible
   - [ ] Blog editor with Quill loads

2. **Backend Tests**
   - [ ] API endpoints responding
   - [ ] Blog CRUD operations work
   - [ ] Database migrations applied
   - [ ] Content field in database

3. **SEO Tests**
   - [ ] Meta tags visible
   - [ ] Robots.txt accessible
   - [ ] Sitemap.xml accessible
   - [ ] Open Graph tags correct

4. **Performance Tests**
   - [ ] Page load time < 3s
   - [ ] API response time < 500ms
   - [ ] CSS/JS minified and compressed

## Support & Contact

For deployment issues:
1. Check logs: `pm2 logs`
2. Check system resources: `top`, `df -h`
3. Check network: `netstat -tulpn | grep LISTEN`
4. Review error messages in frontend console

---

**Last Updated**: October 27, 2024
**Version**: 1.0.0
