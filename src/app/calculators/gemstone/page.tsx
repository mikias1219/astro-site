'use client';

import { useState } from 'react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { apiClient } from '../../../lib/api';

export default function GemstoneCalculatorPage() {
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
        setResult(apiResult.data);
      } else {
        // Fallback to local calculation if API fails
        const gemstoneData = calculateGemstones(formData.birthDate, formData.birthTime, formData.birthPlace);
        const primaryGemstone = gemstoneData.gemstones.find(g => g.priority === 'Primary');
        const secondaryGemstone = gemstoneData.gemstones.find(g => g.priority === 'Secondary');
        setResult({
          primary_gemstone: primaryGemstone?.name || 'Ruby',
          secondary_gemstone: secondaryGemstone?.name || 'Pearl',
          wearing_finger: primaryGemstone?.finger || 'Ring finger',
          wearing_day: 'Sunday',
          benefits: primaryGemstone?.benefits?.join(', ') || 'Enhances planetary strength',
          metal: primaryGemstone?.metal || 'Gold'
        });
      }
    } catch (error) {
      // Fallback to local calculation if API fails
      const gemstoneData = calculateGemstones(formData.birthDate, formData.birthTime, formData.birthPlace);
      const primaryGemstone = gemstoneData.gemstones.find(g => g.priority === 'Primary');
      const secondaryGemstone = gemstoneData.gemstones.find(g => g.priority === 'Secondary');
      setResult({
        primary_gemstone: primaryGemstone?.name || 'Ruby',
        secondary_gemstone: secondaryGemstone?.name || 'Pearl',
        wearing_finger: primaryGemstone?.finger || 'Ring finger',
        wearing_day: 'Sunday',
        benefits: primaryGemstone?.benefits?.join(', ') || 'Enhances planetary strength',
        metal: primaryGemstone?.metal || 'Gold'
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
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Gemstone Recommendations</h2>
                <p className="text-lg text-gray-600">Personalized gemstone analysis for {result.name}</p>
              </div>

              {/* Gemstone Cards */}
              <div className="space-y-8">
                {result.gemstones.map((gemstone, index) => (
                  <div key={index} className={`bg-white rounded-2xl shadow-lg p-8 border-2 ${getPriorityColor(gemstone.priority)}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-3xl font-bold text-gray-800">{gemstone.name}</h3>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(gemstone.priority)}`}>
                        {gemstone.priority}
                      </span>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-700">Planet:</span>
                            <span className="text-gray-800">{gemstone.planet}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-700">Color:</span>
                            <span className="text-gray-800">{gemstone.color}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-700">Price Range:</span>
                            <span className="text-gray-800">{gemstone.price}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-700">Finger:</span>
                            <span className="text-gray-800">{gemstone.finger}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-700">Metal:</span>
                            <span className="text-gray-800">{gemstone.metal}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-700">Wearing Time:</span>
                            <span className="text-gray-800">{gemstone.wearingTime}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-4">{gemstone.recommendation}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Benefits</h4>
                        <div className="space-y-2">
                          {gemstone.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center gap-3">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wearing Guidelines */}
              <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Important Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Best Wearing Time</h4>
                    <p className="text-gray-700 mb-4">{result.bestWearingTime}</p>
                    <p className="text-gray-600 text-sm">
                      Gemstones are most effective when worn during their ruling planet's hours.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Precautions</h4>
                    <div className="space-y-2">
                      {result.precautions.map((precaution, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-gray-700 text-sm">{precaution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Need Gemstone Consultation?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get a detailed gemstone consultation with Dr. Arup Shastri for personalized recommendations, 
                    proper wearing instructions, and authentic gemstone sourcing.
                  </p>
                  <a
                    href="/book-appointment"
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Book Gemstone Consultation
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

