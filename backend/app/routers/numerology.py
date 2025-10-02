"""
Numerology calculations and predictions API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime

from app.database import get_db
from app.models import Numerology, User
from app.schemas import NumerologyCreate, NumerologyResponse
from app.auth import get_current_user, get_optional_current_user

router = APIRouter(prefix="/numerology", tags=["numerology"])

def calculate_single_digit(number: int) -> int:
    """Reduce number to single digit (except 11, 22, 33)"""
    while number > 9 and number not in [11, 22, 33]:
        number = sum(int(digit) for digit in str(number))
    return number

def calculate_name_number(name: str) -> int:
    """Calculate numerology number from name"""
    # Pythagorean numerology chart
    chart = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    }
    
    total = 0
    for char in name.upper():
        if char in chart:
            total += chart[char]
    
    return calculate_single_digit(total)

def calculate_vowel_number(name: str) -> int:
    """Calculate soul urge number from vowels in name"""
    vowels = 'AEIOU'
    chart = {
        'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3
    }
    
    total = 0
    for char in name.upper():
        if char in vowels and char in chart:
            total += chart[char]
    
    return calculate_single_digit(total)

def calculate_consonant_number(name: str) -> int:
    """Calculate personality number from consonants in name"""
    vowels = 'AEIOU'
    chart = {
        'B': 2, 'C': 3, 'D': 4, 'F': 6, 'G': 7, 'H': 8,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    }
    
    total = 0
    for char in name.upper():
        if char not in vowels and char in chart:
            total += chart[char]
    
    return calculate_single_digit(total)

def calculate_life_path_number(birth_date: datetime) -> int:
    """Calculate life path number from birth date"""
    day = birth_date.day
    month = birth_date.month
    year = birth_date.year
    
    # Reduce each component
    day_reduced = calculate_single_digit(day)
    month_reduced = calculate_single_digit(month)
    year_reduced = calculate_single_digit(year)
    
    # Add them together and reduce
    total = day_reduced + month_reduced + year_reduced
    return calculate_single_digit(total)

def calculate_birth_day_number(birth_date: datetime) -> int:
    """Calculate birth day number"""
    return calculate_single_digit(birth_date.day)

def get_lucky_elements(life_path: int, destiny: int) -> dict:
    """Get lucky numbers, colors, days, and stones based on numerology"""
    
    lucky_data = {
        1: {
            'numbers': [1, 10, 19, 28],
            'colors': ['Red', 'Orange', 'Yellow'],
            'days': ['Sunday', 'Monday'],
            'stones': ['Ruby', 'Garnet', 'Bloodstone']
        },
        2: {
            'numbers': [2, 11, 20, 29],
            'colors': ['Green', 'Cream', 'White'],
            'days': ['Monday', 'Friday'],
            'stones': ['Pearl', 'Moonstone', 'Jade']
        },
        3: {
            'numbers': [3, 12, 21, 30],
            'colors': ['Purple', 'Mauve', 'Violet'],
            'days': ['Thursday', 'Friday'],
            'stones': ['Amethyst', 'Turquoise', 'Topaz']
        },
        4: {
            'numbers': [4, 13, 22, 31],
            'colors': ['Blue', 'Grey', 'Black'],
            'days': ['Saturday', 'Sunday'],
            'stones': ['Sapphire', 'Emerald', 'Jade']
        },
        5: {
            'numbers': [5, 14, 23],
            'colors': ['Silver', 'Grey', 'White'],
            'days': ['Wednesday', 'Friday'],
            'stones': ['Diamond', 'Platinum', 'Silver']
        },
        6: {
            'numbers': [6, 15, 24],
            'colors': ['Blue', 'Pink', 'White'],
            'days': ['Friday', 'Monday'],
            'stones': ['Emerald', 'Turquoise', 'Sapphire']
        },
        7: {
            'numbers': [7, 16, 25],
            'colors': ['Green', 'Yellow', 'Cream'],
            'days': ['Monday', 'Sunday'],
            'stones': ['Cat\'s Eye', 'Pearl', 'Moonstone']
        },
        8: {
            'numbers': [8, 17, 26],
            'colors': ['Black', 'Dark Blue', 'Grey'],
            'days': ['Saturday', 'Sunday'],
            'stones': ['Blue Sapphire', 'Amethyst', 'Black Onyx']
        },
        9: {
            'numbers': [9, 18, 27],
            'colors': ['Red', 'Pink', 'Crimson'],
            'days': ['Tuesday', 'Thursday'],
            'stones': ['Coral', 'Red Garnet', 'Bloodstone']
        },
        11: {
            'numbers': [11, 29],
            'colors': ['Silver', 'White', 'Pale Yellow'],
            'days': ['Monday', 'Thursday'],
            'stones': ['Pearl', 'Moonstone', 'Opal']
        },
        22: {
            'numbers': [22, 4],
            'colors': ['All colors', 'Especially bright ones'],
            'days': ['All days favorable'],
            'stones': ['All precious stones']
        },
        33: {
            'numbers': [33, 6],
            'colors': ['Gold', 'Orange', 'Yellow'],
            'days': ['All days favorable'],
            'stones': ['All stones with healing properties']
        }
    }
    
    primary_data = lucky_data.get(life_path, lucky_data[1])
    secondary_data = lucky_data.get(destiny, lucky_data[1])
    
    # Combine and deduplicate
    combined = {
        'numbers': list(set(primary_data['numbers'] + secondary_data['numbers'])),
        'colors': list(set(primary_data['colors'] + secondary_data['colors'])),
        'days': list(set(primary_data['days'] + secondary_data['days'])),
        'stones': list(set(primary_data['stones'] + secondary_data['stones']))
    }
    
    return combined

def get_personality_traits(life_path: int) -> str:
    """Get personality traits based on life path number"""
    
    traits = {
        1: "Natural leader, independent, pioneering, ambitious, and determined. You have strong willpower and the ability to initiate new projects. You prefer to lead rather than follow.",
        
        2: "Cooperative, diplomatic, sensitive, and peace-loving. You work well in partnerships and have a natural ability to mediate conflicts. You value harmony and relationships.",
        
        3: "Creative, expressive, optimistic, and social. You have artistic talents and excellent communication skills. You inspire others with your enthusiasm and creativity.",
        
        4: "Practical, organized, reliable, and hardworking. You build solid foundations and prefer systematic approaches. You value stability and security.",
        
        5: "Freedom-loving, adventurous, curious, and versatile. You seek variety and change in life. You have a natural ability to adapt to different situations.",
        
        6: "Nurturing, responsible, caring, and family-oriented. You have a strong sense of duty and desire to help others. You create harmony in your environment.",
        
        7: "Analytical, introspective, spiritual, and mysterious. You seek deeper understanding and truth. You prefer solitude for contemplation and study.",
        
        8: "Ambitious, material-focused, authoritative, and business-minded. You have strong organizational skills and the ability to achieve material success.",
        
        9: "Humanitarian, generous, compassionate, and idealistic. You have a broad perspective and desire to serve humanity. You are naturally giving and forgiving.",
        
        11: "Intuitive, inspirational, spiritual, and visionary. You have heightened psychic abilities and can inspire others. You are here to enlighten and uplift.",
        
        22: "Master builder, practical visionary, and powerful manifestor. You can turn dreams into reality on a large scale. You have the ability to create lasting institutions.",
        
        33: "Master teacher, healer, and spiritual guide. You have the ability to uplift humanity through teaching and healing. You embody unconditional love and service."
    }
    
    return traits.get(life_path, traits[1])

def get_career_guidance(life_path: int, destiny: int) -> str:
    """Get career guidance based on numerology numbers"""
    
    career_paths = {
        1: "Leadership roles, entrepreneurship, management, politics, military, sports, innovation, and pioneering fields.",
        2: "Diplomacy, counseling, teaching, healthcare, social work, partnerships, mediation, and cooperative ventures.",
        3: "Arts, entertainment, writing, speaking, marketing, design, media, communication, and creative industries.",
        4: "Engineering, construction, accounting, administration, banking, real estate, agriculture, and systematic work.",
        5: "Travel, sales, journalism, advertising, telecommunications, transportation, and variety-based careers.",
        6: "Healthcare, education, social services, hospitality, interior design, family counseling, and nurturing professions.",
        7: "Research, analysis, spirituality, psychology, investigation, writing, technology, and solitary work.",
        8: "Business, finance, real estate, law, corporate leadership, banking, and material-focused careers.",
        9: "Humanitarian work, teaching, healing, arts, philanthropy, social causes, and service-oriented careers.",
        11: "Spiritual teaching, counseling, healing, inspiration, metaphysics, and enlightening others.",
        22: "Large-scale projects, international business, architecture, engineering, and building lasting institutions.",
        33: "Teaching, healing, spiritual guidance, and uplifting humanity through service and compassion."
    }
    
    primary = career_paths.get(life_path, career_paths[1])
    secondary = career_paths.get(destiny, "")
    
    if secondary and secondary != primary:
        return f"Primary path: {primary}\n\nAlternative paths: {secondary}"
    
    return primary

def get_relationship_compatibility(life_path: int) -> str:
    """Get relationship compatibility guidance"""
    
    compatibility = {
        1: "Most compatible with 1, 5, 7. Good with 3, 9. Challenging with 2, 4, 6, 8.",
        2: "Most compatible with 2, 4, 6, 8. Good with 1, 9. Challenging with 3, 5, 7.",
        3: "Most compatible with 3, 6, 9. Good with 1, 5. Challenging with 2, 4, 7, 8.",
        4: "Most compatible with 2, 4, 8. Good with 6. Challenging with 1, 3, 5, 7, 9.",
        5: "Most compatible with 1, 5, 7. Good with 3, 9. Challenging with 2, 4, 6, 8.",
        6: "Most compatible with 2, 3, 6, 9. Good with 4, 8. Challenging with 1, 5, 7.",
        7: "Most compatible with 1, 5, 7. Good with 4. Challenging with 2, 3, 6, 8, 9.",
        8: "Most compatible with 2, 4, 8. Good with 6. Challenging with 1, 3, 5, 7, 9.",
        9: "Most compatible with 3, 6, 9. Good with 1, 2. Challenging with 4, 5, 7, 8.",
        11: "Most compatible with 2, 11, 22. Good with 6, 9. Needs understanding partner.",
        22: "Most compatible with 4, 22. Good with 2, 6, 8. Needs supportive partner.",
        33: "Most compatible with 6, 33. Good with 3, 9. Needs spiritually aware partner."
    }
    
    return compatibility.get(life_path, compatibility[1])

def get_health_predictions(life_path: int) -> str:
    """Get health predictions based on life path number"""
    
    health = {
        1: "Generally strong constitution. Watch for stress-related issues, heart problems, and high blood pressure. Regular exercise is essential.",
        2: "Sensitive nervous system. Prone to anxiety, digestive issues, and emotional imbalances. Need peaceful environment.",
        3: "Good vitality but may overindulge. Watch for throat, liver, and nervous system issues. Balance work and play.",
        4: "Strong physical constitution but may be prone to depression. Watch for digestive and circulatory issues. Need regular routine.",
        5: "Restless energy. Prone to nervous disorders, accidents, and overexertion. Need variety but also stability.",
        6: "Generally healthy but may worry too much about others. Watch for heart, throat, and reproductive issues. Practice self-care.",
        7: "May have mysterious health issues. Prone to mental fatigue, digestive problems, and isolation-related issues. Need spiritual practices.",
        8: "Strong constitution but may overwork. Watch for stress-related issues, joint problems, and material excess effects.",
        9: "May be prone to accidents and emotional stress. Watch for blood-related issues and overexertion. Need emotional balance.",
        11: "Highly sensitive system. Prone to nervous disorders and psychosomatic issues. Need spiritual practices and calm environment.",
        22: "Strong but may burn out from intense work. Need balance between material and spiritual pursuits.",
        33: "May sacrifice own health for others. Need to maintain boundaries and practice self-care while serving others."
    }
    
    return health.get(life_path, health[1])

def get_financial_outlook(life_path: int, destiny: int) -> str:
    """Get financial outlook based on numerology"""
    
    financial = {
        1: "Natural ability to earn and lead financially. Success through leadership and innovation. May be impulsive with money.",
        2: "Money comes through partnerships and cooperation. Steady but not spectacular gains. Good at saving and budgeting.",
        3: "Money through creative pursuits and communication. Irregular income but good earning potential. May spend on luxuries.",
        4: "Steady, methodical approach to wealth building. Good at saving and investing. Prefers security over speculation.",
        5: "Variable income through diverse sources. Good at making money quickly but may spend it just as fast. Need financial discipline.",
        6: "Money comes through service and helping others. Generous with family. Good at managing household finances.",
        7: "May not be primarily motivated by money. Wealth through knowledge and expertise. Prefers simple living.",
        8: "Strong potential for material success and wealth accumulation. Natural business acumen. May become overly focused on money.",
        9: "Money comes and goes freely. Generous and philanthropic. Success through helping others and humanitarian efforts.",
        11: "Money through inspirational work and spiritual pursuits. May not be materially focused but can attract abundance.",
        22: "Potential for great material success through large-scale projects. Can build lasting financial institutions.",
        33: "Money through teaching and healing. More focused on service than personal wealth but can attract abundance through giving."
    }
    
    primary = financial.get(life_path, financial[1])
    secondary = financial.get(destiny, "")
    
    if secondary and secondary != primary:
        return f"{primary}\n\nAdditional insight: {secondary}"
    
    return primary

@router.post("/calculate", response_model=NumerologyResponse)
async def calculate_numerology(
    numerology_data: NumerologyCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Calculate numerology predictions"""
    try:
        # Calculate all numerology numbers
        life_path_number = calculate_life_path_number(numerology_data.birth_date)
        destiny_number = calculate_name_number(numerology_data.name)
        soul_urge_number = calculate_vowel_number(numerology_data.name)
        personality_number = calculate_consonant_number(numerology_data.name)
        birth_day_number = calculate_birth_day_number(numerology_data.birth_date)
        maturity_number = calculate_single_digit(life_path_number + destiny_number)
        
        # Get lucky elements
        lucky_elements = get_lucky_elements(life_path_number, destiny_number)
        
        # Generate predictions
        personality_traits = get_personality_traits(life_path_number)
        career_guidance = get_career_guidance(life_path_number, destiny_number)
        relationship_compatibility = get_relationship_compatibility(life_path_number)
        health_predictions = get_health_predictions(life_path_number)
        financial_outlook = get_financial_outlook(life_path_number, destiny_number)
        
        # Create numerology record
        db_numerology = Numerology(
            user_id=current_user.id if current_user else None,
            name=numerology_data.name,
            birth_date=numerology_data.birth_date,
            life_path_number=life_path_number,
            destiny_number=destiny_number,
            soul_urge_number=soul_urge_number,
            personality_number=personality_number,
            maturity_number=maturity_number,
            birth_day_number=birth_day_number,
            lucky_numbers=','.join(map(str, lucky_elements['numbers'])),
            lucky_colors=','.join(lucky_elements['colors']),
            lucky_days=','.join(lucky_elements['days']),
            lucky_stones=','.join(lucky_elements['stones']),
            personality_traits=personality_traits,
            career_guidance=career_guidance,
            relationship_compatibility=relationship_compatibility,
            health_predictions=health_predictions,
            financial_outlook=financial_outlook
        )
        
        db.add(db_numerology)
        db.commit()
        db.refresh(db_numerology)
        
        return db_numerology
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating numerology: {str(e)}"
        )

@router.get("/user", response_model=List[NumerologyResponse])
async def get_user_numerology(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all numerology calculations for the current user"""
    numerology_records = db.query(Numerology).filter(Numerology.user_id == current_user.id).all()
    return numerology_records

@router.get("/{numerology_id}", response_model=NumerologyResponse)
async def get_numerology(
    numerology_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Get a specific numerology calculation by ID"""
    numerology = db.query(Numerology).filter(Numerology.id == numerology_id).first()
    
    if not numerology:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Numerology calculation not found"
        )
    
    # Check if user has access to this numerology calculation
    if current_user and numerology.user_id and numerology.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return numerology

@router.delete("/{numerology_id}")
async def delete_numerology(
    numerology_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a numerology calculation"""
    numerology = db.query(Numerology).filter(
        Numerology.id == numerology_id,
        Numerology.user_id == current_user.id
    ).first()
    
    if not numerology:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Numerology calculation not found"
        )
    
    db.delete(numerology)
    db.commit()
    
    return {"message": "Numerology calculation deleted successfully"}
