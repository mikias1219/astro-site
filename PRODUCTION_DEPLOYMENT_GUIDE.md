# Production Deployment Instructions for AstroArupShastri.com

## 🚀 DEPLOYMENT STEPS

### 1. Transfer Files to Production Server
```bash
# Copy the entire project to your production server
scp -r /home/mikias/Mikias/Work/Projects/Freelance/astro-site root@YOUR_SERVER_IP:/root/
```

### 2. Run the Enhanced Deployment Script
```bash
# On your production server as root
cd /root/astro-site
chmod +x final-deploy.sh
./final-deploy.sh
```

### 3. Monitor SSL Installation
```bash
# Watch the SSL monitoring in real-time
tail -f /root/astro-site/ssl_monitor.log
```

### 4. Verify Everything is Working
```bash
# Check services
sudo systemctl status astroarupshastri-backend
sudo systemctl status nginx

# Test endpoints
curl https://astroarupshastri.com/api/health
curl https://astroarupshastri.com/
```

## 🔧 MANUAL TROUBLESHOOTING

If deployment fails, you can run components manually:

### Start Backend Manually:
```bash
cd /root/astroarupshastri-backend
source venv/bin/activate
python3 main.py
```

### Start Frontend Manually:
```bash
cd /root/astroarupshastri-frontend
npm install
npm run build
npm run start
```

### Check Nginx Configuration:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 📋 PRODUCTION CHECKLIST

- [ ] DNS points to server IP (102.208.98.142)
- [ ] SSH access to production server
- [ ] Root privileges on production server
- [ ] Port 80 and 443 open in firewall
- [ ] SSL monitoring script running
- [ ] Backend API responding on /api/health
- [ ] Frontend accessible on HTTPS
- [ ] Admin panel working at /admin
- [ ] Change-password endpoint working

## 🎯 WHAT THE DEPLOYMENT DOES

1. **Installs Dependencies**: Nginx, Python, Node.js, SSL tools
2. **Sets Up Backend**: Creates virtual environment, installs packages, starts systemd service
3. **Builds Frontend**: Next.js static export with SEO optimization
4. **Configures Nginx**: Advanced routing, security headers, SSL automation
5. **Monitors SSL**: Automatically installs certificates when DNS is ready
6. **Sets Up Monitoring**: Service management and automatic SSL renewal

## 🚨 CURRENT STATUS

❌ **Production backend is NOT running**
❌ **API endpoints returning 404**
❌ **SSL not configured**
❌ **Static files not being served**

## ✅ SOLUTION

Run the deployment script on your production server to fix all issues automatically!
