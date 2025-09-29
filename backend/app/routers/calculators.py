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
        "benefits": f"Wearing {primary_gemstone} will enhance your planetary strength and bring positive energy"
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
    """Calculate complete birth chart (Kundli)"""
    try:
        # Parse birth date
        birth_date_obj = datetime.strptime(birth_details.birth_date, "%Y-%m-%d")
        
        # Calculate basic astrological elements
        zodiac_sign = get_zodiac_sign(birth_date_obj.month, birth_date_obj.day)
        moon_sign = calculate_moon_sign(birth_details.birth_date, birth_details.birth_time)
        ascendant = calculate_ascendant(birth_details.birth_date, birth_details.birth_time, birth_details.birth_place)
        doshas = calculate_doshas(birth_details.birth_date, birth_details.birth_time)
        gemstones = get_gemstone_recommendations(birth_details.birth_date, birth_details.birth_time)
        
        kundli_data = {
            "personal_info": {
                "name": birth_details.name,
                "birth_date": birth_details.birth_date,
                "birth_time": birth_details.birth_time,
                "birth_place": birth_details.birth_place,
                "gender": birth_details.gender
            },
            "astrological_elements": {
                "zodiac_sign": zodiac_sign,
                "moon_sign": moon_sign,
                "ascendant": ascendant,
                "sun_sign": zodiac_sign
            },
            "doshas": doshas,
            "gemstone_recommendations": gemstones,
            "planetary_positions": {
                "sun": f"House {((birth_date_obj.day - 1) % 12) + 1}",
                "moon": f"House {((birth_date_obj.day + 5) % 12) + 1}",
                "mars": f"House {((birth_date_obj.day + 2) % 12) + 1}",
                "mercury": f"House {((birth_date_obj.day + 1) % 12) + 1}",
                "jupiter": f"House {((birth_date_obj.day + 4) % 12) + 1}",
                "venus": f"House {((birth_date_obj.day + 3) % 12) + 1}",
                "saturn": f"House {((birth_date_obj.day + 6) % 12) + 1}"
            }
        }
        
        return CalculatorResponse(
            success=True,
            data=kundli_data,
            message="Kundli calculated successfully"
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
