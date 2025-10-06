-- Migration to simplify blogs table: replace content and excerpt with description
-- This migration assumes you're starting fresh or can recreate the blogs table

-- First, backup existing blogs data if any
CREATE TABLE IF NOT EXISTS blogs_backup AS SELECT * FROM blogs;

-- Drop and recreate blogs table with new simplified structure
DROP TABLE IF EXISTS blogs;

CREATE TABLE blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    featured_image VARCHAR(500),
    is_published BOOLEAN DEFAULT 0,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER,
    view_count INTEGER DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Create index on slug for faster lookups
CREATE INDEX idx_blogs_slug ON blogs(slug);

-- Insert sample blog data
INSERT INTO blogs (title, slug, description, featured_image, is_published, published_at, author_id) VALUES
('Understanding Your Zodiac Sign', 'understanding-your-zodiac-sign', 'Learn about the 12 zodiac signs and what they reveal about your personality, strengths, and life path. Discover how astrology can guide your decisions.', '/images/zodiac-guide.jpg', 1, '2024-01-15 10:00:00', 1),
('The Power of Gemstones in Astrology', 'power-of-gemstones-astrology', 'Explore how different gemstones correspond to planetary energies and can enhance your life. Learn about wearing the right gemstones for maximum benefits.', '/images/gemstones-guide.jpg', 1, '2024-01-20 14:30:00', 1),
('Kundli Matching for Marriage', 'kundli-matching-marriage', 'Understanding the importance of horoscope matching before marriage. Learn about the 36 points system and what makes a compatible match.', '/images/kundli-matching.jpg', 1, '2024-01-25 09:15:00', 1),
('Numerology: Numbers That Shape Your Life', 'numerology-numbers-shape-life', 'Discover how numbers influence your personality and life events. Learn about life path numbers, destiny numbers, and their meanings.', '/images/numerology-guide.jpg', 1, '2024-02-01 16:45:00', 1),
('Daily Panchang and Auspicious Times', 'daily-panchang-auspicious-times', 'Learn about daily Panchang calculations and how to find the most auspicious times for important activities and ceremonies.', '/images/panchang-guide.jpg', 1, '2024-02-05 11:20:00', 1);
