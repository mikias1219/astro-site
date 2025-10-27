-- Add content field to blogs table for rich HTML content from Quill editor
ALTER TABLE blogs ADD COLUMN content LONGTEXT;

-- Migration timestamp: This adds support for rich text blog content
