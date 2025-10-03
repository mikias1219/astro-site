#!/bin/bash

# CloudPanel Frontend Deployment Script for Astrology Website
# Deploys to: astroarupshastri-frontend

set -e  # Exit on any error

echo "🎨 Deploying Astrology Website Frontend"
echo "======================================"
echo "Domain: astroarupshastri.com"
echo "Frontend Folder: astroarupshastri-frontend"
echo "Server: srv596142 (88.222.245.41)"
echo ""

# Configuration
DOMAIN="astroarupshastri.com"
FRONTEND_DIR="/root/astroarupshastri-frontend"
BACKEND_URL="http://127.0.0.1:8002"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
echo "🔍 Performing pre-deployment checks..."
if ! command_exists node; then
    print_warning "Node.js not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command_exists npm; then
    print_error "npm is not installed. Installing npm..."
    sudo apt-get install -y npm
fi

print_status "Pre-deployment checks completed"

# Create frontend directory structure
print_status "Creating frontend directory structure..."
mkdir -p "$FRONTEND_DIR"

# Copy frontend files (excluding node_modules and .next)
print_status "Copying frontend files..."
cp -r src "$FRONTEND_DIR/"
cp -r public "$FRONTEND_DIR/"
cp -r components "$FRONTEND_DIR/"
cp -r contexts "$FRONTEND_DIR/"
cp -r lib "$FRONTEND_DIR/"
cp package.json "$FRONTEND_DIR/"
cp package-lock.json "$FRONTEND_DIR/" 2>/dev/null || true
cp pnpm-lock.yaml "$FRONTEND_DIR/" 2>/dev/null || true
cp next.config.mjs "$FRONTEND_DIR/"
cp tailwind.config.ts "$FRONTEND_DIR/"
cp tsconfig.json "$FRONTEND_DIR/"
cp postcss.config.mjs "$FRONTEND_DIR/"

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Install dependencies
print_status "Installing Node.js dependencies..."
npm install

# Create production environment file
print_status "Creating production environment configuration..."
cat > .env.local << EOF
# Frontend Environment Configuration
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
EOF

# Build for production
print_status "Building frontend for production..."
npm run build

# Verify build success
if [ ! -d ".next" ]; then
    print_error "Build failed! .next directory not found."
    exit 1
fi

print_status "Frontend build completed successfully"

# Create frontend management scripts
print_status "Creating frontend management scripts..."

# Create rebuild script
cat > rebuild.sh << 'EOF'
#!/bin/bash
echo "Rebuilding AstroArupShastri Frontend..."
cd /root/astroarupshastri-frontend

# Clean previous build
rm -rf .next

# Install dependencies
npm install

# Build for production
npm run build

echo "Frontend rebuild completed!"
EOF

chmod +x rebuild.sh

# Create status check script
cat > status.sh << 'EOF'
#!/bin/bash
echo "=== AstroArupShastri Frontend Status ==="
echo "Date: $(date)"
echo "Domain: astroarupshastri.com"
echo "Directory: /root/astroarupshastri-frontend"
echo ""

echo "=== Build Status ==="
if [ -d "/root/astroarupshastri-frontend/.next" ]; then
    echo "✅ Frontend is built"
    ls -la /root/astroarupshastri-frontend/.next | head -5
else
    echo "❌ Frontend not built"
fi
echo ""

echo "=== File Structure ==="
ls -la /root/astroarupshastri-frontend/
echo ""

echo "=== Environment ==="
cat /root/astroarupshastri-frontend/.env.local
EOF

chmod +x status.sh

print_status "Frontend deployment completed successfully!"
echo ""
echo "🎉 Frontend Summary:"
echo "   ✅ Next.js frontend deployed to: $FRONTEND_DIR"
echo "   ✅ Built for production"
echo "   ✅ API URL configured: https://$DOMAIN/api"
echo ""
echo "📁 Frontend Structure:"
echo "   Source: $FRONTEND_DIR/src"
echo "   Build: $FRONTEND_DIR/.next"
echo "   Public: $FRONTEND_DIR/public"
echo ""
echo "🛠️  Frontend Management:"
echo "   Status: $FRONTEND_DIR/status.sh"
echo "   Rebuild: $FRONTEND_DIR/rebuild.sh"
echo ""
print_warning "CloudPanel Site Configuration Required:"
echo ""
echo "Please complete these steps in CloudPanel (https://88.222.245.41:8443):"
echo ""
echo "1. 🌐 Create Site:"
echo "   - Sites → Add Site"
echo "   - Domain: $DOMAIN"
echo "   - Root Directory: $FRONTEND_DIR"
echo ""
echo "2. 🔒 Enable SSL:"
echo "   - Sites → $DOMAIN → SSL/TLS"
echo "   - Enable Let's Encrypt"
echo "   - Add domains: $DOMAIN and www.$DOMAIN"
echo ""
echo "3. ⚙️ Configure Vhost (replace server block):"
echo 'server {'
echo '    listen 80;'
echo '    listen [::]:80;'
echo '    listen 443 ssl http2;'
echo '    listen [::]:443 ssl http2;'
echo '    {{ssl_certificate_key}}'
echo '    {{ssl_certificate}}'
echo "    server_name $DOMAIN www.$DOMAIN;"
echo ''
echo "    root $FRONTEND_DIR;"
echo '    index index.html;'
echo ''
echo '    {{nginx_access_log}}'
echo '    {{nginx_error_log}}'
echo ''
echo '    # Frontend - serve static files'
echo '    location / {'
echo '        try_files $uri $uri/ /index.html;'
echo ''
echo '        # Security headers'
echo "        add_header X-Frame-Options \"SAMEORIGIN\" always;"
echo "        add_header X-XSS-Protection \"1; mode=block\" always;"
echo "        add_header X-Content-Type-Options \"nosniff\" always;"
echo "        add_header Referrer-Policy \"no-referrer-when-downgrade\" always;"
echo "        add_header Content-Security-Policy \"default-src '\''self'\'' http: https: data: blob: '\''unsafe-inline'\''\" always;"
echo '    }'
echo ''
echo '    # API proxy to backend'
echo '    location /api/ {'
echo "        proxy_pass http://127.0.0.1:8002;"
echo '        proxy_http_version 1.1;'
echo '        proxy_set_header Upgrade $http_upgrade;'
echo '        proxy_set_header Connection '\''upgrade'\'';'
echo '        proxy_set_header Host $host;'
echo '        proxy_set_header X-Real-IP $remote_addr;'
echo '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;'
echo '        proxy_set_header X-Forwarded-Proto $scheme;'
echo '        proxy_cache_bypass $http_upgrade;'
echo ''
echo '        # Timeout settings'
echo '        proxy_connect_timeout 60s;'
echo '        proxy_send_timeout 60s;'
echo '        proxy_read_timeout 60s;'
echo '    }'
echo ''
echo '    # Static files caching'
echo '    location /_next/static/ {'
echo '        expires 1y;'
echo "        add_header Cache-Control \"public, immutable\";"
echo '    }'
echo ''
echo '    # Security headers for static files'
echo '    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {'
echo '        expires 1y;'
echo "        add_header Cache-Control \"public, immutable\";"
echo '    }'
echo ''
echo '    {{settings}}'
echo '}'
echo ""
echo "4. 🌐 DNS Configuration:"
echo "   - Point domain A record to: 88.222.245.41"
echo "   - Add CNAME: www → $DOMAIN"
echo ""
echo "🔗 Final URLs:"
echo "   Website: https://$DOMAIN"
echo "   API: https://$DOMAIN/api"
echo "   Admin: https://$DOMAIN/admin"
