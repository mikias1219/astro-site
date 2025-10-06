# 📚 AstroArupShastri Admin Panel - Complete User Guide

Welcome to your website admin panel! This guide will help you manage your website content like a pro.

---

## 🎯 Table of Contents

1. [Getting Started](#getting-started)
2. [Google Analytics & Search Console Setup](#google-analytics--search-console-setup)
3. [Managing Pages](#managing-pages)
4. [Managing Blog Posts](#managing-blog-posts)
5. [Adding Images](#adding-images)
6. [SEO Optimization](#seo-optimization)
7. [URL Redirects](#url-redirects)
8. [FAQs](#faqs)

---

## 🚀 Getting Started

### Accessing the Admin Panel

1. Go to: `https://astroarupshastri.com/admin/login`
2. Enter your admin credentials
3. Click "Login"

### Admin Dashboard Overview

After logging in, you'll see:
- **Pages Management**: Create and edit website pages
- **Blog Management**: Write and publish blog posts
- **SEO Management**: Optimize your site for search engines
- **Bookings**: View consultation bookings
- **Users**: Manage registered users

---

## 📊 Google Analytics & Search Console Setup

### Where to Find It
Navigate to: **Admin Panel → SEO → Analytics Tab**

### Google Analytics (GA4) Setup

**Step-by-Step Instructions:**

1. **Get Your Measurement ID:**
   - Go to [Google Analytics](https://analytics.google.com)
   - Click "Admin" (bottom left)
   - Select or create a GA4 property
   - Go to "Data Streams" → "Web"
   - Copy your Measurement ID (starts with `G-`)

2. **Add to Your Website:**
   - Go to SEO → Analytics tab
   - Paste your Measurement ID in the "Google Analytics" field
   - Check "Enabled"
   - Click "Save Analytics Settings"

3. **Verification:**
   - Wait 24 hours
   - Check Google Analytics dashboard to see if data is coming in

**✅ Once enabled, tracking code is automatically added to ALL pages!**

### Google Search Console Setup

**Step-by-Step Instructions:**

1. **Add Your Property:**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Click "Add Property"
   - Select "URL prefix"
   - Enter: `https://astroarupshastri.com`

2. **Verify Ownership (Choose One Method):**

   **Method A: HTML Meta Tag (Recommended)**
   - Select "HTML tag" verification
   - Copy the meta tag provided
   - Contact your developer to add it to the homepage
   - Click "Verify"

   **Method B: Google Analytics**
   - If you've already set up GA4 (above)
   - Select "Google Analytics" verification method
   - Click "Verify" (instant!)

   **Method C: HTML File Upload**
   - Download the verification file
   - Upload to your server's root directory
   - Click "Verify"

3. **Submit Your Sitemap:**
   - After verification, go to "Sitemaps" in left menu
   - Enter: `sitemap.xml`
   - Click "Submit"

4. **Enable in Admin Panel:**
   - Go to SEO → Analytics tab
   - Check "Enabled" for Google Search Console
   - Click "Save Analytics Settings"

**💡 Pro Tip:** Data may take 24-48 hours to appear in Search Console

---

## 📄 Managing Pages

### Where to Find It
**Admin Panel → Pages**

### Creating a New Page

1. Click "➕ Create New Page"
2. Fill in the form:

   **Basic Information:**
   - **Page Title**: The main heading (e.g., "About Us")
   - **URL Slug**: URL-friendly version (e.g., "about-us")

   **SEO Information:**
   - **Meta Title**: Title for search engines (50-60 characters)
   - **Meta Description**: Brief description for search results (150-160 characters)
   - **Canonical URL**: Full page URL (e.g., `https://astroarupshastri.com/about-us`)
   - **Image Alt Text**: Description for images on this page

   **Content:**
   - **Page Content**: Write your page content here
     - You can use HTML if you know it
     - Or write plain text
     - Supports headings, paragraphs, lists

   **Advanced:**
   - **Schema Markup**: JSON-LD code (auto-generated if left empty)
   - **Redirect URL**: If this replaces an old page, enter old URL

3. Check "✅ Page is active" to publish immediately
4. Click "🚀 Publish Page"

### Editing an Existing Page

1. Find your page in the list
2. Click the "✏️ Edit" button
3. Make your changes
4. Click "💾 Update Page"

### Making a Page Live/Hidden

- Click the status button (Active/Inactive) to toggle
- Green = Live on website
- Gray = Hidden from public

### Deleting a Page

1. Click the "🗑️ Delete" button
2. Confirm deletion
3. **⚠️ Warning:** This cannot be undone!

---

## 📝 Managing Blog Posts

### Where to Find It
**Admin Panel → Blogs**

### Creating a New Blog Post

1. Click "➕ Create New Blog"
2. Fill in the form:

   **Basic Information:**
   - **Blog Title**: Catchy, descriptive title
   - **URL Slug**: URL-friendly version (e.g., "vedic-astrology-guide")
   - **Description**: Full blog content (supports HTML)

   **Featured Image:**
   - **Option 1 - Upload File:**
     - Click "Choose File"
     - Select image from your computer
     - Alt text is auto-generated from filename
   
   - **Option 2 - Image URL:**
     - Enter direct image URL
     - Alt text is auto-generated from URL

   - **Image Alt Text**: Edit if needed for better accessibility

   **Publishing:**
   - Check "Publish immediately" to go live now
   - Leave unchecked to save as draft

3. Click "🚀 Publish Blog"

### Editing a Blog Post

1. Find your blog in the list
2. Click "✏️ Edit"
3. Make changes
4. Click "💾 Update Blog"

### Publishing/Unpublishing

- Click the status badge to toggle
- "✅ Published" = Live on website
- "📝 Draft" = Saved but not public

---

## 🖼️ Adding Images

### Image Upload Methods

**For Blog Posts:**
- Upload during blog creation (see above)
- Images are automatically optimized

**For Pages:**
- Upload during page creation
- Or reference existing images via URL

### Image Best Practices

✅ **DO:**
- Use descriptive filenames: `astrology-consultation.jpg`
- Keep file size under 500KB
- Use JPG for photos, PNG for graphics
- Always add alt text for accessibility

❌ **DON'T:**
- Use generic names: `IMG_1234.jpg`
- Upload massive files (slows down site)
- Forget alt text (bad for SEO)

### Auto-Generated Alt Text

When you upload an image with filename:
- `vedic-astrology-reading.jpg`

The system automatically generates:
- Alt Text: "Vedic Astrology Reading"

You can edit this to be more descriptive!

---

## 🔍 SEO Optimization

### Where to Find It
**Admin Panel → SEO**

### Pages Tab

View and optimize SEO for all your pages:
- ✅ Green = SEO data present
- ⭕ Gray = Missing SEO data
- Click "Edit SEO" to update

### Blogs Tab

Manage SEO for all blog posts:
- Check Meta Title and Description status
- Click "Edit SEO" to optimize
- View publication status

### Images Tab

View all images on your site:
- Check alt text status
- See if images are optimized
- Click "Edit" to update

### Redirects Tab

Manage URL redirects:

**When to Use:**
- You changed a page URL
- Old content moved to new location
- Avoiding 404 errors

**How to Create:**
1. Click "➕ Add Redirect"
2. **From URL**: Old URL (e.g., `/old-page`)
3. **To URL**: New URL (e.g., `/new-page`)
4. **Redirect Type**: 
   - 301 = Permanent (recommended)
   - 302 = Temporary
5. Check "Active"
6. Click "Create Redirect"

---

## 🎨 Content Editing Tips

### Can You Edit Content Yourself?

**YES!** You can edit all content yourself through the admin panel.

### Writing Page Content

**Basic Text:**
```
This is a paragraph.

This is another paragraph.
```

**Headings:**
```
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Smaller Heading</h3>
```

**Bold & Italic:**
```
<strong>Bold text</strong>
<em>Italic text</em>
```

**Links:**
```
<a href="/services">Our Services</a>
<a href="https://google.com">Google</a>
```

**Lists:**
```
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>

<ol>
  <li>Step 1</li>
  <li>Step 2</li>
</ol>
```

### Internal vs External Links

**Internal Links** (same website):
```html
<a href="/about">About Us</a>
<a href="/services/consultation">Book Consultation</a>
```

**External Links** (other websites):
```html
<a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>
```

### Adding Table of Contents

**Manual Method:**
```html
<h2 id="section-1">Section 1</h2>
<!-- Your content -->

<h2 id="section-2">Section 2</h2>
<!-- Your content -->

<!-- Table of Contents at top -->
<ul>
  <li><a href="#section-1">Section 1</a></li>
  <li><a href="#section-2">Section 2</a></li>
</ul>
```

**Automatic Method** (Coming Soon):
- Will auto-generate from H2 and H3 headings
- Just add headings, TOC appears automatically

---

## 🎬 Video Tutorial (Recommended)

**Coming Soon:** We're creating video tutorials showing:
- How to create your first blog post
- How to edit page content with rich text
- How to add images and optimize them
- Complete SEO setup walkthrough

**For Now:** Follow this written guide, and contact support if you need help!

---

## ❓ FAQs

### Q: How many pages can I create?
**A:** Unlimited! Create as many as you need.

### Q: Can I schedule blog posts for future?
**A:** Not yet, but coming soon. For now, save as draft and publish later.

### Q: How do I change the homepage content?
**A:** Edit the page with slug "home" or contact your developer.

### Q: What if I make a mistake?
**A:** Just edit the page/blog again and fix it. Changes are saved immediately.

### Q: Can I see how many pages are showing?
**A:** Yes! The pages list shows pagination at the bottom. Check "4 of 4 pages" display.

### Q: How do I add H1-H6 headings?
**A:** Use HTML tags: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`

### Q: Can I preview before publishing?
**A:** Not yet. Save as inactive/draft first, then check on live site before activating.

### Q: Images not uploading?
**A:** 
- Check file size (max 5MB)
- Use JPG or PNG format
- Try using image URL instead
- Clear browser cache

### Q: Lost admin password?
**A:** Use "Forgot Password" on login page, or contact your developer.

### Q: How to logout?
**A:** Click "Logout" button in top right of admin panel.

---

## 📞 Need Help?

**Contact Support:**
- Email: support@astroarupshastri.com
- Phone: +91 91473 27266

**Technical Issues:**
- Contact your developer
- Provide screenshots of any errors
- Mention which browser you're using

---

## 🎉 Congratulations!

You now know how to:
✅ Set up Google Analytics & Search Console  
✅ Create and edit pages  
✅ Write and publish blog posts  
✅ Upload and optimize images  
✅ Manage SEO settings  
✅ Set up URL redirects  

**Keep this guide bookmarked for reference!**

---

*Last Updated: October 2025*  
*Version: 1.0*

