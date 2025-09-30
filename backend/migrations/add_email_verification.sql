-- Migration: Add email verification fields to users table
-- Date: 2025-01-27

-- Add new columns to users table
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN verification_token_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255);
ALTER TABLE users ADD COLUMN reset_password_token_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en';

-- Create user_verifications table
CREATE TABLE IF NOT EXISTS user_verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    token_type VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_verifications_user_id ON user_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verifications_token ON user_verifications(token);
CREATE INDEX IF NOT EXISTS idx_user_verifications_token_type ON user_verifications(token_type);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Update existing users to be verified (for backward compatibility)
-- Only update if they are currently active
UPDATE users SET is_verified = TRUE WHERE is_active = TRUE;

-- Set default is_active to FALSE for new registrations (email verification required)
-- This will be handled in the application code
