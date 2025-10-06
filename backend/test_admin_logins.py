#!/usr/bin/env python3

import requests
import json

# Test login functionality for multiple admin users
BASE_URL = "http://localhost:8000"

def test_admin_login(username, password, description):
    print(f"\n🔐 Testing {description}...")
    print(f"   Username: {username}")

    # Login attempt
    login_data = {
        "username": username,
        "password": password
    }

    try:
        login_response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data, timeout=10)

        if login_response.status_code == 200:
            login_data = login_response.json()
            access_token = login_data.get("access_token")
            user_data = login_data.get("user", {})

            print("   ✅ Login successful!")
            print(f"   🔑 Access token: {access_token[:30]}..." if access_token else "   ❌ No access token")
            print(f"   👤 User: {user_data.get('username')} ({user_data.get('email')})")
            print(f"   🛡️  Role: {user_data.get('role')}")

            # Test accessing admin endpoint
            if access_token:
                headers = {"Authorization": f"Bearer {access_token}"}
                admin_response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=headers, timeout=10)

                if admin_response.status_code == 200:
                    print("   ✅ Admin dashboard access: SUCCESS")
                else:
                    print(f"   ❌ Admin dashboard access: FAILED ({admin_response.status_code})")

            return True
        else:
            error_data = login_response.json()
            print(f"   ❌ Login failed: {login_response.status_code}")
            print(f"   📝 Error: {error_data.get('detail', 'Unknown error')}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"   ❌ Connection error: {e}")
        return False

def main():
    print("🧪 TESTING MULTIPLE ADMIN LOGIN FUNCTIONALITY")
    print("=" * 50)

    # Test first admin
    admin1_success = test_admin_login("admin", "admin123", "Primary Admin (admin)")

    # Test second admin
    admin2_success = test_admin_login("admin2", "admin123", "Secondary Admin (admin2)")

    # Test invalid login
    print("\n🚫 Testing Invalid Login...")
    invalid_success = test_admin_login("nonexistent", "wrongpass", "Invalid User")

    # Summary
    print("\n📊 LOGIN TEST SUMMARY")
    print("=" * 30)
    print(f"   Primary Admin: {'✅ PASS' if admin1_success else '❌ FAIL'}")
    print(f"   Secondary Admin: {'✅ PASS' if admin2_success else '❌ FAIL'}")
    print(f"   Invalid User: {'⚠️  PASS (expected fail)' if not invalid_success else '❌ FAIL (should have failed)'}")

    if admin1_success and admin2_success and not invalid_success:
        print("\n🎉 ALL TESTS PASSED! Multi-admin system working correctly!")
    else:
        print("\n⚠️  Some tests failed. Check the authentication system.")

if __name__ == "__main__":
    main()
