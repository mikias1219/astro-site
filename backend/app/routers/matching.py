"""
Horoscope matching and compatibility API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import math

from app.database import get_db
from app.models import Matching, Kundli, User
from app.schemas import MatchingCreate, MatchingResponse
from app.auth import get_current_user, get_optional_current_user

router = APIRouter(prefix="/matching", tags=["matching"])

# Ashtakoot compatibility rules
VARNA_COMPATIBILITY = {
    ('Brahmin', 'Brahmin'): 1, ('Brahmin', 'Kshatriya'): 1, ('Brahmin', 'Vaishya'): 1, ('Brahmin', 'Shudra'): 1,
    ('Kshatriya', 'Kshatriya'): 1, ('Kshatriya', 'Vaishya'): 1, ('Kshatriya', 'Shudra'): 1,
    ('Vaishya', 'Vaishya'): 1, ('Vaishya', 'Shudra'): 1,
    ('Shudra', 'Shudra'): 1
}

VASHYA_COMPATIBILITY = {
    ('Human', 'Human'): 2, ('Quadruped', 'Quadruped'): 2, ('Jalachara', 'Jalachara'): 2,
    ('Vanachara', 'Vanachara'): 2, ('Keeta', 'Keeta'): 2,
    ('Human', 'Jalachara'): 1, ('Quadruped', 'Vanachara'): 1
}

GANA_COMPATIBILITY = {
    ('Deva', 'Deva'): 6, ('Manushya', 'Manushya'): 6, ('Rakshasa', 'Rakshasa'): 6,
    ('Deva', 'Manushya'): 6, ('Manushya', 'Deva'): 6,
    ('Deva', 'Rakshasa'): 0, ('Rakshasa', 'Deva'): 0,
    ('Manushya', 'Rakshasa'): 0, ('Rakshasa', 'Manushya'): 0
}

# Nakshatra properties for matching
NAKSHATRA_PROPERTIES = {
    'Ashwini': {'varna': 'Vaishya', 'vashya': 'Quadruped', 'gana': 'Deva', 'yoni': 'Horse'},
    'Bharani': {'varna': 'Kshatriya', 'vashya': 'Human', 'gana': 'Manushya', 'yoni': 'Elephant'},
    'Krittika': {'varna': 'Brahmin', 'vashya': 'Quadruped', 'gana': 'Rakshasa', 'yoni': 'Goat'},
    'Rohini': {'varna': 'Shudra', 'vashya': 'Human', 'gana': 'Manushya', 'yoni': 'Serpent'},
    'Mrigashira': {'varna': 'Vaishya', 'vashya': 'Quadruped', 'gana': 'Deva', 'yoni': 'Serpent'},
    'Ardra': {'varna': 'Shudra', 'vashya': 'Human', 'gana': 'Manushya', 'yoni': 'Dog'},
    'Punarvasu': {'varna': 'Vaishya', 'vashya': 'Quadruped', 'gana': 'Deva', 'yoni': 'Cat'},
    'Pushya': {'varna': 'Kshatriya', 'vashya': 'Quadruped', 'gana': 'Deva', 'yoni': 'Goat'},
    'Ashlesha': {'varna': 'Kshatriya', 'vashya': 'Jalachara', 'gana': 'Rakshasa', 'yoni': 'Cat'},
    'Magha': {'varna': 'Shudra', 'vashya': 'Quadruped', 'gana': 'Rakshasa', 'yoni': 'Rat'},
    'Purva Phalguni': {'varna': 'Brahmin', 'vashya': 'Human', 'gana': 'Rakshasa', 'yoni': 'Rat'},
    'Uttara Phalguni': {'varna': 'Kshatriya', 'vashya': 'Human', 'gana': 'Manushya', 'yoni': 'Cow'},
    'Hasta': {'varna': 'Vaishya', 'vashya': 'Human', 'gana': 'Deva', 'yoni': 'Buffalo'},
    'Chitra': {'varna': 'Vaishya', 'vashya': 'Quadruped', 'gana': 'Rakshasa', 'yoni': 'Tiger'},
    'Swati': {'varna': 'Shudra', 'vashya': 'Human', 'gana': 'Deva', 'yoni': 'Buffalo'},
    'Vishakha': {'varna': 'Kshatriya', 'vashya': 'Quadruped', 'gana': 'Rakshasa', 'yoni': 'Tiger'},
    'Anuradha': {'varna': 'Shudra', 'vashya': 'Human', 'gana': 'Deva', 'yoni': 'Deer'},
    'Jyeshtha': {'varna': 'Kshatriya', 'vashya': 'Jalachara', 'gana': 'Rakshasa', 'yoni': 'Deer'},
    'Mula': {'varna': 'Kshatriya', 'vashya': 'Quadruped', 'gana': 'Rakshasa', 'yoni': 'Dog'},
    'Purva Ashadha': {'varna': 'Brahmin', 'vashya': 'Human', 'gana': 'Manushya', 'yoni': 'Monkey'},
    'Uttara Ashadha': {'varna': 'Kshatriya', 'vashya': 'Quadruped', 'gana': 'Manushya', 'yoni': 'Mongoose'},
    'Shravana': {'varna': 'Kshatriya', 'vashya': 'Quadruped', 'gana': 'Deva', 'yoni': 'Monkey'},
    'Dhanishta': {'varna': 'Vaishya', 'vashya': 'Quadruped', 'gana': 'Rakshasa', 'yoni': 'Lion'},
    'Shatabhisha': {'varna': 'Brahmin', 'vashya': 'Jalachara', 'gana': 'Rakshasa', 'yoni': 'Horse'},
    'Purva Bhadrapada': {'varna': 'Brahmin', 'vashya': 'Human', 'gana': 'Manushya', 'yoni': 'Lion'},
    'Uttara Bhadrapada': {'varna': 'Kshatriya', 'vashya': 'Human', 'gana': 'Manushya', 'yoni': 'Cow'},
    'Revati': {'varna': 'Shudra', 'vashya': 'Jalachara', 'gana': 'Deva', 'yoni': 'Elephant'}
}

YONI_COMPATIBILITY = {
    ('Horse', 'Horse'): 4, ('Elephant', 'Elephant'): 4, ('Goat', 'Goat'): 4,
    ('Serpent', 'Serpent'): 4, ('Dog', 'Dog'): 4, ('Cat', 'Cat'): 4,
    ('Rat', 'Rat'): 4, ('Cow', 'Cow'): 4, ('Buffalo', 'Buffalo'): 4,
    ('Tiger', 'Tiger'): 4, ('Deer', 'Deer'): 4, ('Monkey', 'Monkey'): 4,
    ('Mongoose', 'Mongoose'): 4, ('Lion', 'Lion'): 4,
    
    # Friendly combinations
    ('Horse', 'Elephant'): 3, ('Elephant', 'Horse'): 3,
    ('Goat', 'Monkey'): 3, ('Monkey', 'Goat'): 3,
    ('Cow', 'Buffalo'): 3, ('Buffalo', 'Cow'): 3,
    
    # Neutral combinations
    ('Dog', 'Deer'): 2, ('Deer', 'Dog'): 2,
    ('Cat', 'Rat'): 1, ('Rat', 'Cat'): 1,
    
    # Enemy combinations
    ('Tiger', 'Monkey'): 0, ('Monkey', 'Tiger'): 0,
    ('Lion', 'Elephant'): 0, ('Elephant', 'Lion'): 0,
    ('Serpent', 'Mongoose'): 0, ('Mongoose', 'Serpent'): 0
}

def calculate_varna_score(male_nakshatra: str, female_nakshatra: str) -> int:
    """Calculate Varna compatibility score"""
    male_varna = NAKSHATRA_PROPERTIES.get(male_nakshatra, {}).get('varna', 'Shudra')
    female_varna = NAKSHATRA_PROPERTIES.get(female_nakshatra, {}).get('varna', 'Shudra')
    
    return VARNA_COMPATIBILITY.get((male_varna, female_varna), 0)

def calculate_vashya_score(male_nakshatra: str, female_nakshatra: str) -> int:
    """Calculate Vashya compatibility score"""
    male_vashya = NAKSHATRA_PROPERTIES.get(male_nakshatra, {}).get('vashya', 'Human')
    female_vashya = NAKSHATRA_PROPERTIES.get(female_nakshatra, {}).get('vashya', 'Human')
    
    return VASHYA_COMPATIBILITY.get((male_vashya, female_vashya), 0)

def calculate_tara_score(male_nakshatra: str, female_nakshatra: str) -> int:
    """Calculate Tara (Star) compatibility score"""
    nakshatras = list(NAKSHATRA_PROPERTIES.keys())
    
    try:
        male_index = nakshatras.index(male_nakshatra)
        female_index = nakshatras.index(female_nakshatra)
        
        # Calculate Tara from female to male
        tara_count = ((male_index - female_index) % 27) + 1
        
        # Favorable taras: 1, 3, 4, 5, 6, 7, 9, 10, 11, 13, 15, 16, 17, 19, 20, 21, 23, 24, 25, 27
        favorable_taras = [1, 3, 4, 5, 6, 7, 9, 10, 11, 13, 15, 16, 17, 19, 20, 21, 23, 24, 25, 27]
        
        if tara_count in favorable_taras:
            return 3
        elif tara_count in [2, 8, 12, 14, 18, 22, 26]:
            return 1
        else:
            return 0
            
    except ValueError:
        return 1  # Default score if nakshatra not found

def calculate_yoni_score(male_nakshatra: str, female_nakshatra: str) -> int:
    """Calculate Yoni compatibility score"""
    male_yoni = NAKSHATRA_PROPERTIES.get(male_nakshatra, {}).get('yoni', 'Horse')
    female_yoni = NAKSHATRA_PROPERTIES.get(female_nakshatra, {}).get('yoni', 'Horse')
    
    return YONI_COMPATIBILITY.get((male_yoni, female_yoni), 2)

def calculate_graha_maitri_score(male_moon_sign: str, female_moon_sign: str) -> int:
    """Calculate Graha Maitri (Planetary friendship) score"""
    # Simplified planetary friendship calculation
    sign_lords = {
        'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
        'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
        'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    }
    
    male_lord = sign_lords.get(male_moon_sign, 'Sun')
    female_lord = sign_lords.get(female_moon_sign, 'Moon')
    
    # Planetary friendships (simplified)
    friendships = {
        ('Sun', 'Moon'): 4, ('Sun', 'Mars'): 5, ('Sun', 'Jupiter'): 5,
        ('Moon', 'Sun'): 4, ('Moon', 'Mercury'): 4, ('Moon', 'Jupiter'): 4,
        ('Mars', 'Sun'): 5, ('Mars', 'Moon'): 4, ('Mars', 'Jupiter'): 4,
        ('Mercury', 'Sun'): 4, ('Mercury', 'Venus'): 5, ('Mercury', 'Saturn'): 4,
        ('Jupiter', 'Sun'): 5, ('Jupiter', 'Moon'): 4, ('Jupiter', 'Mars'): 4,
        ('Venus', 'Mercury'): 5, ('Venus', 'Saturn'): 5,
        ('Saturn', 'Mercury'): 4, ('Saturn', 'Venus'): 5
    }
    
    return friendships.get((male_lord, female_lord), 2)

def calculate_gana_score(male_nakshatra: str, female_nakshatra: str) -> int:
    """Calculate Gana compatibility score"""
    male_gana = NAKSHATRA_PROPERTIES.get(male_nakshatra, {}).get('gana', 'Manushya')
    female_gana = NAKSHATRA_PROPERTIES.get(female_nakshatra, {}).get('gana', 'Manushya')
    
    return GANA_COMPATIBILITY.get((male_gana, female_gana), 0)

def calculate_bhakoot_score(male_moon_sign: str, female_moon_sign: str) -> int:
    """Calculate Bhakoot (Love) compatibility score"""
    signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
             'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    
    try:
        male_index = signs.index(male_moon_sign)
        female_index = signs.index(female_moon_sign)
        
        difference = abs(male_index - female_index)
        
        # Favorable differences: 1, 3, 4, 5, 7, 9, 10, 11
        if difference in [1, 3, 4, 5, 7, 9, 10, 11]:
            return 7
        elif difference in [2, 6, 8]:
            return 0  # Unfavorable
        else:
            return 4  # Neutral
            
    except ValueError:
        return 4  # Default score

def calculate_nadi_score(male_nakshatra: str, female_nakshatra: str) -> int:
    """Calculate Nadi compatibility score"""
    # Nadi classification
    aadi_nadi = ['Ashwini', 'Ardra', 'Punarvasu', 'Uttara Phalguni', 'Hasta', 'Jyeshtha',
                 'Mula', 'Shatabhisha', 'Purva Bhadrapada']
    madhya_nadi = ['Bharani', 'Mrigashira', 'Pushya', 'Purva Phalguni', 'Chitra', 'Anuradha',
                   'Purva Ashadha', 'Dhanishta', 'Uttara Bhadrapada']
    antya_nadi = ['Krittika', 'Rohini', 'Ashlesha', 'Magha', 'Swati', 'Vishakha',
                  'Uttara Ashadha', 'Shravana', 'Revati']
    
    def get_nadi(nakshatra):
        if nakshatra in aadi_nadi:
            return 'Aadi'
        elif nakshatra in madhya_nadi:
            return 'Madhya'
        elif nakshatra in antya_nadi:
            return 'Antya'
        return 'Aadi'  # Default
    
    male_nadi = get_nadi(male_nakshatra)
    female_nadi = get_nadi(female_nakshatra)
    
    # Same nadi is generally not favorable
    if male_nadi == female_nadi:
        return 0
    else:
        return 8

def generate_compatibility_analysis(scores: dict, male_name: str, female_name: str) -> dict:
    """Generate detailed compatibility analysis"""
    total_score = sum(scores.values())
    percentage = (total_score / 36) * 100
    
    if percentage >= 75:
        level = "Excellent"
        description = "This is an excellent match with very high compatibility."
    elif percentage >= 60:
        level = "Good"
        description = "This is a good match with favorable compatibility."
    elif percentage >= 45:
        level = "Average"
        description = "This match has average compatibility with some challenges."
    else:
        level = "Poor"
        description = "This match may face significant challenges."
    
    analysis = {
        'overall': {
            'total_score': total_score,
            'percentage': round(percentage, 1),
            'level': level,
            'description': description
        },
        'detailed_scores': {
            'varna': {'score': scores['varna'], 'max': 1, 'description': 'Spiritual compatibility'},
            'vashya': {'score': scores['vashya'], 'max': 2, 'description': 'Mutual control and influence'},
            'tara': {'score': scores['tara'], 'max': 3, 'description': 'Health and well-being'},
            'yoni': {'score': scores['yoni'], 'max': 4, 'description': 'Sexual compatibility'},
            'graha_maitri': {'score': scores['graha_maitri'], 'max': 5, 'description': 'Mental compatibility'},
            'gana': {'score': scores['gana'], 'max': 6, 'description': 'Temperament matching'},
            'bhakoot': {'score': scores['bhakoot'], 'max': 7, 'description': 'Love and emotional bonding'},
            'nadi': {'score': scores['nadi'], 'max': 8, 'description': 'Genetic compatibility'}
        },
        'strengths': [],
        'challenges': [],
        'recommendations': []
    }
    
    # Add specific analysis based on scores
    if scores['varna'] == 1:
        analysis['strengths'].append("Good spiritual compatibility")
    
    if scores['gana'] >= 6:
        analysis['strengths'].append("Excellent temperament matching")
    elif scores['gana'] == 0:
        analysis['challenges'].append("Temperament differences may cause conflicts")
    
    if scores['nadi'] == 0:
        analysis['challenges'].append("Same Nadi - may affect progeny")
        analysis['recommendations'].append("Perform specific remedies for Nadi dosha")
    
    if scores['bhakoot'] == 0:
        analysis['challenges'].append("Bhakoot dosha present - may affect prosperity")
        analysis['recommendations'].append("Consult astrologer for Bhakoot dosha remedies")
    
    if percentage < 50:
        analysis['recommendations'].append("Consider performing compatibility enhancement rituals")
        analysis['recommendations'].append("Consult with experienced astrologer for guidance")
    
    return analysis

@router.post("/calculate", response_model=MatchingResponse)
async def calculate_matching(
    matching_data: MatchingCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Calculate horoscope matching compatibility"""
    try:
        # Get kundli data
        male_kundli = db.query(Kundli).filter(Kundli.id == matching_data.male_kundli_id).first()
        female_kundli = db.query(Kundli).filter(Kundli.id == matching_data.female_kundli_id).first()
        
        if not male_kundli or not female_kundli:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="One or both kundlis not found"
            )
        
        # Calculate Ashtakoot scores
        varna_score = calculate_varna_score(male_kundli.nakshatra, female_kundli.nakshatra)
        vashya_score = calculate_vashya_score(male_kundli.nakshatra, female_kundli.nakshatra)
        tara_score = calculate_tara_score(male_kundli.nakshatra, female_kundli.nakshatra)
        yoni_score = calculate_yoni_score(male_kundli.nakshatra, female_kundli.nakshatra)
        graha_maitri_score = calculate_graha_maitri_score(male_kundli.moon_sign, female_kundli.moon_sign)
        gana_score = calculate_gana_score(male_kundli.nakshatra, female_kundli.nakshatra)
        bhakoot_score = calculate_bhakoot_score(male_kundli.moon_sign, female_kundli.moon_sign)
        nadi_score = calculate_nadi_score(male_kundli.nakshatra, female_kundli.nakshatra)
        
        total_score = (varna_score + vashya_score + tara_score + yoni_score + 
                      graha_maitri_score + gana_score + bhakoot_score + nadi_score)
        
        compatibility_percentage = (total_score / 36) * 100
        
        # Determine compatibility level
        if compatibility_percentage >= 75:
            compatibility_level = "Excellent"
        elif compatibility_percentage >= 60:
            compatibility_level = "Good"
        elif compatibility_percentage >= 45:
            compatibility_level = "Average"
        else:
            compatibility_level = "Poor"
        
        # Generate detailed analysis
        scores = {
            'varna': varna_score,
            'vashya': vashya_score,
            'tara': tara_score,
            'yoni': yoni_score,
            'graha_maitri': graha_maitri_score,
            'gana': gana_score,
            'bhakoot': bhakoot_score,
            'nadi': nadi_score
        }
        
        analysis = generate_compatibility_analysis(scores, matching_data.male_name, matching_data.female_name)
        
        # Create matching record
        db_matching = Matching(
            user_id=current_user.id if current_user else None,
            male_kundli_id=matching_data.male_kundli_id,
            female_kundli_id=matching_data.female_kundli_id,
            male_name=matching_data.male_name,
            female_name=matching_data.female_name,
            matching_type=matching_data.matching_type,
            varna_score=varna_score,
            vashya_score=vashya_score,
            tara_score=tara_score,
            yoni_score=yoni_score,
            graha_maitri_score=graha_maitri_score,
            gana_score=gana_score,
            bhakoot_score=bhakoot_score,
            nadi_score=nadi_score,
            total_score=total_score,
            compatibility_percentage=compatibility_percentage,
            compatibility_level=compatibility_level,
            detailed_analysis=json.dumps(analysis),
            recommendations=json.dumps(analysis.get('recommendations', [])),
            remedies=json.dumps([])  # Can be populated with specific remedies
        )
        
        db.add(db_matching)
        db.commit()
        db.refresh(db_matching)
        
        return db_matching
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating matching: {str(e)}"
        )

@router.get("/user", response_model=List[MatchingResponse])
async def get_user_matchings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all matchings for the current user"""
    matchings = db.query(Matching).filter(Matching.user_id == current_user.id).all()
    return matchings

@router.get("/{matching_id}", response_model=MatchingResponse)
async def get_matching(
    matching_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Get a specific matching by ID"""
    matching = db.query(Matching).filter(Matching.id == matching_id).first()
    
    if not matching:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Matching not found"
        )
    
    # Check if user has access to this matching
    if current_user and matching.user_id and matching.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return matching

@router.delete("/{matching_id}")
async def delete_matching(
    matching_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a matching"""
    matching = db.query(Matching).filter(
        Matching.id == matching_id,
        Matching.user_id == current_user.id
    ).first()
    
    if not matching:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Matching not found"
        )
    
    db.delete(matching)
    db.commit()
    
    return {"message": "Matching deleted successfully"}
