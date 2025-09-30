# Enhanced Authentication System Setup Guide

## Overview

This guide covers the implementation of a comprehensive user authentication system with email verification, password reset, and admin user management for your astrology website.

## Features Implemented

### 🔐 Authentication Features
- **User Registration** with email verification
- **Email Verification** with secure tokens (24-hour expiry)
- **Password Reset** functionality with secure tokens (1-hour expiry)
- **Multi-language Support** for user preferences
- **Admin User Management** with full CRUD operations

### 🛡️ Security Features
- JWT-based authentication
- Secure password hashing with bcrypt
- Email verification tokens with expiration
- Password reset tokens with expiration
- Role-based access control (Admin, Editor, User)
- Protected admin routes

### 📧 Email Features
- Beautiful HTML email templates
- Email verification notifications
- Password reset notifications
- Welcome emails after verification
- Booking confirmations and updates

## Database Changes

### New Fields Added to Users Table
```sql
-- Email verification fields
is_verified BOOLEAN DEFAULT FALSE
verification_token VARCHAR(255)
verification_token_expires TIMESTAMP
reset_password_token VARCHAR(255)
reset_password_token_expires TIMESTAMP
preferred_language VARCHAR(10) DEFAULT 'en'
```

### New Table: User Verifications
```sql
CREATE TABLE user_verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    token_type VARCHAR(50) NOT NULL, -- 'email_verification' or 'password_reset'
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Backend API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user (requires email verification)
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/login` - Login (requires verified email)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/me` - Update current user info

### Admin User Management Endpoints
- `GET /api/admin/users` - Get all users with filtering
- `GET /api/admin/users/stats` - Get user statistics
- `GET /api/admin/users/{user_id}` - Get specific user
- `PUT /api/admin/users/{user_id}` - Update user
- `DELETE /api/admin/users/{user_id}` - Delete user
- `POST /api/admin/users/{user_id}/verify` - Manually verify user
- `POST /api/admin/users/{user_id}/activate` - Activate user
- `POST /api/admin/users/{user_id}/deactivate` - Deactivate user

## Environment Configuration

Add these variables to your `.env` file:

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@astrologywebsite.com
FROM_NAME=Astrology Website

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Email Verification Configuration
EMAIL_VERIFICATION_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1
```

## Setup Instructions

### 1. Database Migration
Run the migration script to add new fields and tables:
```bash
cd backend
sqlite3 astrology_website.db < migrations/add_email_verification.sql
```

### 2. Email Configuration
1. Set up Gmail App Password:
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password for your application
   - Use this password in `SMTP_PASSWORD`

2. Update environment variables with your email credentials

### 3. Create Admin User
Use the admin registration endpoint to create your first admin user:
```bash
curl -X POST http://localhost:8000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "full_name": "Admin User",
    "password": "secure_password"
  }'
```

### 4. Frontend Configuration
The frontend components are ready to use:
- `/verify-email` - Email verification page
- `/reset-password` - Password reset page
- `/admin/users` - User management dashboard

## User Registration Flow

1. **User Registration**:
   - User fills registration form with preferred language
   - Account created but inactive until email verification
   - Verification email sent automatically

2. **Email Verification**:
   - User clicks verification link in email
   - Account activated and welcome email sent
   - User can now login

3. **Login**:
   - Only verified users can login
   - JWT token provided on successful login
   - User data returned with token

## Admin User Management

### Features Available:
- **View All Users** with search and filtering
- **User Statistics** dashboard
- **Manual Email Verification** for users
- **Activate/Deactivate Users**
- **Role Management** (Admin, Editor, User)
- **User Details** viewing and editing

### Admin Dashboard Features:
- Total users count
- Verified users count
- Active users count
- Verification rate percentage
- Search by name, email, username
- Filter by role and status
- Bulk actions for user management

## Multi-Language Support

Users can select their preferred language during registration:
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Malayalam (ml)
- Kannada (kn)
- Marathi (mr)
- Gujarati (gu)
- Bengali (bn)
- Odia (or)

## Security Best Practices Implemented

1. **Password Security**:
   - Bcrypt hashing with salt rounds
   - Minimum 6 character requirement
   - Password confirmation on registration

2. **Token Security**:
   - Secure random token generation
   - Token expiration (24h for verification, 1h for reset)
   - One-time use tokens for password reset

3. **Email Security**:
   - No sensitive data in URLs
   - Expired tokens are invalidated
   - Rate limiting considerations

4. **Access Control**:
   - Role-based permissions
   - Admin-only user management
   - Protected API endpoints

## Testing the System

### 1. Test User Registration
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "password123",
    "preferred_language": "en"
  }'
```

### 2. Test Email Verification
Check the database for the verification token:
```sql
SELECT token FROM user_verifications WHERE token_type = 'email_verification';
```

Use the token to verify:
```bash
curl -X POST http://localhost:8000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN_HERE"}'
```

### 3. Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

## Troubleshooting

### Common Issues:

1. **Email not sending**:
   - Check SMTP credentials
   - Verify Gmail App Password
   - Check firewall settings

2. **Verification link not working**:
   - Check FRONTEND_URL environment variable
   - Verify token hasn't expired
   - Check database for token validity

3. **Login failing**:
   - Ensure email is verified
   - Check username/password
   - Verify user is active

### Debug Mode:
Set `DEBUG=True` in environment to see detailed error messages.

## Next Steps

1. **Multi-language Predictions**: Implement language-specific content delivery
2. **API Integration**: Connect with ClickAstro-like prediction services
3. **Advanced Analytics**: User behavior tracking and reporting
4. **Notification System**: Push notifications for predictions
5. **Mobile App**: React Native app with same authentication

## Support

For issues or questions:
1. Check the logs in the backend console
2. Verify environment variables
3. Test API endpoints with curl/Postman
4. Check database integrity

The system is now ready for production use with proper email configuration!
