'use client';

import { useState } from 'react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { apiClient } from '../../../lib/api';

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
        setResult(unwrapped as RudrakshaResult);
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
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Your Rudraksha Recommendations
                </h2>
                <p className="text-lg text-gray-600">
                  Personalized recommendations{result.personal_info?.name ? ` for ${result.personal_info.name}` : ''}
                </p>
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
              {result.problem_specific_recommendations && result.problem_specific_recommendations.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    Problem-Specific Recommendations
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {result.problem_specific_recommendations?.map((rec, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl font-bold text-white">{rec.rudraksha.name.split(' ')[0]}</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">{rec.rudraksha.name}</h4>
                        </div>
                        <p className="text-gray-600 text-sm">{rec.reason}</p>
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
              <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Benefits Summary</h3>
                <p className="text-lg text-gray-700">{result.benefits_summary}</p>
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
