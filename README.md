# Astro-Site: Astrology Website with Quill.js Rich Text Editor

## 🎯 Project Overview

A comprehensive astrology website built with Next.js (frontend) and FastAPI (backend) featuring:
- ✅ Quill.js rich text editor for blog post creation/editing
- ✅ Advanced blog management system
- ✅ SEO-optimized content pages
- ✅ Astrology services and consultations
- ✅ User authentication and booking system
- ✅ Admin dashboard with full CRUD operations

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build frontend
npm run build

# Start development server
npm run dev
```

### Production Deployment

```bash
# SSH to server
ssh -i ~/.ssh/id_ed25519 root@88.222.245.41

# Navigate to project
cd /root/astro

# Clone repository
git clone git@github.com:mikias1219/astro-site.git .

# Install dependencies
npm install --legacy-peer-deps
cd backend && pip install -r requirements.txt && cd ..

# Build frontend
npm run build

# Apply database migrations
mysql -u root -p your_database < backend/migrations/add_content_to_blogs.sql

# Deploy
chmod +x final-deploy.sh
./final-deploy.sh
```

## ✨ Key Features

### 1. Quill.js Rich Text Editor
- Full WYSIWYG editing with comprehensive toolbar
- Support for: bold, italic, underline, lists, links, images, code blocks, colors
- Located in: `src/components/RichTextEditor.tsx`
- Used in: Admin blog management interface

### 2. New Content Pages

**Kolkata Astrology Page** (`/kolkata-astrology/`)
- Comprehensive astrology services guide
- Vastu consultation information
- FAQ section
- Call-to-action for bookings

**Consultation Service Page** (`/services/consultation/`)
- Detailed consultation guide
- Types of astrology explained
- Accuracy and reliability information
- Online consultation details

### 3. Blog Management System
- Create, read, update, delete blog posts
- Rich text content editing with Quill
- SEO metadata management
- Featured image support
- Publishing workflow with drafts
- Search and filter capabilities

## 📁 Project Structure

```
astro-site/
├── src/
│   ├── components/
│   │   ├── RichTextEditor.tsx       # Quill.js editor component
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── app/
│   │   ├── admin/blogs/page.tsx     # Blog management admin
│   │   ├── kolkata-astrology/page.tsx  # Kolkata page
│   │   ├── services/consultation/   # Consultation page
│   │   └── ...
│   └── ...
├── backend/
│   ├── app/
│   │   ├── models.py                # Database models
│   │   ├── schemas.py               # API schemas
│   │   ├── routers/blogs.py         # Blog API routes
│   │   └── ...
│   ├── migrations/
│   │   └── add_content_to_blogs.sql # Database migration
│   └── main.py                      # FastAPI app entry
├── package.json                     # Frontend dependencies
└── README.md                        # This file
```

## 🔧 Technology Stack

### Frontend
- **Next.js 14.2.10** - React framework with server-side rendering
- **React 18.3.1** - UI library
- **React Quill 2.0.0** - Rich text editor
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety

### Backend
- **FastAPI 0.104.1** - Modern Python web framework
- **SQLAlchemy 2.0.23** - ORM for database interactions
- **Uvicorn** - ASGI server
- **Python 3.8+** - Programming language

### Database
- **SQLite** - Development database
- **MySQL** - Production database

## 📊 Database Schema

### Blog Model
```python
- id (Integer, Primary Key)
- title (String)
- slug (String, Unique)
- description (Text)          # SEO meta description
- content (Text)              # Rich HTML content from Quill
- featured_image (String)
- is_published (Boolean)
- published_at (DateTime)
- created_at (DateTime)
- updated_at (DateTime)
- author_id (Foreign Key)
- view_count (Integer)
```

## 🔑 API Endpoints

### Blog Management
```
GET    /api/blogs                    # Get all published blogs
GET    /api/blogs/{id}               # Get specific blog
GET    /api/blogs/slug/{slug}        # Get blog by URL slug
POST   /api/admin/blogs              # Create blog (Admin only)
PUT    /api/admin/blogs/{id}         # Update blog (Admin only)
DELETE /api/admin/blogs/{id}         # Delete blog (Admin only)
```

## 🛠️ Configuration

### Environment Variables

Create `.env.local` in the project root:

```env
# Frontend
NEXT_PUBLIC_API_URL=https://astroarupshastri.com/api
NEXT_PUBLIC_SITE_URL=https://astroarupshastri.com

# Backend
DATABASE_URL=mysql://user:password@localhost/astrology_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📝 Using the Quill Editor

### In Admin Panel

1. Go to `/admin/blogs`
2. Click "Create New Blog" or edit existing
3. Fill in blog details:
   - **Title**: Blog headline
   - **Slug**: URL-friendly name (e.g., `my-blog-post`)
   - **Meta Description**: SEO description (max 160 chars)
   - **Content**: Use Quill editor for rich formatting
   - **Featured Image**: Upload or link to image
4. Click "Publish" or save as draft

### Quill Editor Toolbar Features

| Feature | Options |
|---------|---------|
| Formatting | Bold, Italic, Underline, Strikethrough |
| Headers | H1, H2, H3 |
| Lists | Ordered, Bullet |
| Alignment | Left, Center, Right, Justify |
| Blocks | Blockquote, Code Block |
| Media | Links, Images |
| Colors | Text Color, Background Color |
| Clean | Remove all formatting |

## 🚀 Deployment Steps

### Prerequisites
- SSH access to server (88.222.245.41)
- Git configured with SSH key
- MySQL/database credentials
- Node.js and Python 3 installed on server

### Step 1: Connect to Server
```bash
ssh -i ~/.ssh/id_ed25519 root@88.222.245.41
```

### Step 2: Clone Repository
```bash
cd /root/astro
git clone git@github.com:mikias1219/astro-site.git .
```

### Step 3: Install Dependencies
```bash
npm install --legacy-peer-deps
cd backend
pip install -r requirements.txt
cd ..
```

### Step 4: Build Frontend
```bash
npm run build
```

### Step 5: Apply Database Migrations
```bash
mysql -u root -p your_database < backend/migrations/add_content_to_blogs.sql
```

### Step 6: Start Services
```bash
chmod +x final-deploy.sh
./final-deploy.sh
```

### Step 7: Verify Deployment
```bash
# Check frontend
curl -I https://astroarupshastri.com

# Check API
curl -I https://astroarupshastri.com/api/blogs
```

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Homepage loads at https://astroarupshastri.com
- [ ] Blog pages accessible
- [ ] Admin panel at /admin/blogs
- [ ] Quill editor loads in blog form
- [ ] New content pages visible:
  - [ ] /kolkata-astrology/
  - [ ] /services/consultation/
- [ ] API endpoints responding
- [ ] Database migrations applied
- [ ] SSL certificate working (HTTPS)

## 🐛 Troubleshooting

### Build Fails
```bash
npm install --legacy-peer-deps --force
npm run build
```

### Database Migration Failed
```bash
# Check if column exists
mysql -u root -p -e "SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME='blogs' AND COLUMN_NAME='content';"

# Run migration again if needed
mysql -u root -p your_database < backend/migrations/add_content_to_blogs.sql
```

### Quill Editor Not Loading
- Check browser console for errors
- Verify component is imported correctly
- Ensure npm dependencies are installed

### Backend Connection Issues
```bash
# Test API connection
curl -I http://localhost:8000/api/blogs

# Check if port is in use
lsof -i :8000
```

## 📚 Related Documentation

- **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **QUILL_IMPLEMENTATION.md** - Technical implementation details
- **IMPLEMENTATION_SUMMARY.md** - Complete project summary

## 🔄 Database Migration

The migration file adds rich content support to blogs:

```sql
ALTER TABLE blogs ADD COLUMN content LONGTEXT;
```

This allows storage of HTML content from the Quill editor while maintaining backward compatibility with existing blogs.

## 👥 User Roles

- **Admin** - Full access to all features
- **Editor** - Can create and edit blogs
- **User** - Can view content and book services

## 📈 SEO Features

All content pages include:
- Meta titles and descriptions
- Open Graph tags
- Canonical URLs
- Structured heading hierarchy
- Image alt text
- Internal linking
- Schema markup support

## 🎨 Design System

- **Color Scheme**: Purple and pink gradients
- **Typography**: Clean, readable fonts
- **Components**: Reusable React components
- **Styling**: Tailwind CSS utility classes
- **Responsive**: Mobile-first design

## 🔐 Security Features

- JWT authentication for admin access
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review error logs: `pm2 logs`
3. Check system resources: `top`, `df -h`
4. Verify network: `netstat -tulpn | grep LISTEN`

## �� License

This project is proprietary and confidential.

## 👤 Author

**Created**: October 27, 2024
**Status**: ✅ Production Ready

---

**Version**: 1.0.0
**Last Updated**: October 27, 2024

🚀 Ready for production deployment!
