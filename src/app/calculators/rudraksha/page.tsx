'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/lib/api';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface RudrakshaResult {
  personal_info: {
    name: string;
    birth_date: string;
    birth_time: string;
    birth_place: string;
    gender: string;
  };
  primary_rudraksha: {
    mukhi: number;
    details: {
      name: string;
      ruling_planet: string;
      benefits: string;
      wearing_method: string;
      color: string;
    };
  };
  secondary_rudraksha: {
    mukhi: number;
    details: {
      name: string;
      ruling_planet: string;
      benefits: string;
      wearing_method: string;
      color: string;
    };
  };
  problem_specific_recommendations: Array<{
    rudraksha: any;
    reason: string;
  }>;
  general_guidelines: {
    wearing_time: string;
    mantra: string;
    care_instructions: string;
    replacement: string;
  };
  benefits_summary: string;
}

export default function RudrakshaCalculatorPage() {
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    gender: 'male',
    current_problems: [] as string[]
  });
  const [result, setResult] = useState<RudrakshaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const problemOptions = [
    'Health Issues',
    'Financial Problems',
    'Love/Relationship Issues',
    'Career Problems',
    'Education/Learning Issues',
    'Protection from Enemies',
    'Spiritual Growth',
    'Family Problems',
    'Business Issues',
    'Mental Peace'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProblemToggle = (problem: string) => {
    setFormData(prev => ({
      ...prev,
      current_problems: prev.current_problems.includes(problem)
        ? prev.current_problems.filter(p => p !== problem)
        : [...prev.current_problems, problem]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.calculateRudraksha(formData);
      if (response.success && response.data) {
        const payload: any = response.data;
        // Backend returns { success, data, message }. Unwrap inner data.
        const unwrapped = payload?.data ?? payload;
        // Ensure arrays are properly initialized
        const processedResult = {
          ...unwrapped,
          problem_specific_recommendations: Array.isArray(unwrapped?.problem_specific_recommendations) 
            ? unwrapped.problem_specific_recommendations 
            : []
        };
        setResult(processedResult as RudrakshaResult);
      } else {
        setError(response.error || 'Failed to calculate Rudraksha recommendations');
      }
    } catch (err) {
      setError('An error occurred while calculating Rudraksha recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Rudraksha Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the perfect Rudraksha beads for your spiritual journey. Get personalized recommendations 
                based on your birth details and current life challenges.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Form */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Enter Your Details
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birth Date *
                    </label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birth Time *
                    </label>
                    <input
                      type="time"
                      name="birth_time"
                      value={formData.birth_time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Place *
                  </label>
                  <input
                    type="text"
                    name="birth_place"
                    value={formData.birth_place}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your birth place"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Current Problems/Challenges (Select all that apply)
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {problemOptions.map((problem) => (
                      <label key={problem} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.current_problems.includes(problem)}
                          onChange={() => handleProblemToggle(problem)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-700">{problem}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Calculating...' : 'Get Rudraksha Recommendations'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Rudraksha Dashboard</h2>
                <p className="text-lg text-gray-600">Complete sacred bead analysis{result.personal_info?.name ? ` for ${result.personal_info.name}` : ''}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-sm p-2">
                <button className="px-6 py-3 rounded-md font-semibold text-orange-600 bg-orange-50 border-2 border-orange-200">
                  Overview
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                  Recommendations
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                  Benefits
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                  Wearing Guide
                </button>
              </div>

              <div className="space-y-8">
                {/* Overview Summary */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 border-4 border-orange-300 rounded-full mb-6">
                      <span className="text-5xl">📿</span>
                    </div>
                    <h3 className="text-4xl font-bold text-gray-800 mb-2">Rudraksha Analysis Complete</h3>
                    <p className="text-xl text-gray-600 mb-6">
                      Sacred Bead Recommendations Complete
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200 text-center">
                      <div className="text-4xl mb-2">🪄</div>
                      <div className="font-bold text-orange-800 text-lg">Primary Rudraksha</div>
                      <div className="text-3xl font-bold text-orange-600">{result.primary_rudraksha?.mukhi || 'N/A'}</div>
                      <div className="text-sm text-orange-600 mt-1">Mukhi Bead</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200 text-center">
                      <div className="text-4xl mb-2">🔮</div>
                      <div className="font-bold text-blue-800 text-lg">Secondary Rudraksha</div>
                      <div className="text-3xl font-bold text-blue-600">{result.secondary_rudraksha?.mukhi || 'Optional'}</div>
                      <div className="text-sm text-blue-600 mt-1">Mukhi Bead</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 text-center">
                      <div className="text-4xl mb-2">✨</div>
                      <div className="font-bold text-green-800 text-lg">Spiritual Benefits</div>
                      <div className="text-lg font-bold text-green-600">Enhanced</div>
                      <div className="text-sm text-green-600 mt-1">Energy & Protection</div>
                    </div>
                  </div>
                </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Primary Rudraksha */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{result.primary_rudraksha?.mukhi || 'N/A'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Primary Rudraksha
                    </h3>
                    <p className="text-lg text-orange-600 font-semibold">
                      {result.primary_rudraksha?.details?.name || 'Not Available'}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Ruling Planet:</h4>
                      <p className="text-gray-600">{result.primary_rudraksha?.details?.ruling_planet || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Benefits:</h4>
                      <p className="text-gray-600">{result.primary_rudraksha?.details?.benefits || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Wearing Method:</h4>
                      <p className="text-gray-600">{result.primary_rudraksha?.details?.wearing_method || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Color:</h4>
                      <p className="text-gray-600">{result.primary_rudraksha?.details?.color || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Secondary Rudraksha */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{result.secondary_rudraksha?.mukhi || 'N/A'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Secondary Rudraksha
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold">
                      {result.secondary_rudraksha?.details?.name || 'Not Available'}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Ruling Planet:</h4>
                      <p className="text-gray-600">{result.secondary_rudraksha?.details?.ruling_planet || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Benefits:</h4>
                      <p className="text-gray-600">{result.secondary_rudraksha?.details?.benefits || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Wearing Method:</h4>
                      <p className="text-gray-600">{result.secondary_rudraksha?.details?.wearing_method || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Color:</h4>
                      <p className="text-gray-600">{result.secondary_rudraksha?.details?.color || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem-Specific Recommendations */}
              {Array.isArray(result.problem_specific_recommendations) && result.problem_specific_recommendations.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    Problem-Specific Recommendations
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {result.problem_specific_recommendations.map((rec, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl font-bold text-white">{rec.rudraksha?.name?.split(' ')[0] || rec.rudraksha?.mukhi || 'N/A'}</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">{rec.rudraksha?.name || `${rec.rudraksha?.mukhi} Mukhi Rudraksha`}</h4>
                        </div>
                        <p className="text-gray-600 text-sm">{rec.reason || 'Recommended for your situation'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Guidelines */}
              <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  General Guidelines
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Wearing Time:</h4>
                    <p className="text-gray-600">{result.general_guidelines?.wearing_time || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Mantra:</h4>
                    <p className="text-gray-600">{result.general_guidelines?.mantra || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Care Instructions:</h4>
                    <p className="text-gray-600">{result.general_guidelines?.care_instructions || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Replacement:</h4>
                    <p className="text-gray-600">{result.general_guidelines?.replacement || 'N/A'}</p>
                  </div>
                </div>
              </div>

                {/* Benefits Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🌟</span> Spiritual Benefits & Significance
                  </h3>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
                    <p className="text-lg text-orange-800 leading-relaxed">
                      {result.benefits_summary || 'Rudraksha beads are sacred seeds that carry powerful spiritual energy. They help balance chakras, enhance meditation, and provide protection from negative energies while promoting overall well-being and spiritual growth.'}
                    </p>
                  </div>
                </div>

                {/* Understanding Rudraksha */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🕉️</span> Understanding Rudraksha Power
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🔬</span> Scientific Perspective
                        </h4>
                        <p className="text-purple-700 leading-relaxed">
                          Rudraksha beads have electromagnetic properties that influence the human bio-energy field.
                          Each mukhi (face) resonates with different energy frequencies, creating balance in the body and mind.
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
                        <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🧘</span> Spiritual Significance
                        </h4>
                        <p className="text-emerald-700 leading-relaxed">
                          In Vedic tradition, Rudraksha represents Lord Shiva's tears. Wearing these sacred beads
                          helps in spiritual awakening, enhances meditation, and provides protection from negative influences.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                      <h4 className="font-bold text-yellow-800 mb-3">Mukhi Meaning & Benefits:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded border border-yellow-200">
                          <h5 className="font-semibold text-yellow-800">1 Mukhi</h5>
                          <p className="text-sm text-yellow-700">Enlightenment & spiritual growth</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-yellow-200">
                          <h5 className="font-semibold text-yellow-800">5 Mukhi</h5>
                          <p className="text-sm text-yellow-700">Health, wealth & peace</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-yellow-200">
                          <h5 className="font-semibold text-yellow-800">7 Mukhi</h5>
                          <p className="text-sm text-yellow-700">Prosperity & success</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-yellow-200">
                          <h5 className="font-semibold text-yellow-800">9 Mukhi</h5>
                          <p className="text-sm text-yellow-700">Courage & protection</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-yellow-200">
                          <h5 className="font-semibold text-yellow-800">11 Mukhi</h5>
                          <p className="text-sm text-yellow-700">Healing & intuition</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-yellow-200">
                          <h5 className="font-semibold text-yellow-800">13 Mukhi</h5>
                          <p className="text-sm text-yellow-700">Wealth & achievement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border-2 border-orange-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                      <span className="text-3xl">📿</span> Need Authentic Rudraksha Consultation?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get expert guidance from Dr. Arup Shastri for authentic Rudraksha selection,
                      proper energization (prana pratishtha), wearing ceremonies, and personalized
                      spiritual guidance based on your complete astrological profile.
                    </p>
                    <a
                      href="/book-appointment"
                      className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Book Rudraksha Consultation
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
    </ProtectedRoute>
  );
}
