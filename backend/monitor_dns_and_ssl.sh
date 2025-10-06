#!/bin/bash
echo "🔍 MONITORING DNS CHANGES FOR astroarupshastri.com"
echo "⏳ Checking every 60 seconds..."
echo "🎯 Target IP: 102.208.98.142"
echo "Current IP: $(nslookup astroarupshastri.com 2>/dev/null | grep -A 1 "Name:" | tail -1 | awk '{print $2}')"
echo ""

while true; do
    CURRENT_IP=$(nslookup astroarupshastri.com 2>/dev/null | grep -A 1 "Name:" | tail -1 | awk '{print $2}')
    
    if [ "$CURRENT_IP" = "102.208.98.142" ]; then
        echo "✅ DNS UPDATED! Domain now points to our server!"
        echo "🚀 Running SSL certificate setup..."
        
        sudo certbot --nginx -d astroarupshastri.com -d www.astroarupshastri.com --non-interactive --agree-tos --email admin@astroarupshastri.com --redirect
        
        if [ $? -eq 0 ]; then
            echo "🎉 SSL CERTIFICATES INSTALLED SUCCESSFULLY!"
            echo "🌐 HTTPS is now enabled for astroarupshastri.com"
            echo ""
            echo "🔐 ADMIN ACCESS:"
            echo "   URL: https://astroarupshastri.com/admin"
            echo "   Username: admin"
            echo "   Password: admin123"
            echo ""
            echo "🎊 WEBSITE IS NOW FULLY LIVE WITH HTTPS!"
            break
        else
            echo "❌ SSL setup failed. Check the logs above."
            echo "🔄 Retrying in 5 minutes..."
            sleep 300
        fi
    else
        echo "$(date '+%H:%M:%S') - Still pointing to: $CURRENT_IP (waiting for 102.208.98.142)"
        sleep 60
    fi
done
