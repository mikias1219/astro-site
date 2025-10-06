#!/bin/bash

# 🚀 SIMPLE UPLOAD SCRIPT FOR PRODUCTION
# This script helps you upload your fixed code to production

echo "🚀 UPLOADING FIXED CODE TO PRODUCTION"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Creating deployment package...${NC}"
tar -czf astro-deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=backend/venv \
    --exclude=backend/__pycache__ \
    --exclude=backend/app/__pycache__ \
    --exclude=backend/app/routers/__pycache__ \
    --exclude=backend/astrology_website.db \
    --exclude=.env.local \
    .

echo -e "${GREEN}✅ Deployment package created: astro-deploy.tar.gz${NC}"
echo ""

echo -e "${BLUE}Step 2: Uploading to production server...${NC}"
echo -e "${YELLOW}You will be prompted for the root password${NC}"
echo ""

scp astro-deploy.tar.gz root@102.208.98.142:/root/

echo ""
echo -e "${GREEN}✅ Files uploaded successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. SSH into your production server:"
echo "   ssh root@102.208.98.142"
echo ""
echo "2. Run these commands on the production server:"
echo "   cd /root"
echo "   tar -xzf astro-deploy.tar.gz"
echo "   mv astro-deploy astro-site"
echo "   cd astro-site"
echo "   chmod +x final-deploy.sh"
echo "   ./final-deploy.sh"
echo ""
echo -e "${GREEN}🎉 Your production deployment will be complete!${NC}"
