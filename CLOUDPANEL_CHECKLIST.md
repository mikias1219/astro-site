# CloudPanel Deployment Checklist

## Pre-Deployment Setup ✅

- [x] CloudPanel access confirmed (https://88.222.245.41:8443)
- [x] SSH access available
- [x] Domain name ready
- [x] Project files prepared

## CloudPanel Database Setup

- [ ] Login to CloudPanel (https://88.222.245.41:8443)
- [ ] Go to **Databases** section
- [ ] Click **Add Database**
- [ ] Create database:
  - Database Name: `astrology_website`
  - Database User: `astrology_user`
  - Password: [choose strong password]
  - Host: `localhost`
- [ ] Note down database credentials

## CloudPanel Site Setup

- [ ] Go to **Sites** section
- [ ] Click **Add Site**
- [ ] Configure site:
  - Domain: `yourdomain.com`
  - Site User: `astrology` (or your preferred name)
  - PHP Version: Not needed (Python backend)
- [ ] Note the site user name for deployment script

## File Upload

- [ ] Upload project files to server:
  ```bash
  scp -r astrology-site root@88.222.245.41:/home/your-site-user/
  ```
  OR use CloudPanel File Manager

## Server Deployment

- [ ] SSH into server: `ssh root@88.222.245.41`
- [ ] Navigate to project: `cd /home/your-site-user/astrology-site`
- [ ] Make deployment script executable: `chmod +x deploy-cloudpanel.sh`
- [ ] Run deployment: `./deploy-cloudpanel.sh`
- [ ] Follow the prompts and enter database details

## CloudPanel Configuration

- [ ] **SSL/TLS Setup:**
  - Go to Sites → yourdomain.com → SSL/TLS
  - Enable Let's Encrypt
  - Add domains: `yourdomain.com` and `www.yourdomain.com`

- [ ] **Vhost Configuration:**
  - Go to Sites → yourdomain.com → Vhost
  - Replace server block with configuration from CLOUDPANEL_DEPLOYMENT_GUIDE.md

- [ ] **Domain DNS:**
  - Point domain A record to: `88.222.245.41`
  - Add CNAME: `www` → `yourdomain.com`

## Testing & Verification

- [ ] Test backend API: `curl http://127.0.0.1:8001/health`
- [ ] Test frontend: Access `https://yourdomain.com`
- [ ] Test API endpoints: `https://yourdomain.com/api/docs`
- [ ] Verify database connection
- [ ] Check service status: `sudo systemctl status astrology-backend`

## Post-Deployment

- [ ] Configure email settings in `.env` file
- [ ] Set up automated backups
- [ ] Configure monitoring
- [ ] Test all website features
- [ ] Set up log rotation
- [ ] Configure firewall rules if needed

## Security Checklist

- [ ] Strong database password used
- [ ] SECRET_KEY changed in `.env`
- [ ] SSL certificate active
- [ ] File permissions correct
- [ ] Two-factor authentication enabled on CloudPanel
- [ ] Regular backups configured

## Useful Commands

```bash
# Check backend status
sudo systemctl status astrology-backend

# View backend logs
tail -f /home/your-site-user/astrology-site/logs/gunicorn.log

# Restart backend
sudo systemctl restart astrology-backend

# Run backup
/home/your-site-user/astrology-site/backup.sh

# Monitor system
/home/your-site-user/astrology-site/monitor.sh
```

## Emergency Contacts

- **CloudPanel Support**: https://www.cloudpanel.io/docs/v2/
- **Server IP**: 88.222.245.41
- **CloudPanel URL**: https://88.222.245.41:8443
- **Your Email**: rabbyhussain725@gmail.com

---

**Status**: ⏳ Ready for deployment

**Next Step**: Run `./deploy-cloudpanel.sh` on your server
