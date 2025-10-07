'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/lib/api';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface NumerologyResult {
  id: number;
  name: string;
  birth_date: string;
  life_path_number: number;
  destiny_number: number;
  soul_urge_number: number;
  personality_number: number;
  maturity_number: number;
  birth_day_number: number;
  lucky_numbers: string;
  lucky_colors: string;
  lucky_days: string;
  lucky_stones: string;
  personality_traits: string;
  career_guidance: string;
  relationship_compatibility: string;
  health_predictions: string;
  financial_outlook: string;
}

export default function NumerologyCalculatorPage() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: ''
  });

  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiResult = await apiClient.calculateNumerology({
        name: formData.name,
        birth_date: formData.birthDate
      });

      if (apiResult.success) {
        setResult(apiResult.data as NumerologyResult);
      } else {
        setError(apiResult.error || 'Failed to calculate numerology');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const NumberCard = ({ title, number, description }: { title: string; number: number; description: string }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-white">{number}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return (
    <ProtectedRoute 
      fallback={
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="max-w-2xl mx-auto text-center px-4">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Premium Numerology Calculator</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Unlock the power of numbers in your life. Our advanced numerology calculator provides 
                  comprehensive insights into your personality, destiny, and future prospects.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">What You'll Get:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">Life Path Number Analysis</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">Destiny & Soul Numbers</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">Lucky Numbers & Colors</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">Career Guidance</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">Relationship Compatibility</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">Health & Financial Predictions</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/register"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
                >
                  Create Free Account
                </a>
                <a
                  href="/login"
                  className="border-2 border-purple-500 text-purple-600 py-3 px-8 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300"
                >
                  Login to Continue
                </a>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-5xl font-bold text-gray-800 mb-6">
                Numerology Calculator
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover the hidden meanings behind numbers in your life. Get comprehensive 
                numerology analysis based on your name and birth date.
              </p>
            </div>
          </section>

          {/* Calculator Form */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  Calculate Your Numbers
                </h2>
                
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
                      placeholder="Enter your full name as per birth certificate"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">Use the name exactly as it appears on your birth certificate</p>
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

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Calculating...' : 'Calculate Numerology'}
                  </button>
                </form>
              </div>

              {/* Information Panel */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">About Numerology</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Numerology is the ancient science of numbers that reveals the hidden meanings 
                      and vibrations in your life. Each number carries specific energies that influence 
                      your personality, destiny, and life path.
                    </p>
                    <p>
                      Our comprehensive numerology analysis includes:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span><strong>Life Path Number:</strong> Your life's purpose and journey</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span><strong>Destiny Number:</strong> Your life's mission and goals</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span><strong>Soul Urge Number:</strong> Your inner desires and motivations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span><strong>Personality Number:</strong> How others perceive you</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Why Choose Our Calculator?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-yellow-300 mr-3">✨</span>
                      <span>Accurate Pythagorean calculations</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-300 mr-3">📊</span>
                      <span>Comprehensive analysis report</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-300 mr-3">🔮</span>
                      <span>Personalized predictions</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-300 mr-3">💎</span>
                      <span>Lucky elements guidance</span>
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
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Numerology Dashboard</h2>
                    <p className="text-lg text-gray-600">Complete number analysis for {result.name}</p>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-sm p-2">
                    <button className="px-6 py-3 rounded-md font-semibold text-purple-600 bg-purple-50 border-2 border-purple-200">
                      Overview
                    </button>
                    <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                      Core Numbers
                    </button>
                    <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                      Lucky Elements
                    </button>
                    <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                      Predictions
                    </button>
                  </div>

                  <div className="space-y-8">
                    {/* Overview Summary */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 border-4 border-purple-300 rounded-full mb-6">
                          <span className="text-5xl">🔢</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-800 mb-2">Numerology Analysis Complete</h3>
                        <p className="text-xl text-gray-600 mb-6">
                          Born on {new Date(result.birth_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200 text-center">
                          <div className="text-4xl mb-2">🎯</div>
                          <div className="font-bold text-purple-800 text-lg">Life Path Number</div>
                          <div className="text-3xl font-bold text-purple-600">{result.life_path_number}</div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200 text-center">
                          <div className="text-4xl mb-2">🎨</div>
                          <div className="font-bold text-blue-800 text-lg">Expression Number</div>
                          <div className="text-3xl font-bold text-blue-600">{result.destiny_number}</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 text-center">
                          <div className="text-4xl mb-2">💚</div>
                          <div className="font-bold text-green-800 text-lg">Soul Urge Number</div>
                          <div className="text-3xl font-bold text-green-600">{result.soul_urge_number}</div>
                        </div>
                      </div>
                    </div>

                  {/* Core Numbers */}
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Core Numbers</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                      <NumberCard 
                        title="Life Path" 
                        number={result.life_path_number} 
                        description="Your life's journey and purpose"
                      />
                      <NumberCard 
                        title="Destiny" 
                        number={result.destiny_number} 
                        description="Your life's mission and goals"
                      />
                      <NumberCard 
                        title="Soul Urge" 
                        number={result.soul_urge_number} 
                        description="Your inner desires and motivations"
                      />
                      <NumberCard 
                        title="Personality" 
                        number={result.personality_number} 
                        description="How others perceive you"
                      />
                      <NumberCard 
                        title="Maturity" 
                        number={result.maturity_number} 
                        description="Your later life focus"
                      />
                      <NumberCard 
                        title="Birth Day" 
                        number={result.birth_day_number} 
                        description="Your natural talents"
                      />
                    </div>
                  </div>

                  {/* Lucky Elements */}
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Lucky Elements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">🔢</div>
                        <h4 className="font-bold text-gray-800 mb-2">Lucky Numbers</h4>
                        <p className="text-gray-600">{result.lucky_numbers}</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">🎨</div>
                        <h4 className="font-bold text-gray-800 mb-2">Lucky Colors</h4>
                        <p className="text-gray-600">{result.lucky_colors}</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">📅</div>
                        <h4 className="font-bold text-gray-800 mb-2">Lucky Days</h4>
                        <p className="text-gray-600">{result.lucky_days}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">💎</div>
                        <h4 className="font-bold text-gray-800 mb-2">Lucky Stones</h4>
                        <p className="text-gray-600">{result.lucky_stones}</p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="text-2xl mr-3">👤</span>
                        Personality Traits
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{result.personality_traits}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="text-2xl mr-3">💼</span>
                        Career Guidance
                      </h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{result.career_guidance}</p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="text-2xl mr-3">💕</span>
                        Relationship Compatibility
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{result.relationship_compatibility}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="text-2xl mr-3">🏥</span>
                        Health Predictions
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{result.health_predictions}</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="text-2xl mr-3">💰</span>
                        Financial Outlook
                      </h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{result.financial_outlook}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-12 text-center space-y-4">
                    <button
                      onClick={() => window.print()}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 mr-4"
                    >
                      Print Report
                    </button>
                    <button
                      onClick={() => setResult(null)}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
                    >
                      Calculate Another
                    </button>
                  </div>
                </div>

                {/* Comprehensive Numerology Insights */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🔮</span> Understanding Your Numbers
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                        <h4 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🎯</span> Life Path Number Meaning
                        </h4>
                        <p className="text-indigo-700 leading-relaxed">
                          Your Life Path Number represents the path you are destined to walk in this lifetime.
                          It reveals your life's purpose, challenges, and opportunities for growth.
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
                        <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🎨</span> Expression Number Insights
                        </h4>
                        <p className="text-emerald-700 leading-relaxed">
                          Your Expression Number reveals how you express yourself to the world and your natural talents.
                          It shows your potential and the skills you bring to your life's work.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                      <h4 className="font-bold text-yellow-800 mb-3">How to Use Your Lucky Elements:</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="font-semibold text-yellow-700">Daily Practices:</h5>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Wear your lucky colors on important days</li>
                            <li>• Use lucky numbers in decision making</li>
                            <li>• Schedule important activities on lucky days</li>
                            <li>• Surround yourself with lucky gemstones</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-yellow-700">Long-term Benefits:</h5>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Enhanced positive energy flow</li>
                            <li>• Better decision making alignment</li>
                            <li>• Increased opportunities and success</li>
                            <li>• Improved overall life harmony</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-8 border-2 border-purple-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                      <span className="text-3xl">🔮</span> Want Detailed Numerology Reading?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get a comprehensive numerology consultation with Dr. Arup Shastri for detailed analysis
                      of all your core numbers, life cycles, personal year forecasts, and personalized guidance
                      based on your complete numerological profile.
                    </p>
                    <a
                      href="/book-appointment"
                      className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Book Numerology Consultation
                    </a>
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
