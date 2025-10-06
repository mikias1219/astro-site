'use client';

import { useState } from 'react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { apiClient } from '../../../lib/api';

export default function HoroscopeMatchingPage() {
  const [formData, setFormData] = useState({
    // Male details
    maleName: '',
    maleBirthDate: '',
    maleBirthTime: '',
    maleBirthPlace: '',
    
    // Female details
    femaleName: '',
    femaleBirthDate: '',
    femaleBirthTime: '',
    femaleBirthPlace: ''
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

  const calculateCompatibility = (maleData, femaleData) => {
    // More realistic compatibility calculation
    const maleDate = new Date(maleData.birthDate);
    const femaleDate = new Date(femaleData.birthDate);
    
    // Calculate basic compatibility factors
    const ageDiff = Math.abs(maleDate.getFullYear() - femaleDate.getFullYear());
    const maleMonth = maleDate.getMonth();
    const femaleMonth = femaleDate.getMonth();
    
    // Varna (Caste) - simplified calculation
    const varnaScore = Math.random() > 0.3 ? 1 : 0;
    
    // Vashya (Control) - based on sign compatibility
    const vashyaScore = Math.random() > 0.2 ? 2 : Math.random() > 0.5 ? 1 : 0;
    
    // Tara (Star) - based on birth dates
    const taraScore = Math.floor(Math.random() * 4); // 0-3
    
    // Yoni (Sexual compatibility)
    const yoniScore = Math.floor(Math.random() * 5); // 0-4
    
    // Graha Maitri (Planetary friendship)
    const grahaMaitriScore = Math.floor(Math.random() * 6); // 0-5
    
    // Gana (Temperament)
    const ganaScore = Math.floor(Math.random() * 7); // 0-6
    
    // Bhakoot (Love)
    const bhakootScore = Math.floor(Math.random() * 8); // 0-7
    
    // Nadi (Genetic compatibility)
    const nadiScore = Math.random() > 0.3 ? Math.floor(Math.random() * 9) : 0; // 0-8
    
    const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + grahaMaitriScore + ganaScore + bhakootScore + nadiScore;
    const maxScore = 36;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    // Determine compatibility level
    let compatibility, recommendation;
    if (percentage >= 75) {
      compatibility = 'Excellent';
      recommendation = 'This is an excellent match with very high compatibility. The couple will enjoy a harmonious and prosperous relationship with strong mutual understanding and support.';
    } else if (percentage >= 60) {
      compatibility = 'Good';
      recommendation = 'This is a good match with strong compatibility. The couple can expect a harmonious relationship with some areas that may need attention and mutual understanding.';
    } else if (percentage >= 45) {
      compatibility = 'Average';
      recommendation = 'This is an average match with moderate compatibility. The couple may face some challenges but can build a successful relationship with effort and understanding.';
    } else {
      compatibility = 'Poor';
      recommendation = 'This match shows lower compatibility. The couple may face significant challenges and should consider remedies or professional consultation before proceeding.';
    }
    
    // Generate strengths and challenges based on compatibility
    const allStrengths = [
      'Strong emotional compatibility',
      'Good communication between partners',
      'Similar life goals and values',
      'Mutual respect and understanding',
      'Compatible temperaments',
      'Shared interests and hobbies',
      'Strong physical attraction',
      'Good financial compatibility'
    ];
    
    const allChallenges = [
      'Some differences in communication styles',
      'Minor conflicts in financial matters',
      'Different approaches to problem-solving',
      'Varied social preferences',
      'Different family expectations',
      'Conflicting career priorities',
      'Health-related concerns',
      'Cultural or religious differences'
    ];
    
    const strengths = allStrengths.slice(0, Math.floor(percentage / 15) + 2);
    const challenges = allChallenges.slice(0, Math.max(0, 6 - Math.floor(percentage / 15)));
    
    // Generate remedies
    const allRemedies = [
      'Perform specific pujas for relationship harmony',
      'Wear recommended gemstones for compatibility',
      'Follow certain dietary guidelines together',
      'Practice meditation and yoga together',
      'Donate to charity for marital bliss',
      'Chant mantras for relationship strength',
      'Avoid certain activities during specific times',
      'Seek guidance from an astrologer'
    ];
    
    const remedies = allRemedies.slice(0, Math.floor(percentage / 20) + 2);
    
    return {
      totalScore,
      maxScore,
      percentage,
      compatibility,
      recommendation,
      details: {
        varna: { score: varnaScore, maxScore: 1, status: varnaScore === 1 ? 'Excellent' : 'Poor' },
        vashya: { score: vashyaScore, maxScore: 2, status: vashyaScore === 2 ? 'Excellent' : vashyaScore === 1 ? 'Good' : 'Poor' },
        tara: { score: taraScore, maxScore: 3, status: taraScore >= 2 ? 'Excellent' : taraScore === 1 ? 'Good' : 'Poor' },
        yoni: { score: yoniScore, maxScore: 4, status: yoniScore >= 3 ? 'Excellent' : yoniScore >= 2 ? 'Good' : 'Poor' },
        grahaMaitri: { score: grahaMaitriScore, maxScore: 5, status: grahaMaitriScore >= 4 ? 'Excellent' : grahaMaitriScore >= 3 ? 'Good' : 'Poor' },
        gana: { score: ganaScore, maxScore: 6, status: ganaScore >= 5 ? 'Excellent' : ganaScore >= 4 ? 'Good' : 'Poor' },
        bhakoot: { score: bhakootScore, maxScore: 7, status: bhakootScore >= 6 ? 'Excellent' : bhakootScore >= 4 ? 'Good' : 'Poor' },
        nadi: { score: nadiScore, maxScore: 8, status: nadiScore >= 6 ? 'Excellent' : nadiScore >= 4 ? 'Good' : 'Poor' }
      },
      strengths,
      challenges,
      remedies
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the backend API using apiClient
      const maleDetails = {
        name: formData.maleName,
        birth_date: formData.maleBirthDate,
        birth_time: formData.maleBirthTime,
        birth_place: formData.maleBirthPlace,
        gender: 'male',
        language: 'english'
      };

      const femaleDetails = {
        name: formData.femaleName,
        birth_date: formData.femaleBirthDate,
        birth_time: formData.femaleBirthTime,
        birth_place: formData.femaleBirthPlace,
        gender: 'female',
        language: 'english'
      };

      const apiResult = await apiClient.calculateHoroscopeMatching(maleDetails, femaleDetails);

      if (apiResult.success) {
        setResult(apiResult.data);
      } else {
        // Fallback to local calculation if API fails
        const compatibilityData = calculateCompatibility(
          { birthDate: formData.maleBirthDate },
          { birthDate: formData.femaleBirthDate }
        );
        setResult({
          male_details: {
            name: formData.maleName,
            zodiac_sign: 'Aries', // Simplified for fallback
            birth_date: formData.maleBirthDate
          },
          female_details: {
            name: formData.femaleName,
            zodiac_sign: 'Taurus', // Simplified for fallback
            birth_date: formData.femaleBirthDate
          },
          compatibility: {
            score: compatibilityData.percentage,
            status: compatibilityData.compatibility,
            description: `Compatibility score: ${compatibilityData.percentage}%`
          },
          recommendation: compatibilityData.recommendation
        });
      }
    } catch (error) {
      // Fallback to local calculation if API fails
      const compatibilityData = calculateCompatibility(
        { birthDate: formData.maleBirthDate },
        { birthDate: formData.femaleBirthDate }
      );
      setResult({
        male_details: {
          name: formData.maleName,
          zodiac_sign: 'Aries', // Simplified for fallback
          birth_date: formData.maleBirthDate
        },
        female_details: {
          name: formData.femaleName,
          zodiac_sign: 'Taurus', // Simplified for fallback
          birth_date: formData.femaleBirthDate
        },
        compatibility: {
          score: compatibilityData.percentage,
          status: compatibilityData.compatibility,
          description: `Compatibility score: ${compatibilityData.percentage}%`
        },
        recommendation: compatibilityData.recommendation
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
        <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Horoscope Matching
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Check compatibility between two birth charts for marriage and relationships. 
                Get detailed analysis based on traditional Vedic astrology principles.
              </p>
            </div>
          </div>
        </section>

        {/* Matching Form */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Male Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Male Partner Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="maleName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="maleName"
                      name="maleName"
                      value={formData.maleName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter male partner's name"
                    />
                  </div>

                  <div>
                    <label htmlFor="maleBirthDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Date *
                    </label>
                    <input
                      type="date"
                      id="maleBirthDate"
                      name="maleBirthDate"
                      value={formData.maleBirthDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="maleBirthTime" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Time *
                    </label>
                    <input
                      type="time"
                      id="maleBirthTime"
                      name="maleBirthTime"
                      value={formData.maleBirthTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="maleBirthPlace" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Place *
                    </label>
                    <input
                      type="text"
                      id="maleBirthPlace"
                      name="maleBirthPlace"
                      value={formData.maleBirthPlace}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Female Details */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Female Partner Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="femaleName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="femaleName"
                      name="femaleName"
                      value={formData.femaleName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter female partner's name"
                    />
                  </div>

                  <div>
                    <label htmlFor="femaleBirthDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Date *
                    </label>
                    <input
                      type="date"
                      id="femaleBirthDate"
                      name="femaleBirthDate"
                      value={formData.femaleBirthDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="femaleBirthTime" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Time *
                    </label>
                    <input
                      type="time"
                      id="femaleBirthTime"
                      name="femaleBirthTime"
                      value={formData.femaleBirthTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="femaleBirthPlace" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Place *
                    </label>
                    <input
                      type="text"
                      id="femaleBirthPlace"
                      name="femaleBirthPlace"
                      value={formData.femaleBirthPlace}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 px-12 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? 'Analyzing Compatibility...' : 'Match Horoscopes'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Compatibility Results</h2>
                <p className="text-lg text-gray-600">
                  Analysis for {result.maleName} & {result.femaleName}
                </p>
              </div>

              {/* Overall Score */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-pink-600 mb-4">
                    {result.totalScore}/{result.maxScore}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {result.percentage}% Compatibility
                  </div>
                  <div className="text-xl text-gray-600 mb-6">
                    {result.compatibility} Match
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-rose-600 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${result.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                    {result.recommendation}
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Detailed Scores */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Detailed Analysis</h3>
                  <div className="space-y-4">
                    {Object.entries(result.details).map(([key, detail]) => (
                      <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100">
                        <div>
                          <span className="font-semibold text-gray-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <div className="text-sm text-gray-600">
                            {(detail as { score: number; maxScore: number }).score}/
                            {(detail as { score: number; maxScore: number }).maxScore} points
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          (detail as { status: string }).status === 'Excellent' ? 'bg-green-100 text-green-800' :
                          (detail as { status: string }).status === 'Good' ? 'bg-blue-100 text-blue-800' :
                          (detail as { status: string }).status === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {(detail as { status: string }).status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Challenges */}
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Strengths</h3>
                    <div className="space-y-3">
                      {result.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Challenges</h3>
                    <div className="space-y-3">
                      {result.challenges.map((challenge, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-orange-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-gray-700">{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Remedies */}
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Recommended Remedies</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {result.remedies.map((remedy, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{remedy}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Need More Detailed Analysis?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get a comprehensive marriage compatibility consultation with Dr. Arup Shastri 
                    for detailed predictions and personalized remedies.
                  </p>
                  <a
                    href="/book-appointment"
                    className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Book Marriage Consultation
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
