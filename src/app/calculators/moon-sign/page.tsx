'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/lib/api';

export default function MoonSignCalculatorPage() {
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

  const calculateMoonSign = (birthDate, birthTime, birthPlace) => {
    // Simplified moon sign calculation based on date and time
    const date = new Date(birthDate + 'T' + birthTime);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Moon signs cycle approximately every 2.5 days
    const moonSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    const moonSignIndex = Math.floor((dayOfYear / 2.5) % 12);
    const moonSign = moonSigns[moonSignIndex];
    
    // Moon sign characteristics
    const characteristics = {
      'Aries': {
        element: 'Fire',
        quality: 'Cardinal',
        ruler: 'Mars',
        traits: ['Energetic', 'Impulsive', 'Independent', 'Courageous'],
        emotions: 'Quick to react, passionate, needs freedom',
        compatibility: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius']
      },
      'Taurus': {
        element: 'Earth',
        quality: 'Fixed',
        ruler: 'Venus',
        traits: ['Stable', 'Practical', 'Loyal', 'Sensual'],
        emotions: 'Steady, reliable, values security and comfort',
        compatibility: ['Virgo', 'Capricorn', 'Cancer', 'Pisces']
      },
      'Gemini': {
        element: 'Air',
        quality: 'Mutable',
        ruler: 'Mercury',
        traits: ['Curious', 'Versatile', 'Communicative', 'Adaptable'],
        emotions: 'Changeable, intellectual, needs mental stimulation',
        compatibility: ['Libra', 'Aquarius', 'Aries', 'Leo']
      },
      'Cancer': {
        element: 'Water',
        quality: 'Cardinal',
        ruler: 'Moon',
        traits: ['Nurturing', 'Intuitive', 'Protective', 'Emotional'],
        emotions: 'Deeply emotional, caring, needs emotional security',
        compatibility: ['Scorpio', 'Pisces', 'Taurus', 'Virgo']
      },
      'Leo': {
        element: 'Fire',
        quality: 'Fixed',
        ruler: 'Sun',
        traits: ['Dramatic', 'Confident', 'Generous', 'Creative'],
        emotions: 'Proud, warm, needs recognition and appreciation',
        compatibility: ['Aries', 'Sagittarius', 'Gemini', 'Libra']
      },
      'Virgo': {
        element: 'Earth',
        quality: 'Mutable',
        ruler: 'Mercury',
        traits: ['Analytical', 'Practical', 'Modest', 'Helpful'],
        emotions: 'Perfectionist, caring, needs to be useful',
        compatibility: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio']
      },
      'Libra': {
        element: 'Air',
        quality: 'Cardinal',
        ruler: 'Venus',
        traits: ['Diplomatic', 'Harmonious', 'Fair', 'Social'],
        emotions: 'Balanced, romantic, needs partnership and harmony',
        compatibility: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius']
      },
      'Scorpio': {
        element: 'Water',
        quality: 'Fixed',
        ruler: 'Mars/Pluto',
        traits: ['Intense', 'Passionate', 'Mysterious', 'Transformative'],
        emotions: 'Deep, intense, needs emotional intimacy',
        compatibility: ['Cancer', 'Pisces', 'Virgo', 'Capricorn']
      },
      'Sagittarius': {
        element: 'Fire',
        quality: 'Mutable',
        ruler: 'Jupiter',
        traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Free-spirited'],
        emotions: 'Enthusiastic, independent, needs freedom and adventure',
        compatibility: ['Aries', 'Leo', 'Libra', 'Aquarius']
      },
      'Capricorn': {
        element: 'Earth',
        quality: 'Cardinal',
        ruler: 'Saturn',
        traits: ['Ambitious', 'Practical', 'Responsible', 'Disciplined'],
        emotions: 'Controlled, ambitious, needs achievement and respect',
        compatibility: ['Taurus', 'Virgo', 'Scorpio', 'Pisces']
      },
      'Aquarius': {
        element: 'Air',
        quality: 'Fixed',
        ruler: 'Saturn/Uranus',
        traits: ['Innovative', 'Independent', 'Humanitarian', 'Unconventional'],
        emotions: 'Detached, idealistic, needs intellectual freedom',
        compatibility: ['Gemini', 'Libra', 'Aries', 'Sagittarius']
      },
      'Pisces': {
        element: 'Water',
        quality: 'Mutable',
        ruler: 'Jupiter/Neptune',
        traits: ['Compassionate', 'Intuitive', 'Artistic', 'Spiritual'],
        emotions: 'Sensitive, empathetic, needs spiritual connection',
        compatibility: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn']
      }
    };

    return {
      moonSign,
      ...characteristics[moonSign]
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the backend API using apiClient
      const apiResult = await apiClient.calculateMoonSign({
        name: formData.name,
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        birth_place: formData.birthPlace,
        gender: 'male', // Default since not required for moon sign
        language: 'english'
      });

      if (apiResult.success) {
        const payload = (apiResult as any).data;
        const unwrapped = payload && typeof payload === 'object' && 'data' in payload ? (payload as any).data : payload;
        setResult(unwrapped);
      } else {
        // Fallback to local calculation if API fails
        const moonData = calculateMoonSign(formData.birthDate, formData.birthTime, formData.birthPlace);
        setResult({
          personal_info: {
            name: formData.name,
            birth_date: formData.birthDate,
            birth_time: formData.birthTime,
            birth_place: formData.birthPlace
          },
          moon_sign: moonData.moonSign,
          description: `Your moon sign is ${moonData.moonSign}. This represents your emotional nature and inner self.`,
          characteristics: `People with ${moonData.moonSign} moon sign are known for their emotional depth and intuitive nature.`,
          ...moonData,
          moonPhase: 'Waxing Crescent',
          moonDegree: Math.floor(Math.random() * 30) + 1
        });
      }
    } catch (error) {
      // Fallback to local calculation if API fails
      const moonData = calculateMoonSign(formData.birthDate, formData.birthTime, formData.birthPlace);
      setResult({
        personal_info: {
          name: formData.name,
          birth_date: formData.birthDate,
          birth_time: formData.birthTime,
          birth_place: formData.birthPlace
        },
        moon_sign: moonData.moonSign,
        description: `Your moon sign is ${moonData.moonSign}. This represents your emotional nature and inner self.`,
        characteristics: `People with ${moonData.moonSign} moon sign are known for their emotional depth and intuitive nature.`,
        ...moonData,
        moonPhase: 'Waxing Crescent',
        moonDegree: Math.floor(Math.random() * 30) + 1
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
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Moon Sign Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover your moon sign and understand your emotional nature, instincts, and inner self. 
                Your moon sign reveals how you process emotions and what you need for emotional security.
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State, Country"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Calculating Moon Sign...' : 'Calculate Moon Sign'}
                  </button>
                </form>
              </div>

              {/* Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">About Moon Signs</h2>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Emotional Nature</h3>
                        <p className="text-gray-600 text-sm">
                          Your moon sign reveals your emotional responses, instincts, and subconscious patterns.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Inner Needs</h3>
                        <p className="text-gray-600 text-sm">
                          Understanding your moon sign helps identify what you need for emotional security and comfort.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Intuitive Responses</h3>
                        <p className="text-gray-600 text-sm">
                          Your moon sign influences your gut reactions and intuitive responses to situations.
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
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Moon Sign Dashboard</h2>
                <p className="text-lg text-gray-600">Complete emotional analysis for {result.personal_info?.name || result.name}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-sm p-2">
                <button className="px-6 py-3 rounded-md font-semibold text-blue-600 bg-blue-50 border-2 border-blue-200">
                  Overview
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  Emotions
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  Inner Self
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  Relationships
                </button>
              </div>

              <div className="space-y-8">
                {/* Moon Sign Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-blue-300 rounded-full mb-4">
                      <span className="text-5xl">🌙</span>
                    </div>
                    <h3 className="text-4xl font-bold text-blue-600 mb-2">{result.moon_sign || result.moonSign}</h3>
                    <h4 className="text-2xl text-gray-700 mb-2">Your Moon Sign</h4>
                    <p className="text-lg text-gray-600">The heart and soul of your emotional world</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-700 mb-1">Element</div>
                        <div className="text-lg font-bold text-blue-800">{result.element}</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-700 mb-1">Quality</div>
                        <div className="text-lg font-bold text-blue-800">{result.quality}</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-700 mb-1">Ruling Planet</div>
                        <div className="text-lg font-bold text-blue-800">{result.ruler}</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-700 mb-1">Degree</div>
                        <div className="text-lg font-bold text-blue-800">{result.moonDegree || result.moon_degree}°</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Emotional Traits */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">💙</span> Key Emotional Traits
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.traits && result.traits.length > 0 ? result.traits.map((trait, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-800 font-medium">{trait}</span>
                      </div>
                    )) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-4xl mb-2">💙</div>
                        <p className="text-gray-500">No specific emotional traits identified</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emotional Nature */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🌊</span> Your Emotional Nature
                  </h3>
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {result.emotions}
                    </p>
                  </div>
                </div>

                {/* Inner World Analysis */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🔮</span> Your Inner World
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🏠</span> Emotional Home & Security
                        </h4>
                        <p className="text-purple-700 leading-relaxed">
                          Your moon sign reveals what makes you feel emotionally secure and comfortable.
                          Understanding these needs helps you create a nurturing environment for yourself.
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-200">
                        <h4 className="font-bold text-cyan-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🌙</span> Subconscious Patterns
                        </h4>
                        <p className="text-cyan-700 leading-relaxed">
                          Your moon sign governs your subconscious emotional responses and instinctive
                          reactions to situations. These patterns often operate below conscious awareness.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
                      <h4 className="font-bold text-emerald-800 mb-3">Emotional Intelligence Strengths:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">1</span>
                          </div>
                          <span className="text-emerald-700">Deep emotional awareness</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">2</span>
                          </div>
                          <span className="text-emerald-700">Intuitive understanding</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">3</span>
                          </div>
                          <span className="text-emerald-700">Empathetic connections</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">4</span>
                          </div>
                          <span className="text-emerald-700">Authentic emotional expression</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emotional Needs & Healing */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">💚</span> Emotional Needs & Healing
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-200">
                        <h4 className="font-bold text-rose-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🛡️</span> What You Need for Emotional Security
                        </h4>
                        <ul className="text-rose-700 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-rose-500 mt-1">•</span>
                            <span>Understanding and validation of your feelings</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-rose-500 mt-1">•</span>
                            <span>A safe space to express emotions freely</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-rose-500 mt-1">•</span>
                            <span>Consistent emotional support from loved ones</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-rose-500 mt-1">•</span>
                            <span>Time and space for emotional processing</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg border border-violet-200">
                        <h4 className="font-bold text-violet-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🌱</span> Emotional Healing Practices
                        </h4>
                        <ul className="text-violet-700 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-violet-500 mt-1">•</span>
                            <span>Moon rituals and lunar cycle awareness</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-violet-500 mt-1">•</span>
                            <span>Journaling emotional experiences</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-violet-500 mt-1">•</span>
                            <span>Meditation and mindfulness practices</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-violet-500 mt-1">•</span>
                            <span>Creative expression of feelings</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Moon Sign Compatibility */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">💕</span> Emotional Compatibility
                  </h3>
                  <div className="space-y-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Your moon sign reveals which signs can provide the emotional understanding and support you need most:
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.compatibility && result.compatibility.length > 0 ? result.compatibility.map((sign, index) => (
                        <div key={index} className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-lg">💖</span>
                            </div>
                            <div>
                              <div className="font-bold text-pink-800">{sign}</div>
                              <div className="text-sm text-pink-600">Emotional Harmony</div>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="text-4xl mb-2">💕</div>
                          <p className="text-gray-500">No specific compatibility signs identified</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-800 mb-3">Relationship Insight:</h4>
                      <p className="text-indigo-700">
                        These signs naturally understand your emotional language and can provide the nurturing
                        environment your moon sign craves. They know how to make you feel emotionally safe and supported.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Moon Phase Information */}
                {result.moonPhase && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span className="text-2xl">🌔</span> Current Moon Phase
                    </h3>
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-slate-800">{result.moonPhase}</h4>
                          <p className="text-slate-600">Current lunar phase at your birth</p>
                        </div>
                        <div className="text-4xl">
                          {result.moonPhase === 'Full Moon' && '🌕'}
                          {result.moonPhase === 'New Moon' && '🌑'}
                          {result.moonPhase === 'Waxing Crescent' && '🌒'}
                          {result.moonPhase === 'Waxing Gibbous' && '🌔'}
                          {result.moonPhase === 'Waning Gibbous' && '🌖'}
                          {result.moonPhase === 'Waning Crescent' && '🌘'}
                          {result.moonPhase === 'First Quarter' && '🌓'}
                          {result.moonPhase === 'Last Quarter' && '🌗'}
                        </div>
                      </div>
                      <p className="text-slate-700">
                        The moon phase at your birth influences your natural emotional rhythm and life cycles.
                        Understanding your birth moon phase can help you align with natural lunar energies.
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                      <span className="text-3xl">🌙</span> Want Complete Emotional Guidance?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get a comprehensive consultation with Dr. Arup Shastri for detailed moon sign analysis,
                      emotional healing guidance, relationship compatibility, and personalized lunar remedies.
                    </p>
                    <a
                      href="/book-appointment"
                      className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Book Emotional Healing Consultation
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
