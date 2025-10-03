# AstroArupShastri.com - CloudPanel Deployment Overview

## Project Structure (Following Your Server Pattern)

```
/root/
├── astroarupshastri-backend/     # FastAPI Backend
│   ├── venv/                     # Python Virtual Environment
│   ├── logs/                     # Backend Logs
│   ├── app/                      # FastAPI Application
│   ├── requirements.txt          # Python Dependencies
│   ├── .env                      # Environment Variables
│   ├── status.sh                 # Backend Status Check
│   └── restart.sh                # Backend Restart Script
│
├── astroarupshastri-frontend/    # Next.js Frontend
│   ├── .next/                    # Built Frontend
│   ├── src/                      # Source Code
│   ├── public/                   # Static Assets
│   ├── package.json              # Node Dependencies
│   ├── .env.local                # Frontend Environment
│   ├── status.sh                 # Frontend Status Check
│   └── rebuild.sh                # Frontend Rebuild Script
│
└── astrology-site/               # Source Project (local development)
    ├── deploy-backend.sh         # Backend Deployment Script
    ├── deploy-frontend.sh        # Frontend Deployment Script
    ├── deploy-full.sh            # Full Deployment Script
    └── CLOUDPANEL_DEPLOYMENT_GUIDE.md
```

## Deployment Scripts

### 1. Individual Deployment Scripts

#### Backend Only
```bash
# Deploys to: /root/astroarupshastri-backend
./deploy-backend.sh
```

#### Frontend Only
```bash
# Deploys to: /root/astroarupshastri-frontend
./deploy-frontend.sh
```

### 2. Full Deployment Script
```bash
# Runs both backend and frontend deployment
./deploy-full.sh
```

## Server Configuration

### Backend Service
- **Port**: 8002
- **Service**: `astroarupshastri-backend.service`
- **URL**: `http://127.0.0.1:8002`
- **Health Check**: `http://127.0.0.1:8002/health`
- **API Docs**: `http://127.0.0.1:8002/docs`

### Frontend Configuration
- **Domain**: `astroarupshastri.com`
- **Directory**: `/root/astroarupshastri-frontend`
- **Build**: Static site generation with Next.js
- **API Proxy**: `/api/*` → `http://127.0.0.1:8002`

## CloudPanel Configuration Required

### 1. Database Setup
```
Database Name: astroarupshastri_db
Database User: astroarupshastri_user
Host: localhost
```

### 2. Site Configuration
```
Domain: astroarupshastri.com
Root Directory: /root/astroarupshastri-frontend
SSL: Let's Encrypt (auto-enabled)
```

### 3. Nginx Vhost Configuration
The deployment script provides the complete Nginx configuration for:
- Static file serving
- API proxy to backend
- SSL/TLS configuration
- Security headers
- Caching rules

## URLs After Deployment

### Public URLs
- **Website**: `https://astroarupshastri.com`
- **API**: `https://astroarupshastri.com/api`
- **Admin Panel**: `https://astroarupshastri.com/admin`

### Internal URLs
- **Backend Direct**: `http://127.0.0.1:8002`
- **Backend Health**: `http://127.0.0.1:8002/health`
- **API Documentation**: `http://127.0.0.1:8002/docs`

## Management Commands

### Backend Management
```bash
# Check status
/root/astroarupshastri-backend/status.sh

# Restart service
/root/astroarupshastri-backend/restart.sh

# View logs
tail -f /root/astroarupshastri-backend/logs/gunicorn.log

# Systemctl commands
sudo systemctl status astroarupshastri-backend
sudo systemctl restart astroarupshastri-backend
```

### Frontend Management
```bash
# Check status
/root/astroarupshastri-frontend/status.sh

# Rebuild frontend
/root/astroarupshastri-frontend/rebuild.sh

# Manual rebuild
cd /root/astroarupshastri-frontend
npm run build
```

## Deployment Process

### Quick Deployment (Recommended)
1. **Upload project** to server
2. **Run full deployment**: `./deploy-full.sh`
3. **Configure CloudPanel** (database, site, SSL)
4. **Update DNS** records
5. **Test website**

### Individual Deployment
1. **Backend first**: `./deploy-backend.sh`
2. **Configure database** in CloudPanel
3. **Frontend second**: `./deploy-frontend.sh`
4. **Configure site** in CloudPanel
5. **Test and verify**

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=mysql+pymysql://astroarupshastri_user:password@localhost/astroarupshastri_db
SECRET_KEY=[auto-generated-secure-key]
ALLOWED_ORIGINS=https://astroarupshastri.com,http://astroarupshastri.com
FRONTEND_URL=https://astroarupshastri.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://astroarupshastri.com/api
```

## Security Features

- ✅ **JWT Authentication** with secure secrets
- ✅ **CORS Protection** for domain only
- ✅ **SSL/TLS** via Let's Encrypt
- ✅ **Security Headers** in Nginx
- ✅ **Database Credentials** environment-based
- ✅ **Service Isolation** (backend runs as system service)

## Monitoring & Maintenance

### Health Checks
- Backend health endpoint: `/health`
- Service status monitoring
- Log file monitoring
- Database connectivity checks

### Backup Strategy
- Database backups via CloudPanel
- File system backups
- Automated backup scripts available

### Performance Optimization
- Gunicorn with 4 workers
- Static file caching (1 year)
- Database connection pooling
- Nginx optimization for static files

## Troubleshooting

### Backend Issues
```bash
# Check service status
sudo systemctl status astroarupshastri-backend

# View recent logs
sudo journalctl -u astroarupshastri-backend -n 50

# Test API directly
curl http://127.0.0.1:8002/health
```

### Frontend Issues
```bash
# Check if built correctly
ls -la /root/astroarupshastri-frontend/.next

# Test build process
cd /root/astroarupshastri-frontend && npm run build

# Check environment
cat /root/astroarupshastri-frontend/.env.local
```

### Database Issues
```bash
# Test database connection
mysql -h localhost -u astroarupshastri_user -p astroarupshastri_db -e "SELECT 1;"

# Check backend database logs
tail -f /root/astroarupshastri-backend/logs/gunicorn.log
```

## Support Information

- **CloudPanel URL**: https://88.222.245.41:8443
- **Server IP**: 88.222.245.41
- **Domain**: astroarupshastri.com
- **SSH Access**: Available as root
- **Documentation**: CLOUDPANEL_DEPLOYMENT_GUIDE.md

---

**Deployment Status**: Ready for deployment
**Domain**: astroarupshastri.com
**Server**: srv596142 (CloudPanel)
