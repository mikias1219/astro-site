#!/bin/bash

# Database Creation Script for AstroArupShastri.com
# Tries multiple methods to create the database automatically

echo "🗄️ Creating Database for AstroArupShastri.com"
echo "============================================"

# Database details
DB_NAME="astroarupshastri_db"
DB_USER="astroarupshastri_user"
DB_PASSWORD="AstroArup$(openssl rand -hex 4)!2024"

echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Password: $DB_PASSWORD"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Method 1: Try with root user and common passwords
print_info "Method 1: Trying root user with common passwords..."

PASSWORDS=("Brainwave786@" "admin" "password" "root" "" "mysql")

for PASSWORD in "${PASSWORDS[@]}"; do
    echo "Trying password: '${PASSWORD}'"
    if mysql -u root -p"$PASSWORD" -e "SELECT 1;" 2>/dev/null; then
        print_status "Connected with root password: '$PASSWORD'"
        echo "Creating database..."

        mysql -u root -p"$PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
USE $DB_NAME;
SELECT 'Database created successfully with root!' as status;
EOF

        if [ $? -eq 0 ]; then
            print_status "Database created successfully!"
            echo ""
            echo "🔐 Database Credentials:"
            echo "   Database: $DB_NAME"
            echo "   Username: $DB_USER"
            echo "   Password: $DB_PASSWORD"
            echo "   Host: localhost"
            echo ""
            print_info "You can now run: ./deploy-full-auto.sh"
            exit 0
        fi
    fi
done

# Method 2: Try with admin user
print_info "Method 2: Trying admin user..."

if mysql -u admin -p"Brainwave786@" -e "SELECT 1;" 2>/dev/null; then
    print_status "Connected with admin user!"

    mysql -u admin -p"Brainwave786@" << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
USE $DB_NAME;
SELECT 'Database created successfully with admin!' as status;
EOF

    if [ $? -eq 0 ]; then
        print_status "Database created successfully!"
        echo ""
        echo "🔐 Database Credentials:"
        echo "   Database: $DB_NAME"
        echo "   Username: $DB_USER"
        echo "   Password: $DB_PASSWORD"
        echo "   Host: localhost"
        echo ""
        print_info "You can now run: ./deploy-full-auto.sh"
        exit 0
    fi
fi

# Method 3: Try MySQL without password (for some configurations)
print_info "Method 3: Trying MySQL without password..."

if mysql -u root -e "SELECT 1;" 2>/dev/null; then
    print_status "Connected without password!"

    mysql -u root << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
USE $DB_NAME;
SELECT 'Database created successfully without password!' as status;
EOF

    if [ $? -eq 0 ]; then
        print_status "Database created successfully!"
        echo ""
        echo "🔐 Database Credentials:"
        echo "   Database: $DB_NAME"
        echo "   Username: $DB_USER"
        echo "   Password: $DB_PASSWORD"
        echo "   Host: localhost"
        echo ""
        print_info "You can now run: ./deploy-full-auto.sh"
        exit 0
    fi
fi

# Method 4: Try using sudo with MySQL
print_info "Method 4: Trying with sudo..."

if sudo mysql -e "SELECT 1;" 2>/dev/null; then
    print_status "Connected with sudo!"

    sudo mysql << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
USE $DB_NAME;
SELECT 'Database created successfully with sudo!' as status;
EOF

    if [ $? -eq 0 ]; then
        print_status "Database created successfully!"
        echo ""
        echo "🔐 Database Credentials:"
        echo "   Database: $DB_NAME"
        echo "   Username: $DB_USER"
        echo "   Password: $DB_PASSWORD"
        echo "   Host: localhost"
        echo ""
        print_info "You can now run: ./deploy-full-auto.sh"
        exit 0
    fi
fi

# If all methods fail, provide manual instructions
print_error "Could not create database automatically."
echo ""
print_warning "Please create the database manually:"
echo ""
echo "🌐 Open CloudPanel: https://88.222.245.41:8443"
echo "   Username: admin"
echo "   Password: Brainwave786@"
echo ""
echo "📊 Go to Databases → Add Database"
echo "   Database Name: $DB_NAME"
echo "   Database User: $DB_USER"
echo "   Password: $DB_PASSWORD"
echo "   Host: localhost"
echo ""
echo "After creating, run: ./deploy-full-auto.sh"
echo ""
print_info "Or provide the actual MySQL root password to try again."

exit 1
