#!/usr/bin/env python3

import requests
import json

# Test the change-password endpoint
BASE_URL = "http://localhost:8000"

def test_change_password():
    # First, login to get access token
    login_data = {
        "username": "admin",
        "password": "admin123"
    }

    print("🔐 Logging in...")
    login_response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)

    if login_response.status_code == 200:
        login_data = login_response.json()
        access_token = login_data["access_token"]
        print("✅ Login successful")

        # Now test change-password endpoint
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        change_password_data = {
            "current_password": "admin123",
            "new_password": "admin123456",
            "confirm_password": "admin123456"
        }

        print("🔑 Testing change-password endpoint...")
        change_response = requests.post(
            f"{BASE_URL}/api/auth/me/change-password",
            headers=headers,
            json=change_password_data
        )

        print(f"Status Code: {change_response.status_code}")
        print(f"Response: {change_response.text}")

        if change_response.status_code == 200:
            print("✅ Change-password endpoint working!")
        else:
            print("❌ Change-password endpoint failed")
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")

if __name__ == "__main__":
    test_change_password()
