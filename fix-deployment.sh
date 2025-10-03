#!/bin/bash

# Fix deployment script with correct database credentials

echo "🔧 Fixing deployment script with database credentials..."

# Update the database password in the deployment script
sed -i 's/DB_PASSWORD="[^"]*"/DB_PASSWORD="V38VfuFS5csh15Hokfjs"/' deploy-full-auto.sh

echo "✅ Database credentials updated in deploy-full-auto.sh"
echo ""
echo "🔐 Database Configuration:"
echo "   Database: astroarupshastri_db"
echo "   User: astroarupshastri_user"
echo "   Password: V38VfuFS5csh15Hokfjs"
echo ""
echo "🚀 Ready to deploy! Run:"
echo "   ./deploy-full-auto.sh"
