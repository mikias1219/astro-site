#!/usr/bin/env python3
"""
Script to fix pages data and populate with real content
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Page, User, Base
from datetime import datetime

def create_pages():
    """Create real pages with proper content"""
    db = SessionLocal()
    
    try:
        # Get admin user (first user or create one)
        admin_user = db.query(User).filter(User.role == "admin").first()
        if not admin_user:
            admin_user = db.query(User).first()
        
        if not admin_user:
            print("No users found! Please create an admin user first.")
            return
        
        # Clear existing pages
        db.query(Page).delete()
        db.commit()
        
        # Create real pages
        pages_data = [
            {
                "title": "About Us",
                "slug": "about",
                "content": """
<h1>About Dr. Arup Shastri</h1>

<p>Welcome to AstroArupShastri.com, your trusted destination for authentic Vedic astrology consultations and spiritual guidance. I am Dr. Arup Shastri, a renowned Vedic astrologer with over 15 years of experience in helping people navigate life's challenges through the ancient wisdom of astrology.</p>

<h2>My Journey in Astrology</h2>

<p>My journey into the mystical world of astrology began at a young age when I discovered the profound impact that celestial movements have on human life. After years of dedicated study under renowned gurus and extensive research, I have mastered the art of Vedic astrology, palmistry, and numerology.</p>

<h2>Services I Offer</h2>

<ul>
    <li><strong>Birth Chart Analysis:</strong> Detailed analysis of your natal chart to understand your personality, strengths, and life path</li>
    <li><strong>Marriage Compatibility:</strong> Comprehensive kundli matching for successful relationships</li>
    <li><strong>Career Guidance:</strong> Astrological insights for career decisions and professional growth</li>
    <li><strong>Health Predictions:</strong> Understanding health patterns through planetary positions</li>
    <li><strong>Gemstone Consultation:</strong> Personalized gemstone recommendations for planetary remedies</li>
    <li><strong>Numerology:</strong> Life path analysis through numbers</li>
</ul>

<h2>My Approach</h2>

<p>I believe in providing honest, practical, and actionable guidance. My consultations are based on authentic Vedic principles combined with modern understanding of human psychology. I focus on empowering my clients to make informed decisions while respecting the cosmic influences that shape our lives.</p>

<h2>Why Choose Me?</h2>

<ul>
    <li>✅ 15+ years of experience in Vedic astrology</li>
    <li>✅ Thousands of satisfied clients worldwide</li>
    <li>✅ Authentic and accurate predictions</li>
    <li>✅ Personalized guidance for each individual</li>
    <li>✅ Available for online consultations</li>
    <li>✅ Affordable and transparent pricing</li>
</ul>

<p>Whether you're facing challenges in your personal life, career, relationships, or health, I'm here to guide you with the wisdom of the stars. Book a consultation today and take the first step towards a more fulfilling life.</p>
                """,
                "excerpt": "Learn about Dr. Arup Shastri, a renowned Vedic astrologer with 15+ years of experience in helping people through authentic astrology consultations.",
                "is_published": True
            },
            {
                "title": "Contact Us",
                "slug": "contact",
                "content": """
<h1>Contact Dr. Arup Shastri</h1>

<p>Ready to begin your astrological journey? I'm here to help you understand your life's path through the ancient wisdom of Vedic astrology. Get in touch with me for personalized consultations and guidance.</p>

<h2>Get in Touch</h2>

<div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>📞 Phone Consultation</h3>
    <p><strong>Phone:</strong> +91 91473 27266</p>
    <p><strong>WhatsApp:</strong> +91 91473 27266</p>
    <p><strong>Timings:</strong> 9:00 AM - 8:00 PM (IST)</p>
</div>

<div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>📧 Email Consultation</h3>
    <p><strong>Email:</strong> info@astroarupshastri.com</p>
    <p><strong>Response Time:</strong> Within 24 hours</p>
</div>

<div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>🌐 Online Consultation</h3>
    <p><strong>Video Call:</strong> Available on request</p>
    <p><strong>Platform:</strong> Zoom, Google Meet, or WhatsApp</p>
</div>

<h2>Consultation Types</h2>

<h3>📋 General Consultation (30 minutes) - ₹1,500</h3>
<ul>
    <li>Birth chart overview</li>
    <li>Current life situation analysis</li>
    <li>Basic remedies and guidance</li>
</ul>

<h3>🔍 Detailed Analysis (60 minutes) - ₹3,000</h3>
<ul>
    <li>Comprehensive birth chart analysis</li>
    <li>Career and financial guidance</li>
    <li>Health and relationship insights</li>
    <li>Personalized remedies</li>
</ul>

<h3>💑 Marriage Compatibility (45 minutes) - ₹2,500</h3>
<ul>
    <li>Detailed kundli matching</li>
    <li>Compatibility analysis</li>
    <li>Marriage timing prediction</li>
    <li>Relationship guidance</li>
</ul>

<h2>How to Book</h2>

<ol>
    <li><strong>Choose your consultation type</strong> from the options above</li>
    <li><strong>Call or WhatsApp</strong> me at +91 91473 27266</li>
    <li><strong>Provide your birth details:</strong>
        <ul>
            <li>Date of birth</li>
            <li>Time of birth</li>
            <li>Place of birth</li>
        </ul>
    </li>
    <li><strong>Schedule your consultation</strong> at a convenient time</li>
    <li><strong>Make payment</strong> through UPI, bank transfer, or online</li>
</ol>

<h2>What to Expect</h2>

<p>During your consultation, I will:</p>
<ul>
    <li>Analyze your birth chart thoroughly</li>
    <li>Answer all your questions with clarity</li>
    <li>Provide practical guidance and remedies</li>
    <li>Give you a timeline for important events</li>
    <li>Suggest gemstones or other remedies if needed</li>
</ul>

<h2>Testimonials</h2>

<blockquote style="background: #e8f5e8; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
    <p><em>"Dr. Arup Shastri's predictions were incredibly accurate. His guidance helped me make important career decisions. Highly recommended!"</em></p>
    <p><strong>- Priya Sharma, Mumbai</strong></p>
</blockquote>

<blockquote style="background: #e8f5e8; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
    <p><em>"The marriage compatibility analysis was spot on. We followed his advice and our relationship has been much stronger since then."</em></p>
    <p><strong>- Rajesh & Meera, Delhi</strong></p>
</blockquote>

<h2>Privacy & Confidentiality</h2>

<p>I understand the sensitive nature of personal consultations. All your information and discussions are kept strictly confidential. Your privacy is my priority.</p>

<p><strong>Ready to discover your destiny? Contact me today!</strong></p>
                """,
                "excerpt": "Contact Dr. Arup Shastri for authentic Vedic astrology consultations. Phone, WhatsApp, and online consultations available.",
                "is_published": True
            },
            {
                "title": "Daily Horoscope",
                "slug": "horoscope",
                "content": """
<h1>Daily Horoscope by Dr. Arup Shastri</h1>

<p>Get your personalized daily horoscope based on authentic Vedic astrology principles. Discover what the stars have in store for you today and plan your day accordingly.</p>

<h2>Today's Planetary Positions</h2>

<p>The celestial bodies are constantly moving, and their positions influence our daily lives. Understanding these movements helps us make better decisions and avoid potential challenges.</p>

<h2>Your Daily Guidance</h2>

<div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
    <h3>🔮 How to Get Your Personal Horoscope</h3>
    <p>For accurate daily predictions, I need your birth details:</p>
    <ul>
        <li><strong>Date of Birth:</strong> Exact date</li>
        <li><strong>Time of Birth:</strong> Exact time (very important for accuracy)</li>
        <li><strong>Place of Birth:</strong> City and state</li>
    </ul>
    <p>With these details, I can provide you with personalized daily, weekly, and monthly horoscopes.</p>
</div>

<h2>General Daily Guidance</h2>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">
    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
        <h3>🌅 Morning (6 AM - 12 PM)</h3>
        <p>Best time for new beginnings, planning, and important decisions. The Sun's energy is strong and supportive.</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
        <h3>☀️ Afternoon (12 PM - 6 PM)</h3>
        <p>Ideal for work, meetings, and social activities. Mercury's influence makes communication effective.</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
        <h3>🌙 Evening (6 PM - 12 AM)</h3>
        <p>Good time for reflection, family time, and spiritual activities. Venus brings harmony and peace.</p>
    </div>
</div>

<h2>Weekly Horoscope</h2>

<p>For detailed weekly predictions, book a consultation with me. I'll analyze your birth chart and provide insights for the upcoming week, including:</p>

<ul>
    <li>Best days for important decisions</li>
    <li>Challenging periods to be aware of</li>
    <li>Favorable times for new ventures</li>
    <li>Health and relationship guidance</li>
    <li>Financial opportunities and cautions</li>
</ul>

<h2>Monthly Horoscope</h2>

<p>Get comprehensive monthly guidance that includes:</p>

<ul>
    <li>Major planetary transits affecting you</li>
    <li>Career and financial outlook</li>
    <li>Relationship and family matters</li>
    <li>Health predictions and remedies</li>
    <li>Best dates for important activities</li>
</ul>

<h2>Special Horoscope Services</h2>

<div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>🎯 Personalized Horoscope Report</h3>
    <p><strong>Price: ₹2,000</strong></p>
    <p>Get a detailed 10-page horoscope report including:</p>
    <ul>
        <li>Birth chart analysis</li>
        <li>Planetary positions and their effects</li>
        <li>Career and education guidance</li>
        <li>Marriage and relationship predictions</li>
        <li>Health and wealth analysis</li>
        <li>Remedies and gemstone recommendations</li>
    </ul>
</div>

<h2>Free Horoscope Tools</h2>

<p>While I recommend personalized consultations for accurate predictions, you can also use these free tools:</p>

<ul>
    <li><a href="/calculators/kundli">Birth Chart Calculator</a></li>
    <li><a href="/calculators/horoscope-matching">Marriage Compatibility</a></li>
    <li><a href="/calculators/numerology">Numerology Calculator</a></li>
    <li><a href="/panchang">Daily Panchang</a></li>
</ul>

<h2>Why Choose My Horoscope Services?</h2>

<ul>
    <li>✅ Based on authentic Vedic astrology principles</li>
    <li>✅ Personalized analysis using your exact birth details</li>
    <li>✅ Practical guidance you can apply in daily life</li>
    <li>✅ Regular updates and follow-up consultations</li>
    <li>✅ Affordable pricing with genuine value</li>
</ul>

<h2>Book Your Horoscope Consultation</h2>

<p>Ready to discover what the stars have in store for you? Contact me today for personalized horoscope guidance.</p>

<div style="background: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
    <h3>📞 Call Now: +91 91473 27266</h3>
    <p>Available 9 AM - 8 PM (IST)</p>
    <p>WhatsApp consultations also available</p>
</div>

<p><em>Remember: The stars influence but don't control your destiny. Use astrological guidance as a tool for better decision-making and personal growth.</em></p>
                """,
                "excerpt": "Get your personalized daily horoscope from Dr. Arup Shastri. Accurate Vedic astrology predictions for your daily guidance.",
                "is_published": True
            },
            {
                "title": "Daily Panchang",
                "slug": "panchang",
                "content": """
<h1>Daily Panchang - Vedic Calendar</h1>

<p>Discover the auspicious timings and important dates according to the traditional Hindu calendar. The Panchang provides essential information for planning your daily activities, ceremonies, and important events.</p>

<h2>What is Panchang?</h2>

<p>Panchang is the traditional Hindu calendar that provides detailed information about:</p>

<ul>
    <li><strong>Tithi:</strong> Lunar day in the Hindu calendar</li>
    <li><strong>Nakshatra:</strong> The star constellation</li>
    <li><strong>Yoga:</strong> Auspicious combination of sun and moon</li>
    <li><strong>Karana:</strong> Half of a tithi</li>
    <li><strong>Vaar:</strong> Day of the week</li>
</ul>

<h2>Today's Panchang</h2>

<div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>📅 Current Date Information</h3>
    <p><strong>Note:</strong> For accurate daily Panchang, please contact me with your location details. The Panchang varies based on geographical location.</p>
</div>

<h2>Auspicious Timings (Muhurat)</h2>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0;">
    <div style="background: #d4edda; padding: 15px; border-radius: 10px; text-align: center;">
        <h4>🌅 Brahma Muhurat</h4>
        <p>4:00 AM - 5:30 AM</p>
        <small>Best for meditation and spiritual practices</small>
    </div>
    
    <div style="background: #d4edda; padding: 15px; border-radius: 10px; text-align: center;">
        <h4>☀️ Abhijit Muhurat</h4>
        <p>11:45 AM - 12:30 PM</p>
        <small>Most auspicious time for important work</small>
    </div>
    
    <div style="background: #d4edda; padding: 15px; border-radius: 10px; text-align: center;">
        <h4>🌙 Godhuli Muhurat</h4>
        <p>6:00 PM - 6:30 PM</p>
        <small>Evening twilight - good for prayers</small>
    </div>
</div>

<h2>Inauspicious Timings (Rahu Kaal)</h2>

<div style="background: #f8d7da; padding: 15px; border-radius: 10px; margin: 20px 0;">
    <h3>⚠️ Rahu Kaal (Avoid Important Work)</h3>
    <p><strong>Today's Rahu Kaal:</strong> [Time varies by location]</p>
    <p>It's advisable to avoid starting new ventures, signing contracts, or making important decisions during Rahu Kaal.</p>
</div>

<h2>Festivals and Important Dates</h2>

<div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>🎉 Upcoming Festivals</h3>
    <ul>
        <li><strong>Diwali:</strong> Festival of Lights - [Date varies each year]</li>
        <li><strong>Holi:</strong> Festival of Colors - [Date varies each year]</li>
        <li><strong>Navratri:</strong> Nine nights of Goddess worship - [Date varies each year]</li>
        <li><strong>Karva Chauth:</strong> Married women's fast - [Date varies each year]</li>
    </ul>
</div>

<h2>Monthly Panchang Services</h2>

<div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>📋 Monthly Panchang Report</h3>
    <p><strong>Price: ₹1,500</strong></p>
    <p>Get a detailed monthly Panchang report including:</p>
    <ul>
        <li>Daily auspicious and inauspicious timings</li>
        <li>Festivals and important dates</li>
        <li>Best dates for marriages, house warming, etc.</li>
        <li>Eclipses and special astronomical events</li>
        <li>Personalized recommendations based on your birth chart</li>
    </ul>
</div>

<h2>How to Use Panchang</h2>

<ol>
    <li><strong>Check Auspicious Timings:</strong> Plan important activities during favorable muhurats</li>
    <li><strong>Avoid Inauspicious Periods:</strong> Stay away from Rahu Kaal and other negative timings</li>
    <li><strong>Festival Planning:</strong> Use Panchang to plan religious ceremonies and festivals</li>
    <li><strong>Personal Events:</strong> Choose auspicious dates for marriages, house warming, etc.</li>
</ol>

<h2>Personalized Panchang Consultation</h2>

<p>For accurate Panchang information specific to your location and needs, book a consultation with me. I'll provide:</p>

<ul>
    <li>Daily auspicious timings for your city</li>
    <li>Personal muhurats based on your birth chart</li>
    <li>Best dates for important life events</li>
    <li>Festival dates and significance</li>
    <li>Remedies for challenging planetary periods</li>
</ul>

<h2>Free Panchang Tools</h2>

<p>You can also use these free resources:</p>

<ul>
    <li><a href="/calculators/kundli">Birth Chart Calculator</a></li>
    <li><a href="/calculators/horoscope-matching">Marriage Muhurat Calculator</a></li>
    <li><a href="/calculators/numerology">Numerology Calculator</a></li>
</ul>

<h2>Why Follow Panchang?</h2>

<ul>
    <li>✅ Align your activities with cosmic energies</li>
    <li>✅ Choose auspicious timings for important events</li>
    <li>✅ Avoid inauspicious periods</li>
    <li>✅ Enhance the success of your endeavors</li>
    <li>✅ Maintain harmony with natural rhythms</li>
</ul>

<h2>Book Your Panchang Consultation</h2>

<p>Need personalized Panchang guidance for your location and specific needs? Contact me today!</p>

<div style="background: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
    <h3>📞 Call Now: +91 91473 27266</h3>
    <p>Available 9 AM - 8 PM (IST)</p>
    <p>WhatsApp consultations also available</p>
</div>

<p><em>Remember: The Panchang is a tool to help you align with cosmic energies. Use it wisely to enhance the success and harmony in your life.</em></p>
                """,
                "excerpt": "Daily Panchang - Traditional Hindu calendar with auspicious timings, festivals, and important dates for planning your activities.",
                "is_published": True
            }
        ]
        
        # Create pages
        for page_data in pages_data:
            page = Page(
                title=page_data["title"],
                slug=page_data["slug"],
                content=page_data["content"],
                excerpt=page_data["excerpt"],
                is_published=page_data["is_published"],
                author_id=admin_user.id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(page)
        
        db.commit()
        print(f"✅ Created {len(pages_data)} pages successfully!")
        
        # Verify pages
        pages = db.query(Page).all()
        print(f"📊 Total pages in database: {len(pages)}")
        for page in pages:
            print(f"  - {page.title} ({page.slug}) - Published: {page.is_published}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_pages()
