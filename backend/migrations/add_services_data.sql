-- Migration to add basic services data for first trial
-- Insert sample astrology consultation services

INSERT INTO services (name, description, service_type, price, duration_minutes, is_active, features) VALUES
('Basic Astrology Consultation', 'Comprehensive birth chart analysis and life guidance based on Vedic astrology principles', 'consultation', 1500.00, 60, 1, '["Birth chart analysis", "Life guidance", "Career advice", "Relationship guidance", "Health insights"]'),
('Detailed Kundli Analysis', 'Complete Kundli analysis with planetary positions, doshas, and yogas', 'kundli', 2000.00, 90, 1, '["Complete birth chart", "Planetary positions", "Dosha analysis", "Yogas identification", "Remedies suggestions"]'),
('Horoscope Matching', 'Comprehensive compatibility analysis for marriage proposals', 'matching', 2500.00, 75, 1, '["36 Guna matching", "Manglik dosha check", "Compatibility score", "Remedies for doshas", "Detailed report"]'),
('Gemstone Consultation', 'Personalized gemstone recommendations based on birth chart', 'gemstone', 1200.00, 45, 1, '["Gemstone analysis", "Planetary recommendations", "Wearing instructions", "Mantra guidance"]'),
('Numerology Reading', 'Complete numerology analysis including life path, destiny, and soul urge numbers', 'numerology', 1000.00, 45, 1, '["Life path number", "Destiny number", "Soul urge number", "Lucky numbers", "Name analysis"]'),
('Daily Panchang Consultation', 'Auspicious timing and Panchang guidance for important events', 'panchang', 800.00, 30, 1, '["Auspicious timings", "Festival guidance", "Muhurta selection", "Daily predictions"]'),
('Voice Report', 'Detailed audio report with personalized astrology insights', 'voice_report', 1800.00, 60, 1, '["Audio report", "Personalized guidance", "Remedies explanation", "Future predictions"]'),
('Online Report', 'Comprehensive written astrology report delivered digitally', 'online_report', 1600.00, 60, 1, '["Detailed PDF report", "Chart analysis", "Predictions", "Remedies", "Digital delivery"]');
