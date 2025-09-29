"""
Comprehensive integration test for the astrology website API
Tests all endpoints to ensure they work correctly
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("🔍 Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    print("✅ Health check passed")

def test_services():
    """Test services endpoints"""
    print("🔍 Testing services...")
    
    # Get all services
    response = requests.get(f"{BASE_URL}/api/services/")
    assert response.status_code == 200
    services = response.json()
    assert len(services) > 0
    print(f"✅ Found {len(services)} services")
    
    # Get specific service
    if services:
        service_id = services[0]['id']
        response = requests.get(f"{BASE_URL}/api/services/{service_id}")
        assert response.status_code == 200
        print(f"✅ Service {service_id} retrieved successfully")

def test_authentication():
    """Test authentication endpoints"""
    print("🔍 Testing authentication...")
    
    # Login
    response = requests.post(f"{BASE_URL}/api/auth/login", 
                           data={"username": "testuser", "password": "test123"})
    assert response.status_code == 200
    token_data = response.json()
    token = token_data["access_token"]
    print("✅ Login successful")
    
    # Get user info
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["username"] == "testuser"
    print("✅ User info retrieved successfully")
    
    return token

def test_bookings(token):
    """Test booking endpoints"""
    print("🔍 Testing bookings...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get user's bookings
    response = requests.get(f"{BASE_URL}/api/bookings/my-bookings", headers=headers)
    assert response.status_code == 200
    bookings = response.json()
    print(f"✅ User has {len(bookings)} bookings")
    
    # Create a new booking
    booking_data = {
        "service_id": 1,
        "booking_date": (datetime.now() + timedelta(days=7)).isoformat(),
        "booking_time": "14:00",
        "customer_name": "Test Customer",
        "customer_email": "test@example.com",
        "customer_phone": "+1234567890",
        "birth_date": "1990-01-01T00:00:00",
        "birth_time": "12:00",
        "birth_place": "Test City",
        "notes": "Test booking"
    }
    
    response = requests.post(f"{BASE_URL}/api/bookings/", 
                           json=booking_data, headers=headers)
    assert response.status_code == 200
    booking = response.json()
    print(f"✅ Booking created with ID: {booking['id']}")
    
    return booking['id']

def test_admin_endpoints():
    """Test admin endpoints"""
    print("🔍 Testing admin endpoints...")
    
    # Login as admin
    response = requests.post(f"{BASE_URL}/api/auth/login", 
                           data={"username": "admin", "password": "admin123"})
    assert response.status_code == 200
    token_data = response.json()
    admin_token = token_data["access_token"]
    print("✅ Admin login successful")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Get dashboard stats
    response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=headers)
    assert response.status_code == 200
    stats = response.json()
    print(f"✅ Dashboard stats retrieved: {stats['total_users']} users, {stats['total_bookings']} bookings")
    
    # Get all users
    response = requests.get(f"{BASE_URL}/api/admin/users", headers=headers)
    assert response.status_code == 200
    users = response.json()
    print(f"✅ Retrieved {len(users)} users")
    
    # Get booking stats
    response = requests.get(f"{BASE_URL}/api/admin/bookings/stats", headers=headers)
    assert response.status_code == 200
    booking_stats = response.json()
    print("✅ Booking statistics retrieved")
    
    return admin_token

def test_pages():
    """Test pages endpoints"""
    print("🔍 Testing pages...")
    
    response = requests.get(f"{BASE_URL}/api/pages/")
    assert response.status_code == 200
    pages = response.json()
    print(f"✅ Found {len(pages)} pages")

def test_blogs():
    """Test blogs endpoints"""
    print("🔍 Testing blogs...")
    
    response = requests.get(f"{BASE_URL}/api/blogs/")
    assert response.status_code == 200
    blogs = response.json()
    print(f"✅ Found {len(blogs)} blogs")

def test_faqs():
    """Test FAQs endpoints"""
    print("🔍 Testing FAQs...")
    
    response = requests.get(f"{BASE_URL}/api/faqs/")
    assert response.status_code == 200
    faqs = response.json()
    print(f"✅ Found {len(faqs)} FAQs")

def test_testimonials():
    """Test testimonials endpoints"""
    print("🔍 Testing testimonials...")
    
    response = requests.get(f"{BASE_URL}/api/testimonials/")
    assert response.status_code == 200
    testimonials = response.json()
    print(f"✅ Found {len(testimonials)} testimonials")

def test_seo():
    """Test SEO endpoints"""
    print("🔍 Testing SEO...")
    
    # Test sitemap
    response = requests.get(f"{BASE_URL}/api/seo/sitemap.xml")
    assert response.status_code == 200
    print("✅ Sitemap generated successfully")
    
    # Test robots.txt
    response = requests.get(f"{BASE_URL}/api/seo/robots.txt")
    assert response.status_code == 200
    print("✅ Robots.txt generated successfully")

def main():
    """Run all integration tests"""
    print("🚀 Starting Astrology Website API Integration Tests")
    print("=" * 60)
    
    try:
        # Basic endpoints
        test_health()
        test_services()
        test_pages()
        test_blogs()
        test_faqs()
        test_testimonials()
        test_seo()
        
        # Authentication and user features
        token = test_authentication()
        booking_id = test_bookings(token)
        
        # Admin features
        admin_token = test_admin_endpoints()
        
        print("=" * 60)
        print("🎉 All integration tests passed successfully!")
        print("\n📊 Test Summary:")
        print("- ✅ Health check working")
        print("- ✅ Services API working")
        print("- ✅ Authentication working")
        print("- ✅ Booking system working")
        print("- ✅ Admin dashboard working")
        print("- ✅ Content management working")
        print("- ✅ SEO features working")
        print(f"\n🌐 Frontend should be available at: http://localhost:3000")
        print(f"📚 API Documentation: http://localhost:8000/docs")
        print(f"🔧 Admin Dashboard: http://localhost:3000/admin")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
