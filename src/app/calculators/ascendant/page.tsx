'use client';

import { useState } from 'react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

export default function AscendantCalculatorPage() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAscendant = (birthDate, birthTime, birthPlace) => {
    // Simplified ascendant calculation based on birth time
    const date = new Date(birthDate + 'T' + birthTime);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const totalMinutes = hour * 60 + minute;
    
    // Ascendant signs change approximately every 2 hours
    const ascendantSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    const ascendantIndex = Math.floor((totalMinutes / 120) % 12);
    const ascendant = ascendantSigns[ascendantIndex];
    
    // Ascendant characteristics
    const characteristics = {
      'Aries': {
        element: 'Fire',
        quality: 'Cardinal',
        ruler: 'Mars',
        appearance: 'Strong features, athletic build, confident demeanor',
        personality: 'Bold, energetic, pioneering, direct',
        traits: ['Leadership', 'Courage', 'Independence', 'Assertiveness'],
        career: 'Entrepreneur, athlete, military, surgeon',
        compatibility: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius']
      },
      'Taurus': {
        element: 'Earth',
        quality: 'Fixed',
        ruler: 'Venus',
        appearance: 'Pleasant features, solid build, graceful movements',
        personality: 'Stable, practical, sensual, reliable',
        traits: ['Patience', 'Loyalty', 'Determination', 'Sensuality'],
        career: 'Banking, agriculture, arts, real estate',
        compatibility: ['Virgo', 'Capricorn', 'Cancer', 'Pisces']
      },
      'Gemini': {
        element: 'Air',
        quality: 'Mutable',
        ruler: 'Mercury',
        appearance: 'Youthful features, expressive eyes, quick movements',
        personality: 'Curious, communicative, adaptable, witty',
        traits: ['Versatility', 'Intelligence', 'Social skills', 'Adaptability'],
        career: 'Journalism, teaching, sales, technology',
        compatibility: ['Libra', 'Aquarius', 'Aries', 'Leo']
      },
      'Cancer': {
        element: 'Water',
        quality: 'Cardinal',
        ruler: 'Moon',
        appearance: 'Round face, soft features, nurturing presence',
        personality: 'Nurturing, intuitive, protective, emotional',
        traits: ['Empathy', 'Intuition', 'Protectiveness', 'Emotional depth'],
        career: 'Nursing, hospitality, real estate, family business',
        compatibility: ['Scorpio', 'Pisces', 'Taurus', 'Virgo']
      },
      'Leo': {
        element: 'Fire',
        quality: 'Fixed',
        ruler: 'Sun',
        appearance: 'Regal bearing, confident posture, magnetic presence',
        personality: 'Dramatic, confident, generous, creative',
        traits: ['Charisma', 'Creativity', 'Generosity', 'Leadership'],
        career: 'Entertainment, politics, management, arts',
        compatibility: ['Aries', 'Sagittarius', 'Gemini', 'Libra']
      },
      'Virgo': {
        element: 'Earth',
        quality: 'Mutable',
        ruler: 'Mercury',
        appearance: 'Refined features, neat appearance, intelligent eyes',
        personality: 'Analytical, practical, modest, helpful',
        traits: ['Precision', 'Service', 'Modesty', 'Analytical mind'],
        career: 'Healthcare, research, accounting, administration',
        compatibility: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio']
      },
      'Libra': {
        element: 'Air',
        quality: 'Cardinal',
        ruler: 'Venus',
        appearance: 'Balanced features, graceful movements, charming smile',
        personality: 'Diplomatic, harmonious, fair, social',
        traits: ['Balance', 'Diplomacy', 'Charm', 'Fairness'],
        career: 'Law, diplomacy, fashion, counseling',
        compatibility: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius']
      },
      'Scorpio': {
        element: 'Water',
        quality: 'Fixed',
        ruler: 'Mars/Pluto',
        appearance: 'Intense eyes, magnetic presence, strong features',
        personality: 'Intense, passionate, mysterious, transformative',
        traits: ['Intensity', 'Passion', 'Transformation', 'Mystery'],
        career: 'Psychology, investigation, research, healing',
        compatibility: ['Cancer', 'Pisces', 'Virgo', 'Capricorn']
      },
      'Sagittarius': {
        element: 'Fire',
        quality: 'Mutable',
        ruler: 'Jupiter',
        appearance: 'Optimistic expression, athletic build, adventurous look',
        personality: 'Adventurous, optimistic, philosophical, free-spirited',
        traits: ['Adventure', 'Optimism', 'Philosophy', 'Freedom'],
        career: 'Travel, education, publishing, sports',
        compatibility: ['Aries', 'Leo', 'Libra', 'Aquarius']
      },
      'Capricorn': {
        element: 'Earth',
        quality: 'Cardinal',
        ruler: 'Saturn',
        appearance: 'Mature features, serious expression, professional bearing',
        personality: 'Ambitious, practical, responsible, disciplined',
        traits: ['Ambition', 'Discipline', 'Responsibility', 'Achievement'],
        career: 'Management, politics, engineering, finance',
        compatibility: ['Taurus', 'Virgo', 'Scorpio', 'Pisces']
      },
      'Aquarius': {
        element: 'Air',
        quality: 'Fixed',
        ruler: 'Saturn/Uranus',
        appearance: 'Unique features, friendly expression, modern style',
        personality: 'Innovative, independent, humanitarian, unconventional',
        traits: ['Innovation', 'Independence', 'Humanitarianism', 'Uniqueness'],
        career: 'Technology, science, social work, innovation',
        compatibility: ['Gemini', 'Libra', 'Aries', 'Sagittarius']
      },
      'Pisces': {
        element: 'Water',
        quality: 'Mutable',
        ruler: 'Jupiter/Neptune',
        appearance: 'Dreamy eyes, gentle features, artistic aura',
        personality: 'Compassionate, intuitive, artistic, spiritual',
        traits: ['Compassion', 'Intuition', 'Artistry', 'Spirituality'],
        career: 'Arts, healing, spirituality, charity work',
        compatibility: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn']
      }
    };

    return {
      ascendant,
      ...characteristics[ascendant]
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const ascendantData = calculateAscendant(formData.birthDate, formData.birthTime, formData.birthPlace);
      
      setResult({
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        ...ascendantData,
        degree: Math.floor(Math.random() * 30) + 1
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Ascendant Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover your rising sign (ascendant) and understand your outward personality, 
                appearance, and how others perceive you. Your ascendant is your social mask and first impression.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Form */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Enter Your Birth Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Date *
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="birthTime" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Time *
                    </label>
                    <input
                      type="time"
                      id="birthTime"
                      name="birthTime"
                      value={formData.birthTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="birthPlace" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Place *
                    </label>
                    <input
                      type="text"
                      id="birthPlace"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="City, State, Country"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Calculating Ascendant...' : 'Calculate Ascendant'}
                  </button>
                </form>
              </div>

              {/* Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">About Ascendant</h2>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">First Impression</h3>
                        <p className="text-gray-600 text-sm">
                          Your ascendant represents how you appear to others and your immediate reaction to new situations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Physical Appearance</h3>
                        <p className="text-gray-600 text-sm">
                          Your rising sign influences your physical appearance, style, and how you present yourself.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Life Approach</h3>
                        <p className="text-gray-600 text-sm">
                          Your ascendant shows your approach to life and how you initiate new projects and relationships.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Ascendant Analysis</h2>
                <p className="text-lg text-gray-600">Personality profile for {result.name}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Ascendant Details */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center mb-8">
                    <div className="text-6xl font-bold text-purple-600 mb-4">{result.ascendant}</div>
                    <div className="text-2xl text-gray-700">Your Rising Sign</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700">Element:</span>
                      <span className="text-gray-800">{result.element}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700">Quality:</span>
                      <span className="text-gray-800">{result.quality}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700">Ruler:</span>
                      <span className="text-gray-800">{result.ruler}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-gray-700">Degree:</span>
                      <span className="text-gray-800">{result.degree}°</span>
                    </div>
                  </div>
                </div>

                {/* Key Traits */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Traits</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {result.traits.map((trait, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 text-sm">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personality */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Personality</h3>
                  <p className="text-gray-700 leading-relaxed">{result.personality}</p>
                </div>

                {/* Appearance */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Physical Appearance</h3>
                  <p className="text-gray-700 leading-relaxed">{result.appearance}</p>
                </div>

                {/* Career */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Career Inclinations</h3>
                  <p className="text-gray-700">{result.career}</p>
                </div>

                {/* Compatibility */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Ascendant Compatibility</h3>
                  <div className="space-y-2">
                    {result.compatibility.map((sign, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-gray-700">{sign}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Want Complete Chart Analysis?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get a comprehensive consultation with Dr. Arup Shastri for detailed ascendant analysis, 
                    career guidance, and personality insights.
                  </p>
                  <a
                    href="/book-appointment"
                    className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Book Consultation
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
