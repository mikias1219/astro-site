'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/lib/api';

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

    try {
      // Call the backend API using apiClient
      const apiResult = await apiClient.calculateAscendant({
        name: formData.name,
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        birth_place: formData.birthPlace,
        gender: 'male', // Default since not required for ascendant
        language: 'english'
      });

      if (apiResult.success) {
        const payload = (apiResult as any).data;
        const unwrapped = payload && typeof payload === 'object' && 'data' in payload ? (payload as any).data : payload;
        setResult(unwrapped);
      } else {
        // Fallback to local calculation if API fails
        const ascendantData = calculateAscendant(formData.birthDate, formData.birthTime, formData.birthPlace);
        setResult({
          ascendant: ascendantData.ascendant,
          description: `Your ascendant (rising sign) is ${ascendantData.ascendant}. This represents your outward personality and how others see you.`,
          characteristics: `People with ${ascendantData.ascendant} ascendant are known for their strong personality and leadership qualities.`,
          degree: Math.floor(Math.random() * 30) + 1
        });
      }
    } catch (error) {
      // Fallback to local calculation if API fails
      const ascendantData = calculateAscendant(formData.birthDate, formData.birthTime, formData.birthPlace);
      setResult({
        ascendant: ascendantData.ascendant,
        description: `Your ascendant (rising sign) is ${ascendantData.ascendant}. This represents your outward personality and how others see you.`,
        characteristics: `People with ${ascendantData.ascendant} ascendant are known for their strong personality and leadership qualities.`,
        degree: Math.floor(Math.random() * 30) + 1
      });
    } finally {
      setLoading(false);
    }
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
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Ascendant Dashboard</h2>
                <p className="text-lg text-gray-600">Complete personality analysis for {result.name}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-sm p-2">
                <button className="px-6 py-3 rounded-md font-semibold text-purple-600 bg-purple-50 border-2 border-purple-200">
                  Overview
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                  Personality
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                  Appearance
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                  Compatibility
                </button>
              </div>

              <div className="space-y-8">
                {/* Ascendant Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-100 to-violet-100 border-4 border-purple-300 rounded-full mb-4">
                      <span className="text-5xl font-bold text-purple-600">{result.ascendant}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Your Rising Sign</h3>
                    <p className="text-lg text-gray-600">The mask you show to the world</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-purple-700 mb-1">Element</div>
                        <div className="text-lg font-bold text-purple-800">{result.element}</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-purple-700 mb-1">Quality</div>
                        <div className="text-lg font-bold text-purple-800">{result.quality}</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-purple-700 mb-1">Ruling Planet</div>
                        <div className="text-lg font-bold text-purple-800">{result.ruler}</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-purple-700 mb-1">Degree</div>
                        <div className="text-lg font-bold text-purple-800">{result.degree}°</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Traits */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">⭐</span> Key Personality Traits
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.traits && result.traits.length > 0 ? result.traits.map((trait, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-800 font-medium">{trait}</span>
                      </div>
                    )) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-4xl mb-2">⭐</div>
                        <p className="text-gray-500">No specific personality traits identified</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personality Analysis */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🧑</span> Personality Analysis
                  </h3>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {result.personality}
                    </p>
                  </div>
                </div>

                {/* Physical Appearance */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">👤</span> Physical Appearance
                  </h3>
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg border border-violet-200">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {result.appearance}
                    </p>
                  </div>
                </div>

                {/* Career Inclinations */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">💼</span> Career Inclinations
                  </h3>
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {result.career}
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-semibold text-indigo-800 mb-3">Best Career Fields:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {result.career.split(',').map((field, index) => (
                            <div key={index} className="bg-indigo-50 px-3 py-2 rounded text-sm text-indigo-700 text-center">
                              {field.trim()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compatibility Analysis */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">❤️</span> Ascendant Compatibility
                  </h3>
                  <div className="space-y-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Your ascendant sign has natural affinities with certain signs. These are the signs that understand your outward personality best:
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.compatibility && result.compatibility.length > 0 ? result.compatibility.map((sign, index) => (
                        <div key={index} className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-bold text-pink-800">{sign}</div>
                              <div className="text-sm text-pink-600">High Compatibility</div>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="text-4xl mb-2">❤️</div>
                          <p className="text-gray-500">No specific compatibility signs identified</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3">Compatibility Insight:</h4>
                      <p className="text-blue-700">
                        People with these ascendant signs will naturally understand your communication style,
                        first impressions, and how you approach new situations. This creates stronger initial
                        connections and better long-term understanding.
                      </p>
                    </div>
                  </div>
                </div>

                {/* First Impressions */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">👀</span> First Impressions & Social Dynamics
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg border border-emerald-200">
                        <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🚀</span> How Others See You
                        </h4>
                        <p className="text-emerald-700 leading-relaxed">
                          Your ascendant creates the first impression people have of you. It's like a social mask
                          that determines how you're perceived in new situations and social settings.
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                        <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">⚡</span> Approach to New Situations
                        </h4>
                        <p className="text-orange-700 leading-relaxed">
                          Your ascendant influences how you initiate projects, meet new people, and adapt to
                          unfamiliar environments. It governs your instinctive responses to change.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                      <h4 className="font-bold text-indigo-800 mb-3">Key Social Strengths:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">1</span>
                          </div>
                          <span className="text-indigo-700">Natural social adaptation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">2</span>
                          </div>
                          <span className="text-indigo-700">Instinctive communication style</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">3</span>
                          </div>
                          <span className="text-indigo-700">Immediate situational awareness</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">4</span>
                          </div>
                          <span className="text-indigo-700">Adaptive behavioral patterns</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl shadow-lg p-8 border-2 border-purple-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                      <span className="text-3xl">👨‍⚕️</span> Want Complete Personality Analysis?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get a comprehensive consultation with Dr. Arup Shastri for detailed ascendant analysis,
                      career guidance, relationship compatibility, and personalized insights based on your complete birth chart.
                    </p>
                    <a
                      href="/book-appointment"
                      className="inline-block bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Book Personality Consultation
                    </a>
                  </div>
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
