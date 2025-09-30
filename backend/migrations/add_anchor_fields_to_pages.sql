-- Add anchor text and anchor link fields to pages table
-- This migration adds internal linking capabilities to pages

ALTER TABLE pages ADD COLUMN IF NOT EXISTS anchor_text VARCHAR(255);
ALTER TABLE pages ADD COLUMN IF NOT EXISTS anchor_link VARCHAR(500);

-- Add comment to explain the fields
COMMENT ON COLUMN pages.anchor_text IS 'Internal linking anchor text for SEO optimization';
COMMENT ON COLUMN pages.anchor_link IS 'URL destination for the anchor text link';
