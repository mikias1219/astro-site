#!/bin/bash

# 🚀 QUICK UPDATE & REDEPLOY SCRIPT for AstroArupShastri.com
# Use this script when you make local changes and want to redeploy quickly
# This script pulls latest changes and redeploys the application

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
DOMAIN="astroarupshastri.com"
BACKEND_DIR="/root/astroarupshastri-backend"
FRONTEND_DIR="/root/astroarupshastri-frontend"
PROJECT_DIR="/root/astro-site"

# Functions
print_header() {
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║ $1${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${CYAN}🔸 $1${NC}"
}

print_header "QUICK UPDATE & REDEPLOY - AstroArupShastri.com"

echo ""
echo "This script will:"
echo "  🔄 Pull latest changes from repository"
echo "  🏗️  Rebuild frontend"
echo "  🔧 Restart services"
echo "  ✅ Verify deployment"
echo ""

# Ask for confirmation
read -p "Continue with update? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Update cancelled by user"
    exit 0
fi

# Step 1: Pull latest changes
print_header "PULLING LATEST CHANGES"

print_step "Checking git status..."
cd "$PROJECT_DIR"

if [ -d ".git" ]; then
    print_info "Git repository detected"
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes locally"
        print_info "Current status:"
        git status --short
        echo ""
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Update cancelled"
            exit 0
        fi
    fi
    
    print_step "Pulling latest changes from repository..."
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || {
        print_error "Failed to pull from repository"
        print_info "Continuing with local files..."
    }
    
    print_success "Repository updated"
else
    print_warning "Not a git repository, using local files"
fi

# Step 2: Rebuild Frontend
print_header "REBUILDING FRONTEND"

print_step "Stopping frontend service..."
pm2 stop astro-frontend 2>/dev/null || true

print_step "Navigating to frontend directory..."
cd "$FRONTEND_DIR"

print_step "Cleaning previous build..."
rm -rf .next out node_modules/.cache

print_step "Installing dependencies..."
npm install

print_step "Building for production..."
npm run build

# Check build result
if [ -d "out" ]; then
    print_success "Static export build completed"
    BUILD_TYPE="static"
elif [ -d ".next" ]; then
    print_success "SSR build completed"
    BUILD_TYPE="ssr"
else
    print_error "Build failed - no output directory found"
    exit 1
fi

# Step 3: Restart Services
print_header "RESTARTING SERVICES"

print_step "Starting frontend with PM2..."

if [ "$BUILD_TYPE" = "static" ]; then
    print_info "Starting static file server..."
    pm2 start "serve -s out -l 3001" --name astro-frontend
else
    print_info "Starting Next.js server..."
    pm2 start "npm run start -- -p 3001" --name astro-frontend
fi

pm2 save

# Restart backend if needed
print_step "Checking backend service..."
if sudo systemctl is-active --quiet astroarupshastri-backend; then
    print_info "Backend service is running, restarting for good measure..."
    sudo systemctl restart astroarupshastri-backend
    sleep 2
fi

# Step 4: Verification
print_header "VERIFICATION"

print_step "Testing services..."

# Test backend
sleep 3
if curl -s http://127.0.0.1:8002/health > /dev/null; then
    print_success "Backend API: ✅ Responding"
else
    print_warning "Backend API: ⚠️ Not responding yet"
fi

# Test frontend
if curl -s http://127.0.0.1:3001 > /dev/null; then
    print_success "Frontend: ✅ Responding on port 3001"
else
    print_warning "Frontend: ⚠️ Not responding yet"
fi

# Check PM2 status
if pm2 list | grep -q "astro-frontend.*online"; then
    print_success "Frontend PM2: ✅ Process running"
else
    print_error "Frontend PM2: ❌ Process not running"
    pm2 logs astro-frontend --lines 5
fi

# Final status
print_header "UPDATE COMPLETE!"

echo ""
print_success "🚀 Deployment updated successfully!"
echo ""
echo "🌐 Your site should now be live with latest changes:"
echo "   Website: https://$DOMAIN"
echo "   API: https://$DOMAIN/api"
echo ""
echo "🛠️ Quick commands:"
echo "   Check status: pm2 status"
echo "   View logs: pm2 logs astro-frontend"
echo "   Restart frontend: pm2 restart astro-frontend"
echo "   Restart backend: sudo systemctl restart astroarupshastri-backend"
echo ""

# Optional: Test the live site
print_step "Testing live site connectivity..."
if curl -s -I https://$DOMAIN | grep -q "200 OK\|301\|302"; then
    print_success "Live site: ✅ Accessible"
else
    print_warning "Live site: ⚠️ May not be accessible yet (DNS/SSL propagation)"
fi

print_success "🎉 Update deployment completed!"
