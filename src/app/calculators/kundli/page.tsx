'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/lib/api';
import LoginRequiredModal from '@/components/auth/LoginRequiredModal';
import { useAuth } from '@/contexts/AuthContext';
import BirthChart from '@/components/BirthChart';

export default function KundliCalculatorPage() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: 'male',
    language: 'english'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Type guard to check if position is an object with house and sign
  const isPlanetaryPosition = (position: any): position is { house: number; sign: string } => {
    return typeof position === 'object' && position !== null && 'house' in position && 'sign' in position;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateKundli = (birthDate, birthTime, birthPlace) => {
    // More realistic kundli calculation based on birth details
    const date = new Date(birthDate + 'T' + birthTime);
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    
    // Sun signs based on date
    const sunSigns = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 
                     'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];
    const sunSign = sunSigns[month];
    
    // Moon signs based on day
    const moonSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const moonSign = moonSigns[day % 12];
    
    // Ascendant based on time
    const ascendantSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                           'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const ascendant = ascendantSigns[Math.floor(hour / 2) % 12];
    
    // Rashi names in Sanskrit
    const rashiNames = {
      'Aries': 'Mesha', 'Taurus': 'Vrishabha', 'Gemini': 'Mithuna',
      'Cancer': 'Karka', 'Leo': 'Simha', 'Virgo': 'Kanya',
      'Libra': 'Tula', 'Scorpio': 'Vrishchika', 'Sagittarius': 'Dhanu',
      'Capricorn': 'Makara', 'Aquarius': 'Kumbha', 'Pisces': 'Meena'
    };
    
    // Nakshatras
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
                       'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
                       'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
                       'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
                       'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    
    // Generate planetary positions
    const planets = {
      sun: sunSign,
      moon: moonSign,
      mars: moonSigns[(day + 2) % 12],
      mercury: moonSigns[(day + 4) % 12],
      jupiter: moonSigns[(day + 6) % 12],
      venus: moonSigns[(day + 8) % 12],
      saturn: moonSigns[(day + 10) % 12],
      rahu: moonSigns[(day + 1) % 12],
      ketu: moonSigns[(day + 7) % 12]
    };
    
    // Calculate guna score (simplified)
    const guna = Math.floor(Math.random() * 20) + 18; // 18-38 range
    
    // Check for Manglik
    const manglik = (planets.mars === 'Aries' || planets.mars === 'Scorpio' || 
                    planets.mars === 'Leo' || planets.mars === 'Sagittarius') ? 'Yes' : 'No';
    
    // Generate yogas
    const possibleYogas = ['Gaj Kesari Yoga', 'Chandra Mangal Yoga', 'Hamsa Yoga', 'Malavya Yoga', 
                          'Sasa Yoga', 'Ruchaka Yoga', 'Bhadra Yoga', 'Sankha Yoga'];
    const numYogas = Math.floor(Math.random() * 3) + 1;
    const yogas = possibleYogas.slice(0, numYogas);
    
    return {
      sunSign,
      moonSign,
      ascendant,
      rashi: rashiNames[sunSign],
      nakshatra: nakshatras[day % 27],
      guna,
      manglik,
      yogas,
      planets
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call the backend API using apiClient
      const apiResult = await apiClient.calculateKundli({
        name: formData.name,
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        birth_place: formData.birthPlace,
        gender: formData.gender,
        language: formData.language
      });

      if (apiResult.success) {
        const payload = (apiResult as any).data;
        const unwrapped = payload && typeof payload === 'object' && 'data' in payload ? (payload as any).data : payload;
        setResult(unwrapped);
      } else {
        // Fallback to local calculation if API fails
        const kundliData = calculateKundli(formData.birthDate, formData.birthTime, formData.birthPlace);
        setResult({
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          detailed_predictions: {
            personality: `As a ${kundliData.sunSign} with ${kundliData.moonSign} moon, you have a balanced nature with growth potential`,
            career: `Your ${kundliData.sunSign} traits support leadership and initiative.`,
            relationships: `Empathy from ${kundliData.moonSign} strengthens relationships.`,
            health: `Focus on routine and balance for well-being.`,
            finance: `Steady progress expected; plan investments wisely.`,
            lucky_elements: { color: 'Orange', day: 'Sunday', number: '3', gemstone: 'Ruby' }
          },
          ...kundliData
        });
      }
    } catch (error) {
      console.log('API Error:', error);
      setError(error.message || 'Failed to calculate Kundli. Using local calculation.');

      // Fallback to local calculation if API fails
      const kundliData = calculateKundli(formData.birthDate, formData.birthTime, formData.birthPlace);
      setResult({
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        detailed_predictions: {
          personality: `As a ${kundliData.sunSign} with ${kundliData.moonSign} moon, you have a balanced nature with growth potential`,
          career: `Your ${kundliData.sunSign} traits support leadership and initiative.`,
          relationships: `Empathy from ${kundliData.moonSign} strengthens relationships.`,
          health: `Focus on routine and balance for well-being.`,
          finance: `Steady progress expected; plan investments wisely.`,
          lucky_elements: { color: 'Orange', day: 'Sunday', number: '3', gemstone: 'Ruby' }
        },
        ...kundliData
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
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Free Kundli Generator
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Generate your complete birth chart (Kundli) with detailed planetary positions, 
                houses, and astrological insights. Get instant results based on Vedic astrology.
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="City, State, Country"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Language *
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="english">English</option>
                      <option value="bengali">বাংলা (Bengali)</option>
                      <option value="hindi">हिंदी (Hindi)</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Predictions will be shown in your selected language</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Kundli...
                      </div>
                    ) : 'Generate Kundli'}
                  </button>
                </form>
              </div>

              {/* Instructions */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Important Instructions</h2>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Accurate Birth Time</h3>
                        <p className="text-gray-600 text-sm">
                          Provide the exact birth time as mentioned in your birth certificate. 
                          Even a few minutes difference can affect the accuracy of your Kundli.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Birth Place Details</h3>
                        <p className="text-gray-600 text-sm">
                          Enter the complete birth place including city, state, and country. 
                          This helps in calculating the exact planetary positions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Free & Instant</h3>
                        <p className="text-gray-600 text-sm">
                          This is a completely free service. You'll get your Kundli instantly 
                          with detailed planetary positions and basic predictions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Detailed Analysis</h3>
                        <p className="text-gray-600 text-sm">
                          For detailed analysis and personalized predictions, 
                          consider booking a consultation with Dr. Arup Shastri.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <section className="py-8 bg-red-50">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Notice:</strong> {error}
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {result && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Kundli Dashboard</h2>
                <p className="text-lg text-gray-600">Complete astrological analysis for {result.personal_info?.name || result.name}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-sm p-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'overview' 
                      ? 'text-orange-600 bg-orange-50 border-2 border-orange-200' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('birthchart')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'birthchart' 
                      ? 'text-orange-600 bg-orange-50 border-2 border-orange-200' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Birth Chart
                </button>
                <button 
                  onClick={() => setActiveTab('predictions')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'predictions' 
                      ? 'text-orange-600 bg-orange-50 border-2 border-orange-200' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Predictions
                </button>
                <button 
                  onClick={() => setActiveTab('remedies')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'remedies' 
                      ? 'text-orange-600 bg-orange-50 border-2 border-orange-200' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Remedies
                </button>
              </div>

              <div className="space-y-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <>
                    {/* Overview Grid */}
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Basic Information */}
                      <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="text-2xl">📋</span> Basic Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-semibold text-gray-700">Name:</span>
                            <span className="text-gray-800">{result.personal_info?.name || result.name}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-semibold text-gray-700">Birth Date:</span>
                            <span className="text-gray-800">{result.personal_info?.birth_date || result.birthDate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-semibold text-gray-700">Birth Time:</span>
                            <span className="text-gray-800">{result.personal_info?.birth_time || result.birthTime}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-semibold text-gray-700">Birth Place:</span>
                            <span className="text-gray-800">{result.personal_info?.birth_place || result.birthPlace}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="font-semibold text-gray-700">Language:</span>
                            <span className="text-gray-800 capitalize">{result.personal_info?.language || result.language || 'English'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Astrological Elements */}
                      <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="text-2xl">⭐</span> Astrological Elements
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-semibold text-gray-700">Sun Sign:</span>
                            <span className="text-gray-800">{result.astrological_elements?.sun_sign || result.sunSign}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-semibold text-gray-700">Moon Sign:</span>
                            <span className="text-gray-800">{result.astrological_elements?.moon_sign || result.moonSign}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-semibold text-gray-700">Ascendant:</span>
                            <span className="text-gray-800">{result.astrological_elements?.ascendant || result.ascendant}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="font-semibold text-gray-700">Zodiac Sign:</span>
                            <span className="text-gray-800">{result.astrological_elements?.zodiac_sign || result.sunSign}</span>
                          </div>
                        </div>
                      </div>

                      {/* Nakshatra Details */}
                      {result.nakshatra && (
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-2xl">🌙</span> Nakshatra Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="font-semibold text-gray-700">Nakshatra:</span>
                              <span className="text-gray-800">{result.nakshatra.nakshatra}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="font-semibold text-gray-700">Pada:</span>
                              <span className="text-gray-800">{result.nakshatra.pada}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="font-semibold text-gray-700">Ruling Planet:</span>
                              <span className="text-gray-800">{result.nakshatra.ruling_planet}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="font-semibold text-gray-700">Deity:</span>
                              <span className="text-gray-800">{result.nakshatra.deity}</span>
                            </div>
                            <div className="py-2">
                              <span className="font-semibold text-gray-700 block mb-1">Symbol:</span>
                              <span className="text-gray-600 text-sm">{result.nakshatra.symbol}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Birth Chart Tab */}
                {activeTab === 'birthchart' && (
                  <>
                {/* Birth Chart Visualization */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Birth Chart Analysis</h3>
                  <div className="flex justify-center">
                    <BirthChart planetaryPositions={result.planetary_positions || result.planets} />
                  </div>
                  <div className="mt-6 text-center text-sm text-gray-600">
                    Traditional Vedic astrology birth chart showing planetary positions in houses
                  </div>
                </div>

                {/* Planetary Positions */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-3xl">🪐</span> Planetary Positions
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(result.planetary_positions || result.planets || {}).map(([planet, position]) => {
                      const sign = isPlanetaryPosition(position) ? position.sign : position as string;
                      const house = isPlanetaryPosition(position) ? position.house : null;

                      return (
                        <div key={planet} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-lg text-blue-800 capitalize">{planet}</span>
                            <span className="text-2xl">
                              {planet === 'sun' && '☉'}
                              {planet === 'moon' && '☽'}
                              {planet === 'mars' && '♂'}
                              {planet === 'mercury' && '☿'}
                              {planet === 'jupiter' && '♃'}
                              {planet === 'venus' && '♀'}
                              {planet === 'saturn' && '♄'}
                              {planet === 'rahu' && '☊'}
                              {planet === 'ketu' && '☋'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">Sign:</span> {sign}
                            </div>
                            {house && (
                              <div className="text-sm text-gray-700">
                                <span className="font-semibold">House:</span> {house}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dasha Periods & Yogas Row */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Dasha Periods */}
                  {result.dasha_periods && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="text-2xl">⏳</span> Dasha Periods
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">👑</span>
                            <div>
                              <div className="font-bold text-xl text-purple-800">Current Maha Dasha</div>
                              <div className="text-purple-600 font-semibold">{result.dasha_periods.current_mahadasha}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 mt-2">
                            <div><strong>Duration:</strong> {result.dasha_periods.current_duration} years</div>
                            <div className="mt-2">{result.dasha_periods.description}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="text-lg">🔮</span> Upcoming Periods
                          </h4>
                          <div className="space-y-3">
                            {result.dasha_periods.upcoming_periods?.map((period, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-bold text-gray-800">{period.planet} Dasha</span>
                                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {period.duration_years} years
                                  </span>
                                </div>
                                <div className="text-sm text-gray-700">{period.effects}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special Yogas */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span className="text-2xl">✨</span> Special Yogas
                    </h3>
                    <div className="space-y-4">
                      {result.yogas && result.yogas.length > 0 ? result.yogas.map((yoga, index) => (
                          <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">🪄</span>
                              <div className="flex-1">
                                <div className="font-bold text-green-800 mb-2">{yoga.name}</div>
                                <div className="text-sm text-gray-700 mb-1">
                                  <strong>Formation:</strong> {yoga.description}
                                </div>
                                <div className="text-sm text-gray-700">
                                  <strong>Benefits:</strong> {yoga.benefits}
                                </div>
                              </div>
                            </div>
                          </div>
                        )) : (
                        <div className="text-center py-8 text-gray-500">
                          <span className="text-4xl mb-2 block">🌟</span>
                          <p>No special yogas found in this chart.</p>
                          <p className="text-sm mt-1">This doesn't indicate any problems - many charts don't have rare yogas.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                  </>
                )}

                {/* Predictions Tab */}
                {activeTab === 'predictions' && (
                  <>
                {/* Detailed Predictions */}
                {(result.detailed_predictions || result.predictions) && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span className="text-2xl">🔮</span> Detailed Life Predictions
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                          <h4 className="font-bold text-xl text-purple-800 mb-3 flex items-center gap-2">
                            <span className="text-2xl">🧑</span> Personality
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {(result.detailed_predictions || result.predictions)?.personality || 'No personality analysis available.'}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                          <h4 className="font-bold text-xl text-blue-800 mb-3 flex items-center gap-2">
                            <span className="text-2xl">💼</span> Career
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {(result.detailed_predictions || result.predictions)?.career || 'No career analysis available.'}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-200">
                          <h4 className="font-bold text-xl text-pink-800 mb-3 flex items-center gap-2">
                            <span className="text-2xl">❤️</span> Relationships
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {(result.detailed_predictions || result.predictions)?.relationships || 'No relationship analysis available.'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                          <h4 className="font-bold text-xl text-green-800 mb-3 flex items-center gap-2">
                            <span className="text-2xl">🏥</span> Health
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {(result.detailed_predictions || result.predictions)?.health || 'No health analysis available.'}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                          <h4 className="font-bold text-xl text-yellow-800 mb-3 flex items-center gap-2">
                            <span className="text-2xl">💰</span> Finance
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {(result.detailed_predictions || result.predictions)?.finance || 'No financial analysis available.'}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                          <h4 className="font-bold text-xl text-indigo-800 mb-3 flex items-center gap-2">
                            <span className="text-2xl">🍀</span> Lucky Elements
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded border">
                              <span className="font-semibold text-gray-700 block">Colors</span>
                              <span className="text-indigo-600">
                                {(result.detailed_predictions || result.predictions)?.lucky_elements?.color || '—'}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <span className="font-semibold text-gray-700 block">Days</span>
                              <span className="text-indigo-600">
                                {(result.detailed_predictions || result.predictions)?.lucky_elements?.day || '—'}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <span className="font-semibold text-gray-700 block">Numbers</span>
                              <span className="text-indigo-600">
                                {(result.detailed_predictions || result.predictions)?.lucky_elements?.number || '—'}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <span className="font-semibold text-gray-700 block">Gemstones</span>
                              <span className="text-indigo-600">
                                {(result.detailed_predictions || result.predictions)?.lucky_elements?.gemstone || '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nakshatra Characteristics (if available) */}
                {result.nakshatra?.characteristics && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span className="text-2xl">🌟</span> Nakshatra Characteristics
                    </h3>
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
                      <p className="text-gray-700 leading-relaxed">
                        {result.nakshatra.characteristics}
                      </p>
                    </div>
                  </div>
                )}
                  </>
                )}

                {/* Remedies Tab */}
                {activeTab === 'remedies' && (
                  <>
                    {/* Doshas Section - moved from predictions */}
                    {result.doshas && (
                      <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <span className="text-2xl">⚠️</span> Dosha Analysis & Remedies
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border-2 border-red-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-red-800">Total Doshas Found</span>
                              <span className="text-2xl font-bold text-red-600">{result.doshas.total_doshas || 0}</span>
                            </div>
                            <div className="text-sm text-gray-700">{result.doshas.recommendation || 'No major doshas detected'}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gemstone Recommendations */}
                    {result.gemstone_recommendations && (
                      <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <span className="text-2xl">💎</span> Gemstone Recommendations
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                              <div className="text-center mb-2">
                                <span className="text-3xl">💍</span>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-blue-800 text-lg">Primary</div>
                                <div className="text-blue-600 font-semibold">{result.gemstone_recommendations.primary_gemstone}</div>
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                              <div className="text-center mb-2">
                                <span className="text-3xl">💎</span>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-purple-800 text-lg">Secondary</div>
                                <div className="text-purple-600 font-semibold">{result.gemstone_recommendations.secondary_gemstone}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* CTA - shows on all tabs */}
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border-2 border-orange-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                      <span className="text-3xl">👨‍⚕️</span> Want Detailed Analysis?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get a comprehensive consultation with Dr. Arup Shastri for detailed predictions,
                      personalized remedies, gemstone recommendations, and life guidance based on your complete birth chart.
                    </p>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) { setShowLoginModal(true); return; }
                        window.location.href = '/book-appointment';
                      }}
                      className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Book Personal Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} message="Please login or register to book a personal consultation." />
      </main>
      <Footer />
    </div>
  );
}
