'use client';

import { useState } from 'react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

export default function KundliCalculatorPage() {
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
    
    try {
      // Call the backend API
      const response = await fetch('http://localhost:8000/api/calculators/kundli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          birth_date: formData.birthDate,
          birth_time: formData.birthTime,
          birth_place: formData.birthPlace,
          gender: formData.gender,
          language: formData.language
        })
      });

      if (response.ok) {
        const apiResult = await response.json();
        setResult(apiResult.data);
      } else {
        // Fallback to local calculation if API fails
        const kundliData = calculateKundli(formData.birthDate, formData.birthTime, formData.birthPlace);
        setResult({
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          ...kundliData
        });
      }
    } catch (error) {
      // Fallback to local calculation if API fails
      const kundliData = calculateKundli(formData.birthDate, formData.birthTime, formData.birthPlace);
      setResult({
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
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
                    {loading ? 'Generating Kundli...' : 'Generate Kundli'}
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

        {/* Results Section */}
        {result && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Kundli Results</h2>
                <p className="text-lg text-gray-600">Complete astrological analysis for {result.personal_info?.name || result.name}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h3>
                  <div className="space-y-4">
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

                {/* Planetary Positions */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Planetary Positions</h3>
                  <div className="space-y-4">
                    {Object.entries(result.planetary_positions || result.planets || {}).map(([planet, sign]) => (
                      <div key={planet} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700 capitalize">{planet}:</span>
                        <span className="text-gray-800">{sign as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Yogas */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Special Yogas</h3>
                  <div className="space-y-3">
                    {(result.yogas || []).map((yoga, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-800">{yoga}</span>
                      </div>
                    ))}
                    {(!result.yogas || result.yogas.length === 0) && (
                      <div className="text-gray-500 text-center py-4">
                        No special yogas found in this chart.
                      </div>
                    )}
                  </div>
                </div>

                {/* Nakshatra Details */}
                {result.nakshatra && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Nakshatra Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Birth Nakshatra:</span>
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
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Symbol:</span>
                        <span className="text-gray-800">{result.nakshatra.symbol}</span>
                      </div>
                      <div className="py-2">
                        <span className="font-semibold text-gray-700 block mb-2">Characteristics:</span>
                        <span className="text-gray-600 text-sm">{result.nakshatra.characteristics}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dasha Periods */}
                {result.dasha_periods && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Dasha Periods</h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                        <div className="font-semibold text-gray-700 mb-2">Current Maha Dasha:</div>
                        <div className="text-xl font-bold text-orange-600">{result.dasha_periods.current_mahadasha}</div>
                        <div className="text-sm text-gray-600 mt-1">Duration: {result.dasha_periods.current_duration} years</div>
                        <div className="text-sm text-gray-600 mt-2">{result.dasha_periods.description}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 block mb-3">Upcoming Periods:</span>
                        {result.dasha_periods.upcoming_periods?.map((period, index) => (
                          <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-800">{period.planet} Dasha</span>
                              <span className="text-sm text-gray-600">{period.duration_years} years</span>
                            </div>
                            <div className="text-sm text-gray-600">{period.effects}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Yogas */}
                {result.yogas && result.yogas.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Special Yogas</h3>
                    <div className="space-y-3">
                      {result.yogas.map((yoga, index) => (
                        <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                          <div className="font-semibold text-green-800 mb-2">{yoga.name}</div>
                          <div className="text-sm text-gray-700 mb-1"><strong>Formation:</strong> {yoga.description}</div>
                          <div className="text-sm text-gray-700"><strong>Benefits:</strong> {yoga.benefits}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doshas */}
                {result.doshas && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Dosha Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Total Doshas:</span>
                        <span className="text-gray-800">{result.doshas.total_doshas}</span>
                      </div>
                      <div className="py-2">
                        <span className="font-semibold text-gray-700 block mb-2">Recommendation:</span>
                        <span className="text-gray-800">{result.doshas.recommendation}</span>
                      </div>
                      {result.doshas.doshas && result.doshas.doshas.length > 0 && (
                        <div className="py-2">
                          <span className="font-semibold text-gray-700 block mb-2">Doshas Found:</span>
                          <div className="space-y-2">
                            {result.doshas.doshas.map((dosha, index) => (
                              <div key={index} className="bg-red-50 p-3 rounded-lg">
                                <div className="font-semibold text-red-800">{dosha.name}</div>
                                <div className="text-sm text-red-600">{dosha.description}</div>
                                <div className="text-sm text-red-600 mt-1">Remedy: {dosha.remedy}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Gemstone Recommendations */}
                {result.gemstone_recommendations && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Gemstone Recommendations</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Primary Gemstone:</span>
                        <span className="text-gray-800">{result.gemstone_recommendations.primary_gemstone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Secondary Gemstone:</span>
                        <span className="text-gray-800">{result.gemstone_recommendations.secondary_gemstone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Wearing Finger:</span>
                        <span className="text-gray-800">{result.gemstone_recommendations.wearing_finger}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Wearing Day:</span>
                        <span className="text-gray-800">{result.gemstone_recommendations.wearing_day}</span>
                      </div>
                      {result.gemstone_recommendations.metal && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-semibold text-gray-700">Metal:</span>
                          <span className="text-gray-800">{result.gemstone_recommendations.metal}</span>
                        </div>
                      )}
                      <div className="py-2">
                        <span className="font-semibold text-gray-700 block mb-2">Benefits:</span>
                        <span className="text-gray-800">{result.gemstone_recommendations.benefits}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Info (fallback for local calculation) */}
                {!result.doshas && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Guna Score:</span>
                        <span className="text-gray-800">{result.guna}/36</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Manglik:</span>
                        <span className="text-gray-800">{result.manglik}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-semibold text-gray-700">Rashi:</span>
                        <span className="text-gray-800">{result.rashi}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Predictions */}
              {result.detailed_predictions && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Detailed Predictions</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">🧑 Personality</h4>
                      <p className="text-gray-700">{result.detailed_predictions.personality}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">💼 Career</h4>
                      <p className="text-gray-700">{result.detailed_predictions.career}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">❤️ Relationships</h4>
                      <p className="text-gray-700">{result.detailed_predictions.relationships}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">🏥 Health</h4>
                      <p className="text-gray-700">{result.detailed_predictions.health}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">💰 Finance</h4>
                      <p className="text-gray-700">{result.detailed_predictions.finance}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-800 mb-4">🍀 Lucky Elements</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-semibold text-gray-700">Color:</span>
                          <span className="text-gray-800 ml-2">{result.detailed_predictions.lucky_elements.color}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Day:</span>
                          <span className="text-gray-800 ml-2">{result.detailed_predictions.lucky_elements.day}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Number:</span>
                          <span className="text-gray-800 ml-2">{result.detailed_predictions.lucky_elements.number}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Gemstone:</span>
                          <span className="text-gray-800 ml-2">{result.detailed_predictions.lucky_elements.gemstone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* CTA */}
              <div className="text-center mt-12 lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Want Detailed Analysis?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get a comprehensive consultation with Dr. Arup Shastri for detailed predictions, 
                    remedies, and personalized guidance.
                  </p>
                  <a
                    href="/book-appointment"
                    className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
