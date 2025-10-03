#!/bin/bash

# 🛠️ MANAGEMENT SCRIPT for AstroArupShastri.com
# Easy commands to manage your deployment

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

show_help() {
    print_header "AstroArupShastri.com Management Commands"
    
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Available commands:"
    echo ""
    echo "  🚀 Deployment:"
    echo "    deploy     - Run full deployment (first time)"
    echo "    update     - Quick update (pull changes & redeploy)"
    echo "    clean      - Complete clean rebuild"
    echo ""
    echo "  🔧 Services:"
    echo "    status     - Show all service status"
    echo "    restart    - Restart all services"
    echo "    logs       - Show recent logs"
    echo ""
    echo "  🌐 Frontend:"
    echo "    frontend   - Frontend operations menu"
    echo "    rebuild    - Rebuild frontend only"
    echo "    serve      - Start static file server"
    echo ""
    echo "  🔗 Backend:"
    echo "    backend    - Backend operations menu"
    echo "    api        - Test API connectivity"
    echo ""
    echo "  📊 Monitoring:"
    echo "    health     - Health check all services"
    echo "    test       - Test live site connectivity"
    echo ""
    echo "  ❓ Help:"
    echo "    help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status    # Check all services"
    echo "  $0 update    # Quick update deployment"
    echo "  $0 logs      # Show recent logs"
    echo ""
}

show_status() {
    print_header "SERVICE STATUS"
    
    echo ""
    print_step "PM2 Processes:"
    pm2 list
    
    echo ""
    print_step "Backend Service:"
    if sudo systemctl is-active --quiet astroarupshastri-backend; then
        print_success "Backend service: Running"
    else
        print_error "Backend service: Not running"
    fi
    
    echo ""
    print_step "Port Status:"
    echo "Port 3001 (Frontend):"
    ss -tuln | grep 3001 || echo "  Not listening"
    
    echo "Port 8002 (Backend):"
    ss -tuln | grep 8002 || echo "  Not listening"
    
    echo ""
    print_step "Connectivity Tests:"
    
    # Test backend
    if curl -s http://127.0.0.1:8002/health > /dev/null; then
        print_success "Backend API: Responding"
    else
        print_warning "Backend API: Not responding"
    fi
    
    # Test frontend
    if curl -s http://127.0.0.1:3001 > /dev/null; then
        print_success "Frontend: Responding on port 3001"
    else
        print_warning "Frontend: Not responding on port 3001"
    fi
}

show_logs() {
    print_header "RECENT LOGS"
    
    echo ""
    print_step "Frontend PM2 Logs:"
    pm2 logs astro-frontend --lines 10
    
    echo ""
    print_step "Backend Service Logs:"
    sudo journalctl -u astroarupshastri-backend -n 10 --no-pager
}

restart_services() {
    print_header "RESTARTING SERVICES"
    
    print_step "Restarting frontend..."
    pm2 restart astro-frontend
    
    print_step "Restarting backend..."
    sudo systemctl restart astroarupshastri-backend
    
    sleep 3
    
    print_step "Verifying services..."
    show_status
}

test_connectivity() {
    print_header "CONNECTIVITY TESTS"
    
    echo ""
    print_step "Testing Backend API..."
    if curl -s http://127.0.0.1:8002/health; then
        print_success "Backend API: OK"
    else
        print_error "Backend API: Failed"
    fi
    
    echo ""
    print_step "Testing Frontend..."
    if curl -s -I http://127.0.0.1:3001 | head -1; then
        print_success "Frontend: OK"
    else
        print_error "Frontend: Failed"
    fi
    
    echo ""
    print_step "Testing Live Site..."
    if curl -s -I https://$DOMAIN | head -1; then
        print_success "Live Site: OK"
    else
        print_warning "Live Site: May not be accessible (DNS/SSL)"
    fi
}

frontend_menu() {
    print_header "FRONTEND OPERATIONS"
    
    echo ""
    echo "Frontend options:"
    echo "1) Rebuild frontend"
    echo "2) Start static server"
    echo "3) Show frontend logs"
    echo "4) Restart frontend"
    echo "5) Back to main menu"
    echo ""
    read -p "Choose option (1-5): " choice
    
    case $choice in
        1)
            print_step "Rebuilding frontend..."
            cd "$FRONTEND_DIR"
            rm -rf .next out node_modules/.cache
            npm install
            npm run build
            pm2 restart astro-frontend
            print_success "Frontend rebuilt and restarted"
            ;;
        2)
            print_step "Starting static server..."
            cd "$FRONTEND_DIR"
            pm2 delete astro-frontend 2>/dev/null || true
            pm2 start "serve -s out -l 3001" --name astro-frontend
            pm2 save
            print_success "Static server started"
            ;;
        3)
            pm2 logs astro-frontend --lines 20
            ;;
        4)
            pm2 restart astro-frontend
            print_success "Frontend restarted"
            ;;
        5)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

backend_menu() {
    print_header "BACKEND OPERATIONS"
    
    echo ""
    echo "Backend options:"
    echo "1) Restart backend service"
    echo "2) Show backend logs"
    echo "3) Test API endpoints"
    echo "4) Check database connection"
    echo "5) Back to main menu"
    echo ""
    read -p "Choose option (1-5): " choice
    
    case $choice in
        1)
            print_step "Restarting backend..."
            sudo systemctl restart astroarupshastri-backend
            sleep 2
            print_success "Backend restarted"
            ;;
        2)
            print_step "Backend logs:"
            sudo journalctl -u astroarupshastri-backend -n 20 --no-pager
            ;;
        3)
            print_step "Testing API endpoints..."
            echo "Health check:"
            curl -s http://127.0.0.1:8002/health || echo "Failed"
            echo "API docs:"
            curl -s -I http://127.0.0.1:8002/docs | head -1 || echo "Failed"
            ;;
        4)
            print_step "Database status:"
            # This would depend on your database setup
            print_info "Database connection check not implemented"
            ;;
        5)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Main script logic
case "${1:-help}" in
    "deploy")
        print_info "Running full deployment..."
        bash "$PROJECT_DIR/final-deploy.sh"
        ;;
    "update")
        print_info "Running quick update..."
        bash "$PROJECT_DIR/update-deploy.sh"
        ;;
    "clean")
        print_info "Running clean rebuild..."
        bash "$FRONTEND_DIR/clean-rebuild.sh"
        ;;
    "status")
        show_status
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs
        ;;
    "frontend")
        frontend_menu
        ;;
    "rebuild")
        print_step "Rebuilding frontend..."
        cd "$FRONTEND_DIR"
        rm -rf .next out node_modules/.cache
        npm install
        npm run build
        pm2 restart astro-frontend
        print_success "Frontend rebuilt"
        ;;
    "serve")
        print_step "Starting static server..."
        cd "$FRONTEND_DIR"
        pm2 delete astro-frontend 2>/dev/null || true
        pm2 start "serve -s out -l 3001" --name astro-frontend
        pm2 save
        print_success "Static server started"
        ;;
    "backend")
        backend_menu
        ;;
    "api")
        test_connectivity
        ;;
    "health")
        test_connectivity
        ;;
    "test")
        test_connectivity
        ;;
    "help"|*)
        show_help
        ;;
esac
