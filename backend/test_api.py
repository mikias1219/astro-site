"""
Simple test script to demonstrate API functionality
Run this after starting the server to test basic functionality
"""

import requests
import json
from datetime import datetime, timedelta

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test health check endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health Check: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_register_and_login():
    """Test user registration and login"""
    # Register a new user
    register_data = {
        "email": "test@example.com",
        "username": "testuser",
        "full_name": "Test User",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
    print(f"Registration: {response.status_code}")
    if response.status_code == 200:
        print(f"User created: {response.json()}")
    else:
        print(f"Registration failed: {response.text}")
    print()
    
    # Login
    login_data = {
        "username": "testuser",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
    print(f"Login: {response.status_code}")
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"Login successful, token: {token[:20]}...")
        return token
    else:
        print(f"Login failed: {response.text}")
        return None

def test_services(token):
    """Test services endpoints"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get services
    response = requests.get(f"{BASE_URL}/api/services/", headers=headers)
    print(f"Get Services: {response.status_code}")
    print(f"Services: {response.json()}")
    print()

def test_create_service(token):
    """Test creating a service (requires admin/editor role)"""
    headers = {"Authorization": f"Bearer {token}"}
    
    service_data = {
        "name": "Astrology Consultation",
        "description": "Personal astrology consultation with expert astrologer",
        "service_type": "consultation",
        "price": 99.99,
        "duration_minutes": 60,
        "features": '["Personalized reading", "Birth chart analysis", "Future predictions"]'
    }
    
    response = requests.post(f"{BASE_URL}/api/services/", json=service_data, headers=headers)
    print(f"Create Service: {response.status_code}")
    if response.status_code == 200:
        service = response.json()
        print(f"Service created: {service}")
        return service["id"]
    else:
        print(f"Create service failed: {response.text}")
        return None

def test_create_booking(token, service_id=None):
    """Test creating a booking"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # If no service_id provided, try to get one from existing services
    if not service_id:
        response = requests.get(f"{BASE_URL}/api/services/", headers=headers)
        if response.status_code == 200 and response.json():
            service_id = response.json()[0]["id"]
        else:
            print("No services available for booking")
            return None
    
    booking_data = {
        "service_id": service_id,
        "booking_date": (datetime.now() + timedelta(days=7)).isoformat(),
        "booking_time": "14:00",
        "customer_name": "Test Customer",
        "customer_email": "customer@example.com",
        "customer_phone": "+1234567890",
        "birth_date": "1990-01-01T00:00:00",
        "birth_time": "12:00",
        "birth_place": "New York, NY",
        "notes": "Test booking"
    }
    
    response = requests.post(f"{BASE_URL}/api/bookings/", json=booking_data, headers=headers)
    print(f"Create Booking: {response.status_code}")
    if response.status_code == 200:
        booking = response.json()
        print(f"Booking created: {booking}")
        return booking["id"]
    else:
        print(f"Create booking failed: {response.text}")
        return None

def test_pages(token):
    """Test pages endpoints"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get pages
    response = requests.get(f"{BASE_URL}/api/pages/")
    print(f"Get Pages: {response.status_code}")
    print(f"Pages: {response.json()}")
    print()

def test_create_page(token):
    """Test creating a page"""
    headers = {"Authorization": f"Bearer {token}"}
    
    page_data = {
        "title": "About Us",
        "slug": "about-us",
        "content": "This is the about us page content.",
        "excerpt": "Learn more about our astrology services",
        "is_published": True
    }
    
    response = requests.post(f"{BASE_URL}/api/pages/", json=page_data, headers=headers)
    print(f"Create Page: {response.status_code}")
    if response.status_code == 200:
        page = response.json()
        print(f"Page created: {page}")
        return page["id"]
    else:
        print(f"Create page failed: {response.text}")
        return None

def test_seo_endpoints():
    """Test SEO endpoints"""
    # Get sitemap
    response = requests.get(f"{BASE_URL}/api/seo/sitemap.xml")
    print(f"Get Sitemap: {response.status_code}")
    print(f"Sitemap content: {response.text[:200]}...")
    print()
    
    # Get robots.txt
    response = requests.get(f"{BASE_URL}/api/seo/robots.txt")
    print(f"Get Robots.txt: {response.status_code}")
    print(f"Robots.txt content: {response.text}")
    print()

def main():
    """Run all tests"""
    print("Testing Astrology Website API")
    print("=" * 50)
    
    # Test health check
    test_health_check()
    
    # Test authentication
    token = test_register_and_login()
    if not token:
        print("Authentication failed, stopping tests")
        return
    
    # Test services
    test_services(token)
    
    # Test creating service (may fail if user is not admin/editor)
    service_id = test_create_service(token)
    
    # Test booking
    booking_id = test_create_booking(token, service_id)
    
    # Test pages
    test_pages(token)
    page_id = test_create_page(token)
    
    # Test SEO endpoints
    test_seo_endpoints()
    
    print("=" * 50)
    print("Tests completed!")
    print(f"API Documentation available at: {BASE_URL}/docs")

if __name__ == "__main__":
    main()
