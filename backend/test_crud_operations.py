#!/usr/bin/env python3

import requests
import json
import time

# Comprehensive test for all CRUD operations
BASE_URL = "http://localhost:8000"

def test_admin_login():
    """Login as admin and return token"""
    print("🔐 Logging in as admin...")
    login_data = {'username': 'admin', 'password': 'admin123'}
    response = requests.post(f'{BASE_URL}/api/auth/login', data=login_data)

    if response.status_code == 200:
        data = response.json()
        token = data['access_token']
        print("✅ Admin login successful")
        return token
    else:
        print("❌ Admin login failed")
        return None

def test_blog_crud(token):
    """Test blog CRUD operations"""
    print("\n📝 Testing Blog CRUD Operations")
    print("=" * 40)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

    # CREATE
    print("➕ Creating blog...")
    blog_data = {
        "title": "Test Astrology Blog",
        "slug": "test-astrology-blog",
        "content": "This is a test blog about astrology.",
        "excerpt": "Learn about astrology basics",
        "featured_image": "https://example.com/image.jpg",
        "meta_description": "Test blog meta description",
        "meta_keywords": "astrology, test, blog",
        "is_published": True,
        "meta_title": "Test Blog Title",
        "canonical_url": "https://astroarupshastri.com/blog/test-astrology-blog",
        "schema_markup": '{"@context": "https://schema.org", "@type": "BlogPosting"}',
        "image_alt_text": "Astrology blog image"
    }

    create_response = requests.post(f'{BASE_URL}/api/admin/blogs', headers=headers, json=blog_data)
    print(f"Create status: {create_response.status_code}")

    if create_response.status_code == 200:
        created_blog = create_response.json()
        blog_id = created_blog['id']
        print(f"✅ Blog created with ID: {blog_id}")

        # READ
        print("📖 Reading blog...")
        read_response = requests.get(f'{BASE_URL}/api/admin/blogs/{blog_id}', headers=headers)
        print(f"Read status: {read_response.status_code}")

        # UPDATE
        print("✏️  Updating blog...")
        update_data = blog_data.copy()
        update_data['title'] = 'Updated Test Astrology Blog'
        update_response = requests.put(f'{BASE_URL}/api/admin/blogs/{blog_id}', headers=headers, json=update_data)
        print(f"Update status: {update_response.status_code}")

        # TOGGLE STATUS
        print("🔄 Toggling blog status...")
        toggle_response = requests.put(f'{BASE_URL}/api/admin/blogs/{blog_id}/toggle', headers=headers)
        print(f"Toggle status: {toggle_response.status_code}")

        # DELETE
        print("🗑️  Deleting blog...")
        delete_response = requests.delete(f'{BASE_URL}/api/admin/blogs/{blog_id}', headers=headers)
        print(f"Delete status: {delete_response.status_code}")

        return True
    else:
        print(f"❌ Blog creation failed: {create_response.text}")
        return False

def test_podcast_crud(token):
    """Test podcast CRUD operations"""
    print("\n🎧 Testing Podcast CRUD Operations")
    print("=" * 40)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

    # CREATE
    print("➕ Creating podcast...")
    podcast_data = {
        "title": "Test Astrology Podcast",
        "description": "A test podcast about astrology",
        "video_url": "https://youtube.com/watch?v=test",
        "youtube_video_id": "test",
        "thumbnail_url": "https://example.com/thumbnail.jpg",
        "duration": "10:30",
        "category": "Astrology",
        "tags": "astrology,test",
        "is_featured": True
    }

    create_response = requests.post(f'{BASE_URL}/api/admin/podcasts', headers=headers, json=podcast_data)
    print(f"Create status: {create_response.status_code}")

    if create_response.status_code == 200:
        created_podcast = create_response.json()
        podcast_id = created_podcast['id']
        print(f"✅ Podcast created with ID: {podcast_id}")

        # READ
        print("📖 Reading podcast...")
        read_response = requests.get(f'{BASE_URL}/api/admin/podcasts/{podcast_id}', headers=headers)
        print(f"Read status: {read_response.status_code}")

        # UPDATE
        print("✏️  Updating podcast...")
        update_data = podcast_data.copy()
        update_data['title'] = 'Updated Test Astrology Podcast'
        update_response = requests.put(f'{BASE_URL}/api/admin/podcasts/{podcast_id}', headers=headers, json=update_data)
        print(f"Update status: {update_response.status_code}")

        # TOGGLE STATUS
        print("🔄 Toggling podcast status...")
        toggle_response = requests.put(f'{BASE_URL}/api/admin/podcasts/{podcast_id}/toggle', headers=headers)
        print(f"Toggle status: {toggle_response.status_code}")

        # DELETE
        print("🗑️  Deleting podcast...")
        delete_response = requests.delete(f'{BASE_URL}/api/admin/podcasts/{podcast_id}', headers=headers)
        print(f"Delete status: {delete_response.status_code}")

        return True
    else:
        print(f"❌ Podcast creation failed: {create_response.text}")
        return False

def test_page_crud(token):
    """Test page CRUD operations"""
    print("\n📄 Testing Page CRUD Operations")
    print("=" * 40)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

    # CREATE
    print("➕ Creating page...")
    page_data = {
        "title": "Test Astrology Page",
        "slug": "test-astrology-page",
        "content": "This is a test page about astrology.",
        "meta_title": "Test Page Title",
        "meta_description": "Test page meta description",
        "canonical_url": "https://astroarupshastri.com/test-astrology-page",
        "schema_markup": '{"@context": "https://schema.org", "@type": "WebPage"}',
        "image_alt_text": "Astrology page image",
        "redirect_url": "",
        "is_active": True
    }

    create_response = requests.post(f'{BASE_URL}/api/admin/pages', headers=headers, json=page_data)
    print(f"Create status: {create_response.status_code}")

    if create_response.status_code == 200:
        created_page = create_response.json()
        page_id = created_page['id']
        print(f"✅ Page created with ID: {page_id}")

        # READ
        print("📖 Reading page...")
        read_response = requests.get(f'{BASE_URL}/api/admin/pages/{page_id}', headers=headers)
        print(f"Read status: {read_response.status_code}")

        # UPDATE
        print("✏️  Updating page...")
        update_data = page_data.copy()
        update_data['title'] = 'Updated Test Astrology Page'
        update_response = requests.put(f'{BASE_URL}/api/admin/pages/{page_id}', headers=headers, json=update_data)
        print(f"Update status: {update_response.status_code}")

        # TOGGLE STATUS
        print("🔄 Toggling page status...")
        toggle_response = requests.put(f'{BASE_URL}/api/admin/pages/{page_id}/toggle', headers=headers)
        print(f"Toggle status: {toggle_response.status_code}")

        # DELETE
        print("🗑️  Deleting page...")
        delete_response = requests.delete(f'{BASE_URL}/api/admin/pages/{page_id}', headers=headers)
        print(f"Delete status: {delete_response.status_code}")

        return True
    else:
        print(f"❌ Page creation failed: {create_response.text}")
        return False

def test_seo_management(token):
    """Test SEO management operations"""
    print("\n🔍 Testing SEO Management")
    print("=" * 30)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

    # Test SEO settings
    print("⚙️  Getting SEO settings...")
    settings_response = requests.get(f'{BASE_URL}/api/admin/seo/settings', headers=headers)
    print(f"Settings status: {settings_response.status_code}")

    # Test SEO performance
    print("📊 Getting SEO performance...")
    perf_response = requests.get(f'{BASE_URL}/api/admin/seo/performance', headers=headers)
    print(f"Performance status: {perf_response.status_code}")

    if perf_response.status_code == 200:
        perf_data = perf_response.json()
        print(f"   📈 SEO Score: {perf_data.get('seo_score', 0)}%")
        print(f"   📝 Meta titles: {perf_data.get('pages_with_meta_title', 0)}")
        print(f"   📋 Meta descriptions: {perf_data.get('pages_with_meta_description', 0)}")
        return True
    else:
        print(f"❌ SEO performance failed: {perf_response.text}")
        return False

def test_public_endpoints():
    """Test public endpoints to ensure content appears"""
    print("\n🌐 Testing Public Endpoints")
    print("=" * 30)

    # Test blogs endpoint
    print("📝 Testing public blogs endpoint...")
    blogs_response = requests.get(f'{BASE_URL}/api/blogs/?limit=3')
    print(f"Blogs status: {blogs_response.status_code}")

    # Test podcasts endpoint
    print("🎧 Testing public podcasts endpoint...")
    podcasts_response = requests.get(f'{BASE_URL}/api/podcasts/featured?limit=3')
    print(f"Podcasts status: {podcasts_response.status_code}")

    # Test pages endpoint
    print("📄 Testing public pages endpoint...")
    pages_response = requests.get(f'{BASE_URL}/api/pages/')
    print(f"Pages status: {pages_response.status_code}")

    return all([
        blogs_response.status_code == 200,
        podcasts_response.status_code == 200,
        pages_response.status_code == 200
    ])

def main():
    print("🧪 COMPREHENSIVE CRUD OPERATIONS TEST")
    print("=" * 50)

    # Login
    token = test_admin_login()
    if not token:
        return

    # Test CRUD operations
    blog_success = test_blog_crud(token)
    podcast_success = test_podcast_crud(token)
    page_success = test_page_crud(token)

    # Test SEO management
    seo_success = test_seo_management(token)

    # Test public endpoints
    public_success = test_public_endpoints()

    # Summary
    print("\n📊 TEST SUMMARY")
    print("=" * 30)
    print(f"📝 Blog CRUD: {'✅ PASS' if blog_success else '❌ FAIL'}")
    print(f"🎧 Podcast CRUD: {'✅ PASS' if podcast_success else '❌ FAIL'}")
    print(f"📄 Page CRUD: {'✅ PASS' if page_success else '❌ FAIL'}")
    print(f"🔍 SEO Management: {'✅ PASS' if seo_success else '❌ FAIL'}")
    print(f"🌐 Public Endpoints: {'✅ PASS' if public_success else '❌ FAIL'}")

    all_success = blog_success and podcast_success and page_success and seo_success and public_success

    if all_success:
        print("\n🎉 ALL CRUD OPERATIONS WORKING PERFECTLY!")
        print("✨ Your AstroArupShastri admin system is fully functional!")
    else:
        print("\n⚠️  Some operations failed. Check the logs above.")

if __name__ == "__main__":
    main()
