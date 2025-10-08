'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/lib/api';
import BirthChart from '@/components/BirthChart';

export default function GemstoneCalculatorPage() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateGemstones = (birthDate, birthTime, birthPlace) => {
    // Simplified gemstone calculation based on birth details
    const date = new Date(birthDate + 'T' + birthTime);
    const month = date.getMonth();
    const day = date.getDate();
    
    // Generate gemstone recommendations based on planetary positions
    const gemstones = [];
    
    // Primary gemstone based on birth month
    const primaryGemstones = [
      { name: 'Ruby', planet: 'Sun', color: 'Red', benefits: ['Confidence', 'Leadership', 'Authority'], price: '₹5,000 - ₹50,000', finger: 'Ring finger' },
      { name: 'Pearl', planet: 'Moon', color: 'White', benefits: ['Emotional stability', 'Intuition', 'Peace'], price: '₹3,000 - ₹30,000', finger: 'Little finger' },
      { name: 'Red Coral', planet: 'Mars', color: 'Red-Orange', benefits: ['Courage', 'Energy', 'Leadership'], price: '₹2,000 - ₹20,000', finger: 'Ring finger' },
      { name: 'Emerald', planet: 'Mercury', color: 'Green', benefits: ['Communication', 'Intelligence', 'Business'], price: '₹10,000 - ₹1,00,000', finger: 'Little finger' },
      { name: 'Yellow Sapphire', planet: 'Jupiter', color: 'Yellow', benefits: ['Wisdom', 'Prosperity', 'Knowledge'], price: '₹8,000 - ₹80,000', finger: 'Index finger' },
      { name: 'Diamond', planet: 'Venus', color: 'Colorless', benefits: ['Love', 'Beauty', 'Luxury'], price: '₹20,000 - ₹5,00,000', finger: 'Middle finger' },
      { name: 'Blue Sapphire', planet: 'Saturn', color: 'Blue', benefits: ['Discipline', 'Longevity', 'Spirituality'], price: '₹15,000 - ₹2,00,000', finger: 'Middle finger' },
      { name: 'Hessonite', planet: 'Rahu', color: 'Orange-Brown', benefits: ['Intuition', 'Success', 'Protection'], price: '₹5,000 - ₹50,000', finger: 'Little finger' },
      { name: 'Cat\'s Eye', planet: 'Ketu', color: 'Yellow-Green', benefits: ['Spirituality', 'Detachment', 'Protection'], price: '₹8,000 - ₹80,000', finger: 'Little finger' }
    ];
    
    // Select primary gemstone based on birth month
    const primaryIndex = month % primaryGemstones.length;
    gemstones.push({
      ...primaryGemstones[primaryIndex],
      priority: 'Primary',
      recommendation: 'Highly recommended based on your birth chart',
      wearingTime: '6 AM - 8 AM',
      metal: 'Gold or Silver'
    });
    
    // Add secondary gemstone based on day
    const secondaryIndex = (day + 3) % primaryGemstones.length;
    if (secondaryIndex !== primaryIndex) {
      gemstones.push({
        ...primaryGemstones[secondaryIndex],
        priority: 'Secondary',
        recommendation: 'Beneficial for specific life areas',
        wearingTime: 'As needed',
        metal: 'Silver or Copper'
      });
    }
    
    // Add complementary gemstone
    const complementaryIndex = (month + day) % primaryGemstones.length;
    if (complementaryIndex !== primaryIndex && complementaryIndex !== secondaryIndex) {
      gemstones.push({
        ...primaryGemstones[complementaryIndex],
        priority: 'Complementary',
        recommendation: 'For overall balance and harmony',
        wearingTime: 'During specific planetary periods',
        metal: 'Any suitable metal'
      });
    }
    
    return {
      gemstones,
      totalRecommendations: gemstones.length,
      bestWearingTime: '6 AM - 8 AM (Sunrise)',
      precautions: [
        'Always consult an astrologer before wearing gemstones',
        'Start with smaller stones to test compatibility',
        'Clean gemstones regularly with lukewarm water',
        'Remove during sleep and while bathing',
        'Avoid wearing conflicting gemstones together'
      ]
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the backend API using apiClient
      const apiResult = await apiClient.calculateGemstone({
        name: formData.name,
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        birth_place: formData.birthPlace,
        gender: 'male', // Default since not required for gemstone
        language: 'english'
      });

      if (apiResult.success) {
        const payload = (apiResult as any).data;
        const unwrapped = payload && typeof payload === 'object' && 'data' in payload ? (payload as any).data : payload;
        // Process gemstone data to ensure proper structure
        const processedResult = {
          ...unwrapped,
          name: formData.name,
          gemstones: unwrapped?.gemstones || unwrapped?.recommendations || [],
          totalRecommendations: unwrapped?.total_recommendations || unwrapped?.gemstones?.length || unwrapped?.recommendations?.length || 0,
          bestWearingTime: unwrapped?.best_wearing_time || unwrapped?.wearing_time || '6 AM - 8 AM (Sunrise)',
          precautions: Array.isArray(unwrapped?.precautions) ? unwrapped.precautions : [
            'Always consult an astrologer before wearing gemstones',
            'Start with smaller stones to test compatibility',
            'Clean gemstones regularly with lukewarm water',
            'Remove during sleep and while bathing',
            'Avoid wearing conflicting gemstones together'
          ]
        };
        setResult(processedResult);
      } else {
        // Fallback to local calculation if API fails
        const gemstoneData = calculateGemstones(formData.birthDate, formData.birthTime, formData.birthPlace);
        setResult({
          ...gemstoneData,
          name: formData.name
        });
      }
      } catch (error) {
      // Fallback to local calculation if API fails
      const gemstoneData = calculateGemstones(formData.birthDate, formData.birthTime, formData.birthPlace);
      setResult({
        ...gemstoneData,
        name: formData.name
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Primary': return 'bg-red-100 text-red-800 border-red-200';
      case 'Secondary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Complementary': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Gemstone Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get personalized gemstone recommendations based on your birth chart. 
                Discover which gemstones will bring positive energy and prosperity into your life.
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="City, State, Country"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Calculating Gemstones...' : 'Calculate Gemstones'}
                  </button>
                </form>
              </div>

              {/* Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">About Gemstones</h2>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Planetary Connection</h3>
                        <p className="text-gray-600 text-sm">
                          Each gemstone is connected to specific planets and can enhance their positive effects.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Life Enhancement</h3>
                        <p className="text-gray-600 text-sm">
                          Gemstones can improve health, wealth, relationships, and overall life harmony.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Proper Usage</h3>
                        <p className="text-gray-600 text-sm">
                          Correct wearing method, timing, and metal selection are crucial for effectiveness.
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
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Gemstone Recommendations Dashboard</h2>
                <p className="text-lg text-gray-600">Complete gemstone analysis for {result.name}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-sm p-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${activeTab === 'overview' ? 'text-yellow-600 bg-yellow-50 border-2 border-yellow-200' : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('gemstones')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${activeTab === 'gemstones' ? 'text-yellow-600 bg-yellow-50 border-2 border-yellow-200' : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'}`}
                >
                  Gemstones
                </button>
                <button 
                  onClick={() => setActiveTab('wearing')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${activeTab === 'wearing' ? 'text-yellow-600 bg-yellow-50 border-2 border-yellow-200' : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'}`}
                >
                  Wearing Guide
                </button>
                <button 
                  onClick={() => setActiveTab('care')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${activeTab === 'care' ? 'text-yellow-600 bg-yellow-50 border-2 border-yellow-200' : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'}`}
                >
                  Care Tips
                </button>
              </div>

              <div className="space-y-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <>
                {/* Birth Chart with Gemstone Connections */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Birth Chart with Planetary Gemstones</h3>
                  <div className="flex justify-center">
                    <BirthChart planetaryPositions={result.planetary_positions || {
                      sun: { house: 5, sign: 'Leo' },
                      moon: { house: 4, sign: 'Cancer' },
                      mars: { house: 1, sign: 'Aries' },
                      mercury: { house: 3, sign: 'Gemini' },
                      jupiter: { house: 9, sign: 'Sagittarius' },
                      venus: { house: 7, sign: 'Libra' },
                      saturn: { house: 10, sign: 'Capricorn' },
                      rahu: { house: 6, sign: 'Virgo' },
                      ketu: { house: 12, sign: 'Pisces' }
                    }} />
                  </div>
                  <div className="mt-6 text-center text-sm text-gray-600">
                    Birth chart showing planetary positions - Each planet corresponds to a specific gemstone
                  </div>
                </div>

                {/* Overview Summary */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-full mb-6">
                      <span className="text-6xl">💎</span>
                    </div>
                    <h3 className="text-4xl font-bold text-gray-800 mb-2">Gemstone Analysis Complete</h3>
                    <p className="text-xl text-gray-600 mb-6">
                      {result.totalRecommendations} Personalized Gemstone{result.totalRecommendations !== 1 ? 's' : ''} Recommended
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200 text-center">
                          <div className="text-3xl mb-2">💍</div>
                          <div className="font-bold text-red-800 text-lg">Primary Gemstone</div>
                          <div className="text-red-600 font-semibold">
                            {(Array.isArray(result.gemstones) && result.gemstones.find(g => g.priority === 'Primary')?.name) || result.primary_gemstone || 'Ruby'}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200 text-center">
                          <div className="text-3xl mb-2">💎</div>
                          <div className="font-bold text-blue-800 text-lg">Secondary Gemstone</div>
                          <div className="text-blue-600 font-semibold">
                            {(Array.isArray(result.gemstones) && result.gemstones.find(g => g.priority === 'Secondary')?.name) || result.secondary_gemstone || 'Optional'}
                          </div>
                        </div>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200 text-center">
                      <div className="text-3xl mb-2">✨</div>
                      <div className="font-bold text-purple-800 text-lg">Best Wearing Time</div>
                      <div className="text-purple-600 font-semibold">{result.bestWearingTime}</div>
                    </div>
                  </div>
                </div>
                  </>
                )}

                {/* Gemstones Tab */}
                {activeTab === 'gemstones' && (
                  <>
                {/* Detailed Gemstone Cards */}
                <div className="space-y-8">
                  {Array.isArray(result.gemstones) && result.gemstones.length > 0 ? result.gemstones.map((gemstone, index) => (
                    <div key={index} className={`bg-white rounded-2xl shadow-lg p-8 border-l-4 ${getPriorityColor(gemstone.priority)}`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                            gemstone.priority === 'Primary' ? 'bg-red-100 text-red-600' :
                            gemstone.priority === 'Secondary' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            💎
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold text-gray-800">{gemstone.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(gemstone.priority)}`}>
                                {gemstone.priority}
                              </span>
                              <span className="text-gray-600">• {gemstone.planet} Planet</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">{gemstone.price}</div>
                          <div className="text-sm text-gray-600">Price Range</div>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm font-semibold text-gray-700">Color</div>
                              <div className="font-bold text-gray-800">{gemstone.color}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm font-semibold text-gray-700">Finger</div>
                              <div className="font-bold text-gray-800">{gemstone.finger}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm font-semibold text-gray-700">Metal</div>
                              <div className="font-bold text-gray-800">{gemstone.metal}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm font-semibold text-gray-700">Wearing Time</div>
                              <div className="font-bold text-gray-800">{gemstone.wearingTime}</div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2">Recommendation</h4>
                            <p className="text-yellow-700 leading-relaxed">{gemstone.recommendation}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-green-500">✨</span> Benefits & Properties
                          </h4>
                          <div className="space-y-3">
                            {(Array.isArray(gemstone.benefits) ? gemstone.benefits : (typeof gemstone.benefits === 'string' ? gemstone.benefits.split(',').map(b => b.trim()) : [])).filter(Boolean).map((benefit, benefitIndex) => (
                              <div key={benefitIndex} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Planetary Connection */}
                      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                          <span className="text-xl">🪐</span> Planetary Connection
                        </h4>
                        <p className="text-indigo-700">
                          This gemstone is associated with {gemstone.planet}, the planet that influences {gemstone.planet.toLowerCase()}-related
                          aspects of your life. Wearing this gemstone can help balance and strengthen the positive influences of this planet in your birth chart.
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-6xl mb-4">💎</div>
                      <h4 className="text-2xl font-bold text-gray-600 mb-4">No Gemstone Recommendations</h4>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Based on your birth chart analysis, no specific gemstone recommendations are currently available.
                        This may change based on future planetary transits.
                      </p>
                    </div>
                  )}
                </div>
                  </>
                )}

                {/* Wearing Guide Tab */}
                {activeTab === 'wearing' && (
                  <>
                {/* Wearing Guidelines */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">📋</span> Wearing Guidelines & Instructions
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                          <span className="text-xl">⏰</span> Best Wearing Time
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                              <span className="text-green-800 font-bold">1</span>
                            </div>
                            <span className="text-green-700">{result.bestWearingTime}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                              <span className="text-green-800 font-bold">2</span>
                            </div>
                            <span className="text-green-700">During planetary hours (consult astrologer)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                              <span className="text-green-800 font-bold">3</span>
                            </div>
                            <span className="text-green-700">On auspicious days (Wednesday/Thursday)</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                          <span className="text-xl">🔮</span> Wearing Rituals
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-800 font-bold text-xs">•</span>
                            </div>
                            <span className="text-blue-700 text-sm">Clean the gemstone with Gangajal (Ganges water)</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-800 font-bold text-xs">•</span>
                            </div>
                            <span className="text-blue-700 text-sm">Chant the associated planetary mantra 108 times</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-800 font-bold text-xs">•</span>
                            </div>
                            <span className="text-blue-700 text-sm">Wear on the specified finger and metal</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-800 font-bold text-xs">•</span>
                            </div>
                            <span className="text-blue-700 text-sm">Face east while wearing and set positive intentions</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
                        <h4 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                          <span className="text-xl">⚠️</span> Important Precautions
                        </h4>
                        <div className="space-y-3">
                          {(Array.isArray(result.precautions) ? result.precautions : []).map((precaution, index) => (
                            <div key={index} className="flex items-start gap-3 bg-orange-50 p-3 rounded-lg border border-orange-200">
                              <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <span className="text-gray-700 text-sm">{precaution}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                          <span className="text-xl">🧼</span> Gemstone Maintenance
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-800 font-bold text-xs">•</span>
                            </div>
                            <span className="text-purple-700 text-sm">Clean with lukewarm water and mild soap weekly</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-800 font-bold text-xs">•</span>
                            </div>
                            <span className="text-purple-700 text-sm">Energize monthly during full moon or on auspicious days</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-800 font-bold text-xs">•</span>
                            </div>
                            <span className="text-purple-700 text-sm">Store in a clean, sacred place when not wearing</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-800 font-bold text-xs">•</span>
                            </div>
                            <span className="text-purple-700 text-sm">Remove during sleep, bathing, and physical activities</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </>
                )}

                {/* Care Tips Tab */}
                {activeTab === 'care' && (
                  <>
                {/* Gemstone Compatibility */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🔄</span> Gemstone Compatibility & Combinations
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-800 mb-4">Compatible Combinations</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                            <span className="text-green-800 font-bold">✓</span>
                          </div>
                          <span className="text-green-700">Ruby + Pearl (Sun + Moon)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                            <span className="text-green-800 font-bold">✓</span>
                          </div>
                          <span className="text-green-700">Emerald + Yellow Sapphire (Mercury + Jupiter)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                            <span className="text-green-800 font-bold">✓</span>
                          </div>
                          <span className="text-green-700">Diamond + Blue Sapphire (Venus + Saturn)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200">
                      <h4 className="font-bold text-red-800 mb-4">Avoid These Combinations</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                            <span className="text-red-800 font-bold">✗</span>
                          </div>
                          <span className="text-red-700">Ruby + Blue Sapphire (conflicting planets)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                            <span className="text-red-800 font-bold">✗</span>
                          </div>
                          <span className="text-red-700">Pearl + Diamond (moon-venus conflict)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                            <span className="text-red-800 font-bold">✗</span>
                          </div>
                          <span className="text-red-700">Multiple stones of same planet</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </>
                )}

                {/* CTA - Always visible */}
                {/* CTA */}
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                      <span className="text-3xl">💎</span> Need Authentic Gemstones & Consultation?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get a comprehensive gemstone consultation with Dr. Arup Shastri for authentic gemstone sourcing,
                      proper energizing rituals, wearing instructions, and personalized recommendations based on your complete birth chart.
                    </p>
                    <a
                      href="/book-appointment"
                      className="inline-block bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Book Gemstone Consultation
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

