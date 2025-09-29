'use client';

import { useState } from 'react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

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
    
    // Simulate API call
    setTimeout(() => {
      const moonData = calculateMoonSign(formData.birthDate, formData.birthTime, formData.birthPlace);
      
      setResult({
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        ...moonData,
        moonPhase: 'Waxing Crescent',
        moonDegree: Math.floor(Math.random() * 30) + 1
      });
      setLoading(false);
    }, 2000);
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
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Moon Sign Analysis</h2>
                <p className="text-lg text-gray-600">Emotional profile for {result.name}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Moon Sign Details */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center mb-8">
                    <div className="text-6xl font-bold text-blue-600 mb-4">{result.moonSign}</div>
                    <div className="text-2xl text-gray-700">Your Moon Sign</div>
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
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700">Degree:</span>
                      <span className="text-gray-800">{result.moonDegree}°</span>
                    </div>
                  </div>
                </div>

                {/* Emotional Traits */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Traits</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {result.traits.map((trait, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 text-sm">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emotional Nature */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Emotional Nature</h3>
                  <p className="text-gray-700 leading-relaxed">{result.emotions}</p>
                </div>

                {/* Compatibility */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Moon Sign Compatibility</h3>
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
                    Want Complete Analysis?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get a comprehensive consultation with Dr. Arup Shastri for detailed moon sign analysis, 
                    emotional guidance, and personalized remedies.
                  </p>
                  <a
                    href="/book-appointment"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
