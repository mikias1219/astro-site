#!/bin/bash

# Full Deployment Script for AstroArupShastri.com
# Runs both backend and frontend deployment

set -e  # Exit on any error

echo "🚀 Full Deployment for AstroArupShastri.com"
echo "=========================================="
echo "Domain: astroarupshastri.com"
echo "Backend: astroarupshastri-backend"
echo "Frontend: astroarupshastri-frontend"
echo "Server: srv596142 (88.222.245.41)"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if scripts exist
if [ ! -f "deploy-backend.sh" ]; then
    print_error "deploy-backend.sh not found!"
    exit 1
fi

if [ ! -f "deploy-frontend.sh" ]; then
    print_error "deploy-frontend.sh not found!"
    exit 1
fi

print_status "Deployment scripts found"

# Run backend deployment
print_warning "Starting backend deployment..."
echo "=================================="
./deploy-backend.sh

if [ $? -eq 0 ]; then
    print_status "Backend deployment completed successfully"
else
    print_error "Backend deployment failed!"
    exit 1
fi

echo ""
print_warning "Starting frontend deployment..."
echo "=================================="
./deploy-frontend.sh

if [ $? -eq 0 ]; then
    print_status "Frontend deployment completed successfully"
else
    print_error "Frontend deployment failed!"
    exit 1
fi

echo ""
echo "🎉 FULL DEPLOYMENT COMPLETED!"
echo "============================="
echo ""
echo "📁 Directory Structure:"
echo "   Backend: /root/astroarupshastri-backend"
echo "   Frontend: /root/astroarupshastri-frontend"
echo ""
echo "🔗 URLs:"
echo "   Website: https://astroarupshastri.com"
echo "   API: https://astroarupshastri.com/api"
echo "   Admin: https://astroarupshastri.com/admin"
echo ""
echo "🛠️  Management Commands:"
echo "   Backend Status: /root/astroarupshastri-backend/status.sh"
echo "   Backend Restart: /root/astroarupshastri-backend/restart.sh"
echo "   Frontend Status: /root/astroarupshastri-frontend/status.sh"
echo "   Frontend Rebuild: /root/astroarupshastri-frontend/rebuild.sh"
echo ""
print_warning "IMPORTANT: Complete CloudPanel configuration!"
echo ""
echo "1. Create database in CloudPanel"
echo "2. Create site in CloudPanel pointing to frontend directory"
echo "3. Configure SSL certificates"
echo "4. Update DNS records"
echo ""
echo "📋 See CLOUDPANEL_DEPLOYMENT_GUIDE.md for detailed instructions"
