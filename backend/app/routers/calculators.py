"""
Calculator router for astrology calculations
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import math

router = APIRouter()

# Request/Response models
class BirthDetails(BaseModel):
    name: str
    birth_date: str  # YYYY-MM-DD format
    birth_time: str  # HH:MM format
    birth_place: str
    gender: str  # male/female
    language: Optional[str] = "english"  # english, bengali, hindi

class RudrakshaRequest(BaseModel):
    name: str
    birth_date: str  # YYYY-MM-DD format
    birth_time: str  # HH:MM format
    birth_place: str
    gender: str  # male/female
    current_problems: Optional[list] = []  # List of current problems/issues

class CalculatorResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str

# Zodiac signs and their date ranges
ZODIAC_SIGNS = {
    "Aries": {"start": (3, 21), "end": (4, 19)},
    "Taurus": {"start": (4, 20), "end": (5, 20)},
    "Gemini": {"start": (5, 21), "end": (6, 20)},
    "Cancer": {"start": (6, 21), "end": (7, 22)},
    "Leo": {"start": (7, 23), "end": (8, 22)},
    "Virgo": {"start": (8, 23), "end": (9, 22)},
    "Libra": {"start": (9, 23), "end": (10, 22)},
    "Scorpio": {"start": (10, 23), "end": (11, 21)},
    "Sagittarius": {"start": (11, 22), "end": (12, 21)},
    "Capricorn": {"start": (12, 22), "end": (1, 19)},
    "Aquarius": {"start": (1, 20), "end": (2, 18)},
    "Pisces": {"start": (2, 19), "end": (3, 20)}
}

# Moon signs (simplified calculation)
MOON_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# Ascendant signs
ASCENDANT_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# Doshas
DOSHAS = {
    "Manglik": {"description": "Mars in 1st, 4th, 7th, 8th, or 12th house", "remedy": "Wear red coral or perform Mars puja"},
    "Kaal Sarp": {"description": "All planets between Rahu and Ketu", "remedy": "Perform Kaal Sarp dosh puja"},
    "Pitra": {"description": "Sun in 9th house with malefic planets", "remedy": "Perform Pitra dosh puja and tarpan"},
    "Nadi": {"description": "Same nakshatra in both charts", "remedy": "Perform Nadi dosh puja"}
}

# Gemstones for each planet
GEMSTONES = {
    "Sun": "Ruby",
    "Moon": "Pearl",
    "Mars": "Red Coral",
    "Mercury": "Emerald",
    "Jupiter": "Yellow Sapphire",
    "Venus": "Diamond",
    "Saturn": "Blue Sapphire",
    "Rahu": "Hessonite",
    "Ketu": "Cat's Eye"
}

# Nakshatras with complete details
NAKSHATRAS = [
    {"name": "Ashwini", "deity": "Ashwini Kumaras", "symbol": "Horse's Head", "lord": "Ketu"},
    {"name": "Bharani", "deity": "Yama", "symbol": "Yoni", "lord": "Venus"},
    {"name": "Krittika", "deity": "Agni", "symbol": "Razor", "lord": "Sun"},
    {"name": "Rohini", "deity": "Brahma", "symbol": "Chariot", "lord": "Moon"},
    {"name": "Mrigashira", "deity": "Soma", "symbol": "Deer's Head", "lord": "Mars"},
    {"name": "Ardra", "deity": "Rudra", "symbol": "Teardrop", "lord": "Rahu"},
    {"name": "Punarvasu", "deity": "Aditi", "symbol": "Bow", "lord": "Jupiter"},
    {"name": "Pushya", "deity": "Brihaspati", "symbol": "Cow's Udder", "lord": "Saturn"},
    {"name": "Ashlesha", "deity": "Nagas", "symbol": "Coiled Serpent", "lord": "Mercury"},
    {"name": "Magha", "deity": "Pitris", "symbol": "Royal Throne", "lord": "Ketu"},
    {"name": "Purva Phalguni", "deity": "Bhaga", "symbol": "Hammock", "lord": "Venus"},
    {"name": "Uttara Phalguni", "deity": "Aryaman", "symbol": "Bed", "lord": "Sun"},
    {"name": "Hasta", "deity": "Savitar", "symbol": "Hand", "lord": "Moon"},
    {"name": "Chitra", "deity": "Tvashtar", "symbol": "Pearl", "lord": "Mars"},
    {"name": "Swati", "deity": "Vayu", "symbol": "Coral", "lord": "Rahu"},
    {"name": "Vishakha", "deity": "Indra-Agni", "symbol": "Archway", "lord": "Jupiter"},
    {"name": "Anuradha", "deity": "Mitra", "symbol": "Lotus", "lord": "Saturn"},
    {"name": "Jyeshtha", "deity": "Indra", "symbol": "Earring", "lord": "Mercury"},
    {"name": "Mula", "deity": "Nirriti", "symbol": "Roots", "lord": "Ketu"},
    {"name": "Purva Ashadha", "deity": "Apas", "symbol": "Fan", "lord": "Venus"},
    {"name": "Uttara Ashadha", "deity": "Vishvedevas", "symbol": "Elephant Tusk", "lord": "Sun"},
    {"name": "Shravana", "deity": "Vishnu", "symbol": "Ear", "lord": "Moon"},
    {"name": "Dhanishtha", "deity": "Vasus", "symbol": "Drum", "lord": "Mars"},
    {"name": "Shatabhisha", "deity": "Varuna", "symbol": "Circle", "lord": "Rahu"},
    {"name": "Purva Bhadrapada", "deity": "Aja Ekapada", "symbol": "Sword", "lord": "Jupiter"},
    {"name": "Uttara Bhadrapada", "deity": "Ahir Budhnya", "symbol": "Twins", "lord": "Saturn"},
    {"name": "Revati", "deity": "Pushan", "symbol": "Fish", "lord": "Mercury"}
]

# Yogas - Special planetary combinations
YOGAS_LIST = [
    {"name": "Gaj Kesari Yoga", "description": "Moon and Jupiter in kendras", "benefits": "Wisdom, prosperity, and respect"},
    {"name": "Chandra Mangal Yoga", "description": "Moon and Mars conjunction", "benefits": "Wealth and courage"},
    {"name": "Hamsa Yoga", "description": "Jupiter in kendra in own sign", "benefits": "Spiritual knowledge and prosperity"},
    {"name": "Malavya Yoga", "description": "Venus in kendra in own sign", "benefits": "Luxury and beauty"},
    {"name": "Sasa Yoga", "description": "Saturn in kendra in own sign", "benefits": "Authority and longevity"},
    {"name": "Ruchaka Yoga", "description": "Mars in kendra in own sign", "benefits": "Courage and leadership"},
    {"name": "Bhadra Yoga", "description": "Mercury in kendra in own sign", "benefits": "Intelligence and communication"},
    {"name": "Sankha Yoga", "description": "Lords of 5th and 6th in kendras", "benefits": "Wealth and longevity"},
    {"name": "Budha Aditya Yoga", "description": "Sun and Mercury conjunction", "benefits": "Intelligence and name"},
    {"name": "Vasumati Yoga", "description": "Benefics in upachayas", "benefits": "Wealth accumulation"}
]

# Rudraksha beads and their benefits
RUDRAKSHA_BEADS = {
    1: {
        "name": "Ek Mukhi (1 Face)",
        "ruling_planet": "Sun",
        "benefits": "Enhances leadership, confidence, and spiritual growth",
        "wearing_method": "Gold chain around neck",
        "color": "Brown/Red"
    },
    2: {
        "name": "Do Mukhi (2 Face)",
        "ruling_planet": "Moon",
        "benefits": "Improves relationships, emotional balance, and family harmony",
        "wearing_method": "Silver chain around neck",
        "color": "Brown/White"
    },
    3: {
        "name": "Teen Mukhi (3 Face)",
        "ruling_planet": "Mars",
        "benefits": "Increases courage, energy, and removes obstacles",
        "wearing_method": "Red thread around neck",
        "color": "Brown/Red"
    },
    4: {
        "name": "Char Mukhi (4 Face)",
        "ruling_planet": "Mercury",
        "benefits": "Enhances intelligence, communication, and learning",
        "wearing_method": "Green thread around neck",
        "color": "Brown/Green"
    },
    5: {
        "name": "Panch Mukhi (5 Face)",
        "ruling_planet": "Jupiter",
        "benefits": "Brings wisdom, knowledge, and spiritual growth",
        "wearing_method": "Yellow thread around neck",
        "color": "Brown/Yellow"
    },
    6: {
        "name": "Chhah Mukhi (6 Face)",
        "ruling_planet": "Venus",
        "benefits": "Improves love life, creativity, and artistic abilities",
        "wearing_method": "White thread around neck",
        "color": "Brown/White"
    },
    7: {
        "name": "Saat Mukhi (7 Face)",
        "ruling_planet": "Saturn",
        "benefits": "Removes obstacles, brings stability and longevity",
        "wearing_method": "Black thread around neck",
        "color": "Brown/Black"
    },
    8: {
        "name": "Aath Mukhi (8 Face)",
        "ruling_planet": "Rahu",
        "benefits": "Protects from negative energies and black magic",
        "wearing_method": "Blue thread around neck",
        "color": "Brown/Blue"
    },
    9: {
        "name": "Nau Mukhi (9 Face)",
        "ruling_planet": "Ketu",
        "benefits": "Enhances spiritual knowledge and removes past life karma",
        "wearing_method": "Purple thread around neck",
        "color": "Brown/Purple"
    },
    10: {
        "name": "Das Mukhi (10 Face)",
        "ruling_planet": "All Planets",
        "benefits": "Provides overall protection and spiritual advancement",
        "wearing_method": "Multi-colored thread around neck",
        "color": "Brown/Multi"
    },
    11: {
        "name": "Gyarah Mukhi (11 Face)",
        "ruling_planet": "Hanuman",
        "benefits": "Provides courage, strength, and protection from enemies",
        "wearing_method": "Red thread around neck",
        "color": "Brown/Red"
    },
    12: {
        "name": "Barah Mukhi (12 Face)",
        "ruling_planet": "Sun",
        "benefits": "Enhances leadership qualities and removes financial problems",
        "wearing_method": "Gold chain around neck",
        "color": "Brown/Gold"
    },
    13: {
        "name": "Terah Mukhi (13 Face)",
        "ruling_planet": "Kamdev",
        "benefits": "Attracts love, beauty, and material pleasures",
        "wearing_method": "Pink thread around neck",
        "color": "Brown/Pink"
    },
    14: {
        "name": "Chaudah Mukhi (14 Face)",
        "ruling_planet": "Shiva",
        "benefits": "Provides divine protection and spiritual enlightenment",
        "wearing_method": "White thread around neck",
        "color": "Brown/White"
    }
}

def get_zodiac_sign(month: int, day: int) -> str:
    """Get zodiac sign based on birth date"""
    for sign, dates in ZODIAC_SIGNS.items():
        start_month, start_day = dates["start"]
        end_month, end_day = dates["end"]
        
        if sign == "Capricorn":  # Special case for Capricorn (crosses year)
            if (month == 12 and day >= start_day) or (month == 1 and day <= end_day):
                return sign
        else:
            if (month == start_month and day >= start_day) or (month == end_month and day <= end_day):
                return sign
    return "Aries"  # Default fallback

def calculate_moon_sign(birth_date: str, birth_time: str) -> str:
    """Calculate moon sign (simplified)"""
    # This is a simplified calculation. In real astrology, this requires complex calculations
    # based on the exact birth time and location
    try:
        date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
        day_of_year = date_obj.timetuple().tm_yday
        moon_sign_index = (day_of_year - 1) % 12
        return MOON_SIGNS[moon_sign_index]
    except:
        return "Aries"

def calculate_ascendant(birth_date: str, birth_time: str, birth_place: str) -> str:
    """Calculate ascendant (simplified)"""
    # This is a simplified calculation. Real ascendant calculation requires
    # complex astronomical calculations based on birth time and location
    try:
        time_obj = datetime.strptime(birth_time, "%H:%M")
        hour = time_obj.hour
        ascendant_index = hour % 12
        return ASCENDANT_SIGNS[ascendant_index]
    except:
        return "Aries"

def calculate_doshas(birth_date: str, birth_time: str) -> Dict[str, Any]:
    """Calculate doshas (simplified)"""
    # This is a simplified calculation. Real dosha calculation requires
    # complete birth chart analysis
    doshas_found = []
    
    # Simulate some doshas based on birth date
    date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
    day = date_obj.day
    
    if day in [1, 4, 7, 8, 12, 15, 18, 22, 25, 28]:
        doshas_found.append({
            "name": "Manglik",
            "description": DOSHAS["Manglik"]["description"],
            "remedy": DOSHAS["Manglik"]["remedy"],
            "severity": "Medium"
        })
    
    if day in [3, 6, 9, 13, 16, 19, 23, 26, 29]:
        doshas_found.append({
            "name": "Kaal Sarp",
            "description": DOSHAS["Kaal Sarp"]["description"],
            "remedy": DOSHAS["Kaal Sarp"]["remedy"],
            "severity": "High"
        })
    
    return {
        "doshas": doshas_found,
        "total_doshas": len(doshas_found),
        "recommendation": "Consult an astrologer for detailed analysis" if doshas_found else "No major doshas found"
    }

def get_nakshatra_details(birth_date: str) -> Dict[str, Any]:
    """Get detailed nakshatra information"""
    date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
    day_of_year = date_obj.timetuple().tm_yday
    nakshatra_index = (day_of_year - 1) % 27
    nakshatra = NAKSHATRAS[nakshatra_index]
    
    pada = ((day_of_year - 1) % 4) + 1  # Calculate pada (quarter)
    
    return {
        "nakshatra": nakshatra["name"],
        "pada": pada,
        "deity": nakshatra["deity"],
        "symbol": nakshatra["symbol"],
        "ruling_planet": nakshatra["lord"],
        "characteristics": f"This nakshatra is ruled by {nakshatra['lord']} and brings qualities of {nakshatra['symbol'].lower()}."
    }

def calculate_dasha_periods(birth_date: str) -> Dict[str, Any]:
    """Calculate Vimshottari Dasha periods"""
    date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
    day = date_obj.day
    
    # Dasha sequence and years
    dasha_sequence = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
    dasha_years = {"Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17}
    
    # Determine current Maha Dasha based on birth
    current_dasha_index = day % len(dasha_sequence)
    current_dasha = dasha_sequence[current_dasha_index]
    
    # Calculate periods
    periods = []
    for i in range(3):  # Show next 3 periods
        dasha_index = (current_dasha_index + i) % len(dasha_sequence)
        dasha_name = dasha_sequence[dasha_index]
        periods.append({
            "planet": dasha_name,
            "duration_years": dasha_years[dasha_name],
            "effects": f"{dasha_name} period brings transformation and growth in areas governed by {dasha_name}."
        })
    
    return {
        "current_mahadasha": current_dasha,
        "current_duration": dasha_years[current_dasha],
        "upcoming_periods": periods[1:],
        "description": f"You are currently in {current_dasha} Maha Dasha which lasts for {dasha_years[current_dasha]} years."
    }

def identify_yogas(birth_date: str, birth_time: str) -> list:
    """Identify special yogas in the birth chart"""
    date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
    day = date_obj.day
    
    # Simulate yoga presence based on birth details
    yogas_present = []
    
    # Add 2-4 yogas based on birth date
    num_yogas = (day % 3) + 2
    for i in range(num_yogas):
        yoga_index = (day + i * 3) % len(YOGAS_LIST)
        yogas_present.append(YOGAS_LIST[yoga_index])
    
    return yogas_present

def get_detailed_predictions(zodiac_sign: str, moon_sign: str, ascendant: str, language: str = "english") -> Dict[str, Any]:
    """Get detailed predictions in multiple languages"""
    
    predictions = {
        "english": {
            "personality": f"As a {zodiac_sign} with {moon_sign} moon, you possess a dynamic personality with strong emotional intelligence. Your {ascendant} ascendant adds depth to your character.",
            "career": f"Your {zodiac_sign} sun sign indicates success in fields related to leadership and innovation. The {moon_sign} moon supports careers in creative and humanitarian fields.",
            "relationships": f"In relationships, {zodiac_sign} individuals are passionate and loyal. Your {moon_sign} moon brings emotional depth and understanding to partnerships.",
            "health": f"Pay attention to areas governed by {zodiac_sign}. Regular exercise and meditation will help maintain balance. Your {moon_sign} moon suggests focus on emotional well-being.",
            "finance": f"Financial prospects are favorable with {zodiac_sign} sun. Plan investments carefully during {moon_sign} moon periods for best results.",
            "lucky_elements": {
                "color": "Orange, Red, Golden",
                "day": "Sunday, Thursday",
                "number": "3, 9, 12",
                "gemstone": "Ruby, Yellow Sapphire"
            }
        },
        "bengali": {
            "personality": f"{zodiac_sign} রাশি এবং {moon_sign} চন্দ্র রাশির সঙ্গে, আপনার একটি গতিশীল ব্যক্তিত্ব রয়েছে যা শক্তিশালী আবেগময় বুদ্ধিমত্তার সাথে। আপনার {ascendant} লগ্ন আপনার চরিত্রে গভীরতা যোগ করে।",
            "career": f"আপনার {zodiac_sign} সূর্য রাশি নেতৃত্ব এবং উদ্ভাবন সম্পর্কিত ক্ষেত্রে সাফল্য নির্দেশ করে। {moon_sign} চন্দ্র সৃজনশীল এবং মানবিক ক্ষেত্রে ক্যারিয়ারকে সমর্থন করে।",
            "relationships": f"সম্পর্কে, {zodiac_sign} ব্যক্তিরা আবেগপ্রবণ এবং বিশ্বস্ত। আপনার {moon_sign} চন্দ্র সম্পর্কে আবেগময় গভীরতা এবং বোঝাপড়া নিয়ে আসে।",
            "health": f"{zodiac_sign} দ্বারা নিয়ন্ত্রিত এলাকায় মনোযোগ দিন। নিয়মিত ব্যায়াম এবং ধ্যান ভারসাম্য বজায় রাখতে সাহায্য করবে। আপনার {moon_sign} চন্দ্র আবেগময় সুস্থতার উপর ফোকাস করার পরামর্শ দেয়।",
            "finance": f"{zodiac_sign} সূর্যের সাথে আর্থিক সম্ভাবনা অনুকূল। সর্বোত্তম ফলাফলের জন্য {moon_sign} চন্দ্র সময়কালে বিনিয়োগের পরিকল্পনা সাবধানে করুন।",
            "lucky_elements": {
                "color": "কমলা, লাল, সোনালি",
                "day": "রবিবার, বৃহস্পতিবার",
                "number": "৩, ৯, ১২",
                "gemstone": "মাণিক, পোখরাজ"
            }
        },
        "hindi": {
            "personality": f"{zodiac_sign} राशि और {moon_sign} चंद्र राशि के साथ, आपके पास मजबूत भावनात्मक बुद्धिमत्ता के साथ एक गतिशील व्यक्तित्व है। आपका {ascendant} लग्न आपके चरित्र में गहराई जोड़ता है।",
            "career": f"आपकी {zodiac_sign} सूर्य राशि नेतृत्व और नवाचार से संबंधित क्षेत्रों में सफलता का संकेत देती है। {moon_sign} चंद्र रचनात्मक और मानवीय क्षेत्रों में करियर का समर्थन करता है।",
            "relationships": f"रिश्तों में, {zodiac_sign} व्यक्ति भावुक और वफादार होते हैं। आपका {moon_sign} चंद्र साझेदारी में भावनात्मक गहराई और समझ लाता है।",
            "health": f"{zodiac_sign} द्वारा नियंत्रित क्षेत्रों पर ध्यान दें। नियमित व्यायाम और ध्यान संतुलन बनाए रखने में मदद करेगा। आपका {moon_sign} चंद्र भावनात्मक कल्याण पर ध्यान केंद्रित करने का सुझाव देता है।",
            "finance": f"{zodiac_sign} सूर्य के साथ वित्तीय संभावनाएं अनुकूल हैं। सर्वोत्तम परिणामों के लिए {moon_sign} चंद्र अवधि के दौरान निवेश की सावधानीपूर्वक योजना बनाएं।",
            "lucky_elements": {
                "color": "नारंगी, लाल, सुनहरा",
                "day": "रविवार, गुरुवार",
                "number": "३, ९, १२",
                "gemstone": "माणिक, पुखराज"
            }
        }
    }
    
    return predictions.get(language, predictions["english"])

def get_gemstone_recommendations(birth_date: str, birth_time: str) -> Dict[str, Any]:
    """Get gemstone recommendations (simplified)"""
    # This is a simplified calculation. Real gemstone recommendation requires
    # complete birth chart analysis
    date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
    day = date_obj.day
    
    # Simulate gemstone recommendations based on birth date
    primary_gemstone = list(GEMSTONES.values())[day % len(GEMSTONES)]
    secondary_gemstone = list(GEMSTONES.values())[(day + 3) % len(GEMSTONES)]
    
    return {
        "primary_gemstone": primary_gemstone,
        "secondary_gemstone": secondary_gemstone,
        "wearing_finger": "Ring finger" if day % 2 == 0 else "Index finger",
        "wearing_day": "Sunday" if day % 7 == 0 else "Friday",
        "benefits": f"Wearing {primary_gemstone} will enhance your planetary strength and bring positive energy",
        "metal": "Gold" if primary_gemstone in ["Ruby", "Yellow Sapphire", "Diamond"] else "Silver"
    }

def get_rudraksha_recommendations(birth_date: str, birth_time: str, current_problems: list = None) -> Dict[str, Any]:
    """Get Rudraksha recommendations based on birth details and current problems"""
    date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
    day = date_obj.day
    month = date_obj.month
    
    # Calculate primary Rudraksha based on birth date
    primary_rudraksha = ((day + month - 1) % 14) + 1
    secondary_rudraksha = ((day + month + 3) % 14) + 1
    
    # Get Rudraksha details
    primary_bead = RUDRAKSHA_BEADS[primary_rudraksha]
    secondary_bead = RUDRAKSHA_BEADS[secondary_rudraksha]
    
    # Problem-specific recommendations
    problem_recommendations = []
    if current_problems:
        for problem in current_problems:
            problem_lower = problem.lower()
            if any(word in problem_lower for word in ['health', 'disease', 'illness']):
                problem_recommendations.append({
                    "rudraksha": RUDRAKSHA_BEADS[7],
                    "reason": "7 Mukhi Rudraksha helps with health issues and longevity"
                })
            elif any(word in problem_lower for word in ['money', 'finance', 'wealth', 'financial']):
                problem_recommendations.append({
                    "rudraksha": RUDRAKSHA_BEADS[12],
                    "reason": "12 Mukhi Rudraksha helps with financial prosperity"
                })
            elif any(word in problem_lower for word in ['love', 'relationship', 'marriage']):
                problem_recommendations.append({
                    "rudraksha": RUDRAKSHA_BEADS[6],
                    "reason": "6 Mukhi Rudraksha improves love life and relationships"
                })
            elif any(word in problem_lower for word in ['career', 'job', 'business', 'work']):
                problem_recommendations.append({
                    "rudraksha": RUDRAKSHA_BEADS[1],
                    "reason": "1 Mukhi Rudraksha enhances leadership and career success"
                })
            elif any(word in problem_lower for word in ['education', 'learning', 'knowledge']):
                problem_recommendations.append({
                    "rudraksha": RUDRAKSHA_BEADS[4],
                    "reason": "4 Mukhi Rudraksha enhances intelligence and learning"
                })
            elif any(word in problem_lower for word in ['protection', 'enemy', 'black magic']):
                problem_recommendations.append({
                    "rudraksha": RUDRAKSHA_BEADS[8],
                    "reason": "8 Mukhi Rudraksha provides protection from negative energies"
                })
    
    return {
        "primary_rudraksha": {
            "mukhi": primary_rudraksha,
            "details": primary_bead
        },
        "secondary_rudraksha": {
            "mukhi": secondary_rudraksha,
            "details": secondary_bead
        },
        "problem_specific_recommendations": problem_recommendations,
        "general_guidelines": {
            "wearing_time": "Morning after bath",
            "mantra": "Om Namah Shivaya",
            "care_instructions": "Keep clean, avoid touching with dirty hands, store in clean place",
            "replacement": "Replace every 2-3 years or when damaged"
        },
        "benefits_summary": f"Wearing {primary_bead['name']} will help with {primary_bead['benefits'].lower()}"
    }

@router.post("/kundli", response_model=CalculatorResponse)
async def calculate_kundli(birth_details: BirthDetails):
    """Calculate complete birth chart (Kundli) with comprehensive details"""
    try:
        # Parse birth date
        birth_date_obj = datetime.strptime(birth_details.birth_date, "%Y-%m-%d")
        
        # Calculate basic astrological elements
        zodiac_sign = get_zodiac_sign(birth_date_obj.month, birth_date_obj.day)
        moon_sign = calculate_moon_sign(birth_details.birth_date, birth_details.birth_time)
        ascendant = calculate_ascendant(birth_details.birth_date, birth_details.birth_time, birth_details.birth_place)
        
        # Get detailed information
        doshas = calculate_doshas(birth_details.birth_date, birth_details.birth_time)
        gemstones = get_gemstone_recommendations(birth_details.birth_date, birth_details.birth_time)
        nakshatra_info = get_nakshatra_details(birth_details.birth_date)
        dasha_periods = calculate_dasha_periods(birth_details.birth_date)
        yogas = identify_yogas(birth_details.birth_date, birth_details.birth_time)
        predictions = get_detailed_predictions(zodiac_sign, moon_sign, ascendant, birth_details.language)
        
        kundli_data = {
            "personal_info": {
                "name": birth_details.name,
                "birth_date": birth_details.birth_date,
                "birth_time": birth_details.birth_time,
                "birth_place": birth_details.birth_place,
                "gender": birth_details.gender,
                "language": birth_details.language
            },
            "astrological_elements": {
                "zodiac_sign": zodiac_sign,
                "moon_sign": moon_sign,
                "ascendant": ascendant,
                "sun_sign": zodiac_sign
            },
            "nakshatra": nakshatra_info,
            "dasha_periods": dasha_periods,
            "yogas": yogas,
            "doshas": doshas,
            "gemstone_recommendations": gemstones,
            "planetary_positions": {
                "sun": {"house": ((birth_date_obj.day - 1) % 12) + 1, "sign": zodiac_sign},
                "moon": {"house": ((birth_date_obj.day + 5) % 12) + 1, "sign": moon_sign},
                "mars": {"house": ((birth_date_obj.day + 2) % 12) + 1, "sign": MOON_SIGNS[(birth_date_obj.day + 2) % 12]},
                "mercury": {"house": ((birth_date_obj.day + 1) % 12) + 1, "sign": MOON_SIGNS[(birth_date_obj.day + 1) % 12]},
                "jupiter": {"house": ((birth_date_obj.day + 4) % 12) + 1, "sign": MOON_SIGNS[(birth_date_obj.day + 4) % 12]},
                "venus": {"house": ((birth_date_obj.day + 3) % 12) + 1, "sign": MOON_SIGNS[(birth_date_obj.day + 3) % 12]},
                "saturn": {"house": ((birth_date_obj.day + 6) % 12) + 1, "sign": MOON_SIGNS[(birth_date_obj.day + 6) % 12]},
                "rahu": {"house": ((birth_date_obj.day + 1) % 12) + 1, "sign": MOON_SIGNS[(birth_date_obj.day + 1) % 12]},
                "ketu": {"house": ((birth_date_obj.day + 7) % 12) + 1, "sign": MOON_SIGNS[(birth_date_obj.day + 7) % 12]}
            },
            "detailed_predictions": predictions
        }
        
        return CalculatorResponse(
            success=True,
            data=kundli_data,
            message="Kundli calculated successfully with comprehensive details"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error calculating Kundli: {str(e)}"
        )

@router.post("/moon-sign", response_model=CalculatorResponse)
async def calculate_moon_sign_endpoint(birth_details: BirthDetails):
    """Calculate moon sign"""
    try:
        moon_sign = calculate_moon_sign(birth_details.birth_date, birth_details.birth_time)
        
        return CalculatorResponse(
            success=True,
            data={
                "moon_sign": moon_sign,
                "description": f"Your moon sign is {moon_sign}. This represents your emotional nature and inner self.",
                "characteristics": f"People with {moon_sign} moon sign are known for their emotional depth and intuitive nature."
            },
            message="Moon sign calculated successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error calculating moon sign: {str(e)}"
        )

@router.post("/ascendant", response_model=CalculatorResponse)
async def calculate_ascendant_endpoint(birth_details: BirthDetails):
    """Calculate ascendant (rising sign)"""
    try:
        ascendant = calculate_ascendant(birth_details.birth_date, birth_details.birth_time, birth_details.birth_place)
        
        return CalculatorResponse(
            success=True,
            data={
                "ascendant": ascendant,
                "description": f"Your ascendant (rising sign) is {ascendant}. This represents your outward personality and how others see you.",
                "characteristics": f"People with {ascendant} ascendant are known for their strong personality and leadership qualities."
            },
            message="Ascendant calculated successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error calculating ascendant: {str(e)}"
        )

@router.post("/dosha", response_model=CalculatorResponse)
async def calculate_dosha(birth_details: BirthDetails):
    """Calculate planetary doshas"""
    try:
        doshas = calculate_doshas(birth_details.birth_date, birth_details.birth_time)
        
        return CalculatorResponse(
            success=True,
            data=doshas,
            message="Dosha analysis completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error calculating doshas: {str(e)}"
        )

@router.post("/gemstone", response_model=CalculatorResponse)
async def get_gemstone_recommendations_endpoint(birth_details: BirthDetails):
    """Get gemstone recommendations"""
    try:
        gemstones = get_gemstone_recommendations(birth_details.birth_date, birth_details.birth_time)
        
        return CalculatorResponse(
            success=True,
            data=gemstones,
            message="Gemstone recommendations generated successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error generating gemstone recommendations: {str(e)}"
        )

@router.post("/horoscope-matching", response_model=CalculatorResponse)
async def horoscope_matching(male_details: BirthDetails, female_details: BirthDetails):
    """Calculate horoscope matching for marriage"""
    try:
        # Calculate basic compatibility
        male_zodiac = get_zodiac_sign(
            datetime.strptime(male_details.birth_date, "%Y-%m-%d").month,
            datetime.strptime(male_details.birth_date, "%Y-%m-%d").day
        )
        female_zodiac = get_zodiac_sign(
            datetime.strptime(female_details.birth_date, "%Y-%m-%d").month,
            datetime.strptime(female_details.birth_date, "%Y-%m-%d").day
        )
        
        # Simple compatibility calculation
        zodiac_signs = list(ZODIAC_SIGNS.keys())
        male_index = zodiac_signs.index(male_zodiac)
        female_index = zodiac_signs.index(female_zodiac)
        
        compatibility_score = 100 - abs(male_index - female_index) * 8
        
        matching_data = {
            "male_details": {
                "name": male_details.name,
                "zodiac_sign": male_zodiac,
                "birth_date": male_details.birth_date
            },
            "female_details": {
                "name": female_details.name,
                "zodiac_sign": female_zodiac,
                "birth_date": female_details.birth_date
            },
            "compatibility": {
                "score": max(compatibility_score, 20),  # Minimum 20%
                "status": "Excellent" if compatibility_score >= 80 else "Good" if compatibility_score >= 60 else "Moderate" if compatibility_score >= 40 else "Low",
                "description": f"Compatibility between {male_zodiac} and {female_zodiac} signs"
            },
            "recommendation": "This is a good match for marriage" if compatibility_score >= 60 else "Consider consulting an astrologer for detailed analysis"
        }
        
        return CalculatorResponse(
            success=True,
            data=matching_data,
            message="Horoscope matching completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error in horoscope matching: {str(e)}"
        )

@router.post("/rudraksha", response_model=CalculatorResponse)
async def calculate_rudraksha(rudraksha_request: RudrakshaRequest):
    """Calculate Rudraksha recommendations"""
    try:
        rudraksha_data = get_rudraksha_recommendations(
            rudraksha_request.birth_date, 
            rudraksha_request.birth_time,
            rudraksha_request.current_problems
        )
        
        # Add personal information to the response
        rudraksha_data["personal_info"] = {
            "name": rudraksha_request.name,
            "birth_date": rudraksha_request.birth_date,
            "birth_time": rudraksha_request.birth_time,
            "birth_place": rudraksha_request.birth_place,
            "gender": rudraksha_request.gender
        }
        
        return CalculatorResponse(
            success=True,
            data=rudraksha_data,
            message="Rudraksha recommendations generated successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error generating Rudraksha recommendations: {str(e)}"
        )
