"""
Kundli generation and management API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import math
from datetime import datetime, timedelta

from app.database import get_db
from app.models import Kundli, User
from app.schemas import KundliCreate, KundliResponse
from app.auth import get_current_user, get_optional_current_user

router = APIRouter(prefix="/kundli", tags=["kundli"])

# Zodiac signs and their properties
ZODIAC_SIGNS = {
    'Aries': {'element': 'Fire', 'quality': 'Cardinal', 'ruler': 'Mars', 'dates': (3, 21, 4, 19)},
    'Taurus': {'element': 'Earth', 'quality': 'Fixed', 'ruler': 'Venus', 'dates': (4, 20, 5, 20)},
    'Gemini': {'element': 'Air', 'quality': 'Mutable', 'ruler': 'Mercury', 'dates': (5, 21, 6, 20)},
    'Cancer': {'element': 'Water', 'quality': 'Cardinal', 'ruler': 'Moon', 'dates': (6, 21, 7, 22)},
    'Leo': {'element': 'Fire', 'quality': 'Fixed', 'ruler': 'Sun', 'dates': (7, 23, 8, 22)},
    'Virgo': {'element': 'Earth', 'quality': 'Mutable', 'ruler': 'Mercury', 'dates': (8, 23, 9, 22)},
    'Libra': {'element': 'Air', 'quality': 'Cardinal', 'ruler': 'Venus', 'dates': (9, 23, 10, 22)},
    'Scorpio': {'element': 'Water', 'quality': 'Fixed', 'ruler': 'Mars', 'dates': (10, 23, 11, 21)},
    'Sagittarius': {'element': 'Fire', 'quality': 'Mutable', 'ruler': 'Jupiter', 'dates': (11, 22, 12, 21)},
    'Capricorn': {'element': 'Earth', 'quality': 'Cardinal', 'ruler': 'Saturn', 'dates': (12, 22, 1, 19)},
    'Aquarius': {'element': 'Air', 'quality': 'Fixed', 'ruler': 'Saturn', 'dates': (1, 20, 2, 18)},
    'Pisces': {'element': 'Water', 'quality': 'Mutable', 'ruler': 'Jupiter', 'dates': (2, 19, 3, 20)}
}

NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

TITHIS = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
    'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi',
    'Purnima/Amavasya'
]

YOGAS = [
    'Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma',
    'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha',
    'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
]

KARANS = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni',
    'Chatushpada', 'Naga', 'Kimstughna'
]

def calculate_sun_sign(birth_date: datetime) -> str:
    """Calculate sun sign based on birth date"""
    month = birth_date.month
    day = birth_date.day
    
    for sign, props in ZODIAC_SIGNS.items():
        start_month, start_day, end_month, end_day = props['dates']
        
        if (month == start_month and day >= start_day) or (month == end_month and day <= end_day):
            return sign
    
    return 'Capricorn'  # Default fallback

def calculate_moon_sign(birth_date: datetime, birth_time: str) -> str:
    """Calculate moon sign based on birth date and time"""
    # Simplified calculation - in real implementation, use ephemeris data
    time_parts = birth_time.split(':')
    hour = int(time_parts[0])
    minute = int(time_parts[1]) if len(time_parts) > 1 else 0
    
    # Moon moves approximately 13 degrees per day
    days_from_epoch = (birth_date - datetime(2000, 1, 1)).days
    moon_position = (days_from_epoch * 13 + hour * 0.5 + minute * 0.008) % 360
    
    sign_index = int(moon_position / 30)
    signs = list(ZODIAC_SIGNS.keys())
    return signs[sign_index % 12]

def calculate_ascendant(birth_date: datetime, birth_time: str, latitude: float = 0, longitude: float = 0) -> str:
    """Calculate ascendant/rising sign"""
    # Simplified calculation - in real implementation, use sidereal time and location
    time_parts = birth_time.split(':')
    hour = int(time_parts[0])
    minute = int(time_parts[1]) if len(time_parts) > 1 else 0
    
    # Ascendant changes every 2 hours approximately
    asc_index = (hour // 2 + birth_date.day % 6) % 12
    signs = list(ZODIAC_SIGNS.keys())
    return signs[asc_index]

def calculate_nakshatra(birth_date: datetime, birth_time: str) -> tuple:
    """Calculate nakshatra and pada"""
    time_parts = birth_time.split(':')
    hour = int(time_parts[0])
    minute = int(time_parts[1]) if len(time_parts) > 1 else 0
    
    # Simplified calculation
    days_from_epoch = (birth_date - datetime(2000, 1, 1)).days
    nakshatra_position = (days_from_epoch * 13.33 + hour * 0.55 + minute * 0.009) % 360
    
    nakshatra_index = int(nakshatra_position / 13.33) % 27
    pada = int((nakshatra_position % 13.33) / 3.33) + 1
    
    return NAKSHATRAS[nakshatra_index], pada

def calculate_tithi(birth_date: datetime) -> str:
    """Calculate tithi"""
    # Simplified calculation based on lunar day
    days_from_new_moon = birth_date.day % 15
    if days_from_new_moon == 0:
        return TITHIS[14]  # Purnima/Amavasya
    return TITHIS[days_from_new_moon - 1]

def calculate_yoga(birth_date: datetime, birth_time: str) -> str:
    """Calculate yoga"""
    time_parts = birth_time.split(':')
    hour = int(time_parts[0])
    
    yoga_index = (birth_date.day + hour) % 27
    return YOGAS[yoga_index]

def calculate_karan(birth_date: datetime) -> str:
    """Calculate karan"""
    karan_index = birth_date.day % 11
    return KARANS[karan_index]

def check_doshas(birth_date: datetime, birth_time: str, gender: str) -> dict:
    """Check for various doshas"""
    # Simplified dosha calculation
    time_parts = birth_time.split(':')
    hour = int(time_parts[0])
    
    # Mangal Dosha (simplified)
    mangal_dosha = False
    if gender.lower() == 'female' and hour in [6, 7, 8, 12, 13, 14]:
        mangal_dosha = True
    elif gender.lower() == 'male' and hour in [1, 2, 4, 7, 8, 12]:
        mangal_dosha = True
    
    # Kaal Sarp Dosha (simplified)
    kaal_sarp_dosha = (birth_date.day + hour) % 7 == 0
    
    # Shani Dosha (simplified)
    shani_dosha = birth_date.weekday() == 5 and hour > 18  # Saturday evening
    
    return {
        'mangal_dosha': mangal_dosha,
        'kaal_sarp_dosha': kaal_sarp_dosha,
        'shani_dosha': shani_dosha
    }

def generate_planetary_positions(birth_date: datetime, birth_time: str) -> dict:
    """Generate planetary positions (simplified)"""
    time_parts = birth_time.split(':')
    hour = int(time_parts[0])
    minute = int(time_parts[1]) if len(time_parts) > 1 else 0
    
    days_from_epoch = (birth_date - datetime(2000, 1, 1)).days
    
    # Simplified planetary positions
    planets = {
        'Sun': calculate_sun_sign(birth_date),
        'Moon': calculate_moon_sign(birth_date, birth_time),
        'Mars': list(ZODIAC_SIGNS.keys())[(days_from_epoch // 687) % 12],
        'Mercury': list(ZODIAC_SIGNS.keys())[(days_from_epoch // 88) % 12],
        'Jupiter': list(ZODIAC_SIGNS.keys())[(days_from_epoch // 4333) % 12],
        'Venus': list(ZODIAC_SIGNS.keys())[(days_from_epoch // 225) % 12],
        'Saturn': list(ZODIAC_SIGNS.keys())[(days_from_epoch // 10759) % 12],
        'Rahu': list(ZODIAC_SIGNS.keys())[((days_from_epoch // 6798) + 6) % 12],
        'Ketu': list(ZODIAC_SIGNS.keys())[((days_from_epoch // 6798)) % 12]
    }
    
    return planets

def generate_house_positions(planetary_positions: dict, ascendant: str) -> dict:
    """Generate house positions based on planetary positions"""
    signs = list(ZODIAC_SIGNS.keys())
    asc_index = signs.index(ascendant)
    
    houses = {}
    for i in range(1, 13):
        house_sign = signs[(asc_index + i - 1) % 12]
        planets_in_house = [planet for planet, sign in planetary_positions.items() if sign == house_sign]
        houses[f'House_{i}'] = {
            'sign': house_sign,
            'planets': planets_in_house
        }
    
    return houses

def generate_kundli_report(kundli_data: dict, language: str = 'en') -> dict:
    """Generate comprehensive kundli report"""
    
    # Basic information
    report = {
        'basic_info': {
            'sun_sign': kundli_data['sun_sign'],
            'moon_sign': kundli_data['moon_sign'],
            'ascendant': kundli_data['ascendant'],
            'nakshatra': f"{kundli_data['nakshatra']} - Pada {kundli_data['nakshatra_pada']}",
            'tithi': kundli_data['tithi'],
            'yoga': kundli_data['yoga'],
            'karan': kundli_data['karan']
        },
        
        # Personality analysis
        'personality': {
            'general_traits': f"As a {kundli_data['sun_sign']} with {kundli_data['moon_sign']} moon and {kundli_data['ascendant']} rising, you possess a unique blend of characteristics.",
            'strengths': f"Your {kundli_data['nakshatra']} nakshatra gives you natural leadership abilities and determination.",
            'challenges': "Areas for personal growth and development based on planetary positions."
        },
        
        # Career predictions
        'career': {
            'suitable_fields': "Technology, Finance, Healthcare, Education",
            'favorable_periods': "Jupiter transit periods will be highly beneficial for career growth.",
            'recommendations': "Focus on skill development and networking during favorable planetary periods."
        },
        
        # Relationship predictions
        'relationships': {
            'compatibility': f"Your {kundli_data['moon_sign']} moon sign suggests good compatibility with water and earth signs.",
            'marriage_timing': "Favorable marriage periods based on planetary transits.",
            'family_life': "Predictions about family relationships and domestic harmony."
        },
        
        # Health predictions
        'health': {
            'general_health': "Overall health prospects based on planetary positions.",
            'vulnerable_areas': "Areas of health that need attention.",
            'remedies': "Suggested remedies and precautions for better health."
        },
        
        # Doshas and remedies
        'doshas': kundli_data['doshas'],
        
        # Lucky elements
        'lucky_elements': {
            'colors': ['Red', 'Orange', 'Yellow'],
            'numbers': [1, 3, 9, 21],
            'days': ['Tuesday', 'Sunday'],
            'stones': ['Ruby', 'Coral', 'Yellow Sapphire']
        }
    }
    
    return report

@router.post("/generate", response_model=KundliResponse)
async def generate_kundli(
    kundli_data: KundliCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Generate a new kundli"""
    try:
        # Calculate astrological elements
        sun_sign = calculate_sun_sign(kundli_data.birth_date)
        moon_sign = calculate_moon_sign(kundli_data.birth_date, kundli_data.birth_time)
        ascendant = calculate_ascendant(
            kundli_data.birth_date, 
            kundli_data.birth_time, 
            kundli_data.latitude or 0, 
            kundli_data.longitude or 0
        )
        nakshatra, nakshatra_pada = calculate_nakshatra(kundli_data.birth_date, kundli_data.birth_time)
        tithi = calculate_tithi(kundli_data.birth_date)
        yoga = calculate_yoga(kundli_data.birth_date, kundli_data.birth_time)
        karan = calculate_karan(kundli_data.birth_date)
        doshas = check_doshas(kundli_data.birth_date, kundli_data.birth_time, kundli_data.gender)
        
        # Generate planetary positions
        planetary_positions = generate_planetary_positions(kundli_data.birth_date, kundli_data.birth_time)
        house_positions = generate_house_positions(planetary_positions, ascendant)
        
        # Create kundli record
        db_kundli = Kundli(
            user_id=current_user.id if current_user else None,
            name=kundli_data.name,
            birth_date=kundli_data.birth_date,
            birth_time=kundli_data.birth_time,
            birth_place=kundli_data.birth_place,
            latitude=kundli_data.latitude,
            longitude=kundli_data.longitude,
            timezone_offset=kundli_data.timezone_offset,
            gender=kundli_data.gender,
            language=kundli_data.language,
            chart_type=kundli_data.chart_type,
            sun_sign=sun_sign,
            moon_sign=moon_sign,
            ascendant=ascendant,
            nakshatra=nakshatra,
            nakshatra_pada=nakshatra_pada,
            tithi=tithi,
            yoga=yoga,
            karan=karan,
            planetary_positions=json.dumps(planetary_positions),
            house_positions=json.dumps(house_positions),
            mangal_dosha=doshas['mangal_dosha'],
            kaal_sarp_dosha=doshas['kaal_sarp_dosha'],
            shani_dosha=doshas['shani_dosha']
        )
        
        # Generate comprehensive report
        kundli_dict = {
            'sun_sign': sun_sign,
            'moon_sign': moon_sign,
            'ascendant': ascendant,
            'nakshatra': nakshatra,
            'nakshatra_pada': nakshatra_pada,
            'tithi': tithi,
            'yoga': yoga,
            'karan': karan,
            'doshas': doshas,
            'planetary_positions': planetary_positions,
            'house_positions': house_positions
        }
        
        report = generate_kundli_report(kundli_dict, kundli_data.language)
        db_kundli.report_data = json.dumps(report)
        
        db.add(db_kundli)
        db.commit()
        db.refresh(db_kundli)
        
        return db_kundli
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating kundli: {str(e)}"
        )

@router.get("/user", response_model=List[KundliResponse])
async def get_user_kundlis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all kundlis for the current user"""
    kundlis = db.query(Kundli).filter(Kundli.user_id == current_user.id).all()
    return kundlis

@router.get("/{kundli_id}", response_model=KundliResponse)
async def get_kundli(
    kundli_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Get a specific kundli by ID"""
    kundli = db.query(Kundli).filter(Kundli.id == kundli_id).first()
    
    if not kundli:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kundli not found"
        )
    
    # Check if user has access to this kundli
    if current_user and kundli.user_id and kundli.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return kundli

@router.delete("/{kundli_id}")
async def delete_kundli(
    kundli_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a kundli"""
    kundli = db.query(Kundli).filter(
        Kundli.id == kundli_id,
        Kundli.user_id == current_user.id
    ).first()
    
    if not kundli:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kundli not found"
        )
    
    db.delete(kundli)
    db.commit()
    
    return {"message": "Kundli deleted successfully"}
