'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/lib/api';
import LoginRequiredModal from '@/components/auth/LoginRequiredModal';
import { useAuth } from '@/contexts/AuthContext';
import BirthChart from '@/components/BirthChart';

export default function HoroscopeMatchingPage() {
  const { isAuthenticated } = useAuth();
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
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    const maleDay = maleDate.getDate();
    const femaleDay = femaleDate.getDate();
    
    // Use deterministic calculations based on birth dates instead of random
    // Varna (Caste) - based on month compatibility
    const varnaScore = Math.abs(maleMonth - femaleMonth) <= 4 ? 1 : 0;
    
    // Vashya (Control) - based on sign compatibility
    const vashyaDiff = Math.abs(maleMonth - femaleMonth);
    const vashyaScore = vashyaDiff === 0 ? 2 : vashyaDiff <= 2 ? 1 : 0;
    
    // Tara (Star) - based on birth dates (deterministic)
    const taraDiff = Math.abs(maleDay - femaleDay);
    const taraScore = taraDiff <= 7 ? 3 : taraDiff <= 14 ? 2 : taraDiff <= 21 ? 1 : 0;
    
    // Yoni (Sexual compatibility) - based on day combinations
    const yoniSum = (maleDay + femaleDay) % 5;
    const yoniScore = yoniSum >= 3 ? 4 : yoniSum >= 2 ? 3 : yoniSum >= 1 ? 2 : 1;
    
    // Graha Maitri (Planetary friendship) - based on month pairing
    const grahaDiff = Math.abs(maleMonth - femaleMonth);
    const grahaMaitriScore = grahaDiff === 0 ? 5 : grahaDiff <= 2 ? 4 : grahaDiff <= 4 ? 3 : 2;
    
    // Gana (Temperament) - based on year parity
    const maleYear = maleDate.getFullYear();
    const femaleYear = femaleDate.getFullYear();
    const ganaDiff = Math.abs((maleYear % 3) - (femaleYear % 3));
    const ganaScore = ganaDiff === 0 ? 6 : ganaDiff === 1 ? 4 : 2;
    
    // Bhakoot (Love) - based on month distance
    const bhakootDiff = Math.abs(maleMonth - femaleMonth);
    const bhakootScore = bhakootDiff <= 2 ? 7 : bhakootDiff <= 4 ? 5 : bhakootDiff <= 6 ? 3 : 1;
    
    // Nadi (Genetic compatibility) - based on day parity
    const nadiDiff = Math.abs((maleDay % 3) - (femaleDay % 3));
    const nadiScore = nadiDiff === 0 ? 0 : nadiDiff === 1 ? 4 : 8;
    
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
    
    // Generate strengths and challenges based on compatibility (deterministic)
    const allStrengths = [
      'Strong emotional compatibility',
      'Good communication between partners',
      'Similar life goals and values',
      'Mutual respect and understanding',
      'Compatible temperaments',
      'Shared interests and hobbies',
      'Strong physical attraction',
      'Good financial compatibility',
      'Harmonious family dynamics',
      'Balanced power distribution',
      'Supportive of each other\'s growth',
      'Strong spiritual connection'
    ];
    
    const allChallenges = [
      'Some differences in communication styles',
      'Minor conflicts in financial matters',
      'Different approaches to problem-solving',
      'Varied social preferences',
      'Different family expectations',
      'Conflicting career priorities',
      'Need for better work-life balance',
      'Cultural or religious differences'
    ];
    
    // Ensure minimum 3 strengths and 2 challenges
    const numStrengths = Math.max(3, Math.min(8, Math.floor(percentage / 12) + 3));
    const numChallenges = Math.max(2, Math.min(6, 8 - Math.floor(percentage / 15)));
    
    const strengths = allStrengths.slice(0, numStrengths);
    const challenges = allChallenges.slice(0, numChallenges);
    
    // Generate remedies (deterministic based on score)
    const allRemedies = [
      'Perform specific pujas for relationship harmony',
      'Wear recommended gemstones for compatibility',
      'Follow certain dietary guidelines together',
      'Practice meditation and yoga together',
      'Donate to charity for marital bliss',
      'Chant mantras for relationship strength',
      'Visit temples together on auspicious days',
      'Seek guidance from an experienced astrologer'
    ];
    
    const numRemedies = Math.max(3, Math.min(6, Math.floor((100 - percentage) / 15) + 3));
    const remedies = allRemedies.slice(0, numRemedies);
    
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
        const payload = (apiResult as any).data;
        const unwrapped = payload && typeof payload === 'object' && 'data' in payload ? (payload as any).data : payload;
        setResult(unwrapped);
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
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Marriage Compatibility Dashboard</h2>
                <p className="text-lg text-gray-600">
                  Comprehensive analysis for {result.male_details?.name || formData.maleName} & {result.female_details?.name || formData.femaleName}
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-sm p-2">
                {['Overview','Compatibility','Strengths','Remedies'].map((tab) => (
                  <a key={tab} href={`#${tab.toLowerCase()}`} className={`px-6 py-3 rounded-md font-semibold transition-colors ${tab==='Overview' ? 'text-pink-600 bg-pink-50 border-2 border-pink-200' : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'}`}>
                    {tab}
                  </a>
                ))}
              </div>

              <div className="space-y-8">
                {/* Overall Compatibility Score */}
                <div id="overview" className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-pink-100 to-rose-100 border-4 border-pink-300 rounded-full mb-6">
                      <div className="text-center">
                        <div className={`text-4xl font-bold mb-1 ${
                          (result.compatibility?.score || result.percentage) >= 75 ? 'text-green-600' :
                          (result.compatibility?.score || result.percentage) >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {(result.compatibility?.score || result.percentage) >= 75 && '💕'}
                          {(result.compatibility?.score || result.percentage) >= 60 && (result.compatibility?.score || result.percentage) < 75 && '👍'}
                          {(result.compatibility?.score || result.percentage) < 60 && '⚠️'}
                        </div>
                        <div className="text-sm font-bold text-gray-800">
                          {result.compatibility?.status || result.compatibility}
                        </div>
                      </div>
                    </div>
                    {(() => {
                      const percentRaw = (result.compatibility?.score ?? result.percentage ?? 0) as number;
                      const percent = Math.max(0, Math.min(100, percentRaw));
                      const pointsRaw = (result.totalScore ?? result.points ?? Math.round((percent/100)*36)) as number;
                      const points = Math.max(0, Math.min(36, pointsRaw));
                      const max = (result.maxScore ?? 36) as number;
                      return (
                        <>
                          <h3 className="text-4xl font-bold text-gray-800 mb-2">
                            {percent}% Compatibility Score
                          </h3>
                          <p className="text-xl text-gray-600 mb-6">
                            {points} out of {max} points
                          </p>
                        </>
                      );
                    })()}
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold text-gray-700">Overall Compatibility:</span>
                      <span className={`font-bold text-xl ${
                        (result.compatibility?.score || result.percentage) >= 75 ? 'text-green-600' :
                        (result.compatibility?.score || result.percentage) >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {(result.compatibility?.score || result.percentage) >= 75 && 'Excellent Match'}
                        {(result.compatibility?.score || result.percentage) >= 60 && (result.compatibility?.score || result.percentage) < 75 && 'Good Match'}
                        {(result.compatibility?.score || result.percentage) < 60 && 'Needs Attention'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full transition-all duration-1000 ${
                          (result.compatibility?.score || result.percentage) >= 75 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          (result.compatibility?.score || result.percentage) >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{
                          width: `${Math.max(0, Math.min(100, (result.compatibility?.score ?? result.percentage ?? 0) as number))}%`
                        }}
                      ></div>
                    </div>
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-200">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {result.recommendation || result.compatibility?.description || 'This compatibility analysis is based on traditional Vedic astrology principles including the 36 Guna matching system.'}
                      </p>
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => { if (!isAuthenticated) { setShowLoginModal(true); return; } window.location.hash = '#compatibility'; }}
                        className="inline-block bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-lg"
                      >
                        View Full Premium Analysis
                      </button>
                    </div>
                    </div>
                  </div>
                </div>

                {/* Birth Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Male Partner Birth Chart */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                      <span className="text-2xl">📊</span> {result.male_details?.name || formData.maleName}'s Birth Chart
                    </h3>
                    <BirthChart planetaryPositions={result.male_planetary_positions || {
                      sun: { house: 1, sign: 'Pisces' },
                      moon: { house: 4, sign: 'Gemini' },
                      mars: { house: 3, sign: 'Taurus' },
                      mercury: { house: 2, sign: 'Aries' },
                      jupiter: { house: 10, sign: 'Sagittarius' },
                      venus: { house: 5, sign: 'Cancer' },
                      saturn: { house: 7, sign: 'Virgo' },
                      rahu: { house: 6, sign: 'Leo' },
                      ketu: { house: 12, sign: 'Aquarius' }
                    }} />
                    <div className="mt-4 text-center text-sm text-gray-600">
                      Birth chart showing planetary positions at birth
                    </div>
                  </div>

                  {/* Female Partner Birth Chart */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                      <span className="text-2xl">📊</span> {result.female_details?.name || formData.femaleName}'s Birth Chart
                    </h3>
                    <BirthChart planetaryPositions={result.female_planetary_positions || {
                      sun: { house: 7, sign: 'Aquarius' },
                      moon: { house: 2, sign: 'Aries' },
                      mars: { house: 8, sign: 'Scorpio' },
                      mercury: { house: 6, sign: 'Leo' },
                      jupiter: { house: 11, sign: 'Capricorn' },
                      venus: { house: 9, sign: 'Libra' },
                      saturn: { house: 4, sign: 'Gemini' },
                      rahu: { house: 3, sign: 'Taurus' },
                      ketu: { house: 9, sign: 'Scorpio' }
                    }} />
                    <div className="mt-4 text-center text-sm text-gray-600">
                      Birth chart showing planetary positions at birth
                    </div>
                  </div>
                </div>

                {/* Partner Profiles */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-white">👨</span>
                      </div>
                      <h3 className="text-2xl font-bold text-blue-800">
                        {result.male_details?.name || formData.maleName}
                      </h3>
                      <p className="text-blue-600">Male Partner</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-blue-200">
                        <span className="font-semibold text-blue-700">Zodiac Sign:</span>
                        <span className="text-blue-800">{result.male_details?.zodiac_sign || 'Aries'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-blue-200">
                        <span className="font-semibold text-blue-700">Birth Date:</span>
                        <span className="text-blue-800">{result.male_details?.birth_date || formData.maleBirthDate}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-semibold text-blue-700">Birth Place:</span>
                        <span className="text-blue-800">{result.male_details?.birth_place || formData.maleBirthPlace}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-200">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-white">👩</span>
                      </div>
                      <h3 className="text-2xl font-bold text-pink-800">
                        {result.female_details?.name || formData.femaleName}
                      </h3>
                      <p className="text-pink-600">Female Partner</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-pink-200">
                        <span className="font-semibold text-pink-700">Zodiac Sign:</span>
                        <span className="text-pink-800">{result.female_details?.zodiac_sign || 'Taurus'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-pink-200">
                        <span className="font-semibold text-pink-700">Birth Date:</span>
                        <span className="text-pink-800">{result.female_details?.birth_date || formData.femaleBirthDate}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-semibold text-pink-700">Birth Place:</span>
                        <span className="text-pink-800">{result.female_details?.birth_place || formData.femaleBirthPlace}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed 36 Guna Analysis */}
                {result.details && (
                  <div id="compatibility" className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span className="text-2xl">📊</span> 36 Guna Matching Analysis
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries(result.details).map(([key, detail]) => (
                        <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                          <div className="text-center mb-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                              (detail as { status: string }).status === 'Excellent' ? 'bg-green-100 text-green-600' :
                              (detail as { status: string }).status === 'Good' ? 'bg-blue-100 text-blue-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              <span className="font-bold text-lg">
                                {(detail as { score: number }).score}/{(detail as { maxScore: number }).maxScore}
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-800 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                          </div>
                          <div className={`text-center px-2 py-1 rounded-full text-xs font-semibold ${
                            (detail as { status: string }).status === 'Excellent' ? 'bg-green-200 text-green-800' :
                            (detail as { status: string }).status === 'Good' ? 'bg-blue-200 text-blue-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {(detail as { status: string }).status}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-800 mb-2">Understanding the 36 Guna System:</h4>
                      <p className="text-indigo-700 text-sm">
                        The 36 Guna matching system evaluates 8 different aspects of compatibility: Varna (Spiritual), Vashya (Dominance),
                        Tara (Destiny), Yoni (Nature), Graha Maitri (Compatibility), Gana (Temperament), Bhakoot (Love), and Nadi (Health).
                        Each aspect contributes points towards the overall compatibility score.
                      </p>
                    </div>
                  </div>
                )}

                {/* Relationship Strengths & Challenges */}
                <div id="strengths" className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span className="text-2xl">💪</span> Relationship Strengths
                    </h3>
                    <div className="space-y-4">
                      {result.strengths?.map((strength, index) => (
                        <div key={index} className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-700 font-medium">{strength}</span>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">
                          <span className="text-4xl mb-2 block">🌟</span>
                          <p>No specific strengths identified in this analysis.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div id="remedies" className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span className="text-2xl">⚠️</span> Potential Challenges
                    </h3>
                    <div className="space-y-4">
                      {result.challenges?.map((challenge, index) => (
                        <div key={index} className="flex items-start gap-3 bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <span className="text-gray-700 font-medium">{challenge}</span>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">
                          <span className="text-4xl mb-2 block">✨</span>
                          <p>No major challenges identified in this analysis.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remedies & Recommendations */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🛡️</span> Remedies & Recommendations
                  </h3>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {result.remedies?.map((remedy, index) => (
                        <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <span className="text-purple-700 font-medium">{remedy}</span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500 col-span-full">
                          <span className="text-4xl mb-2 block">🙏</span>
                          <p>Consult an astrologer for personalized remedies based on your specific charts.</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3">General Marriage Tips:</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">💕</span>
                            <span className="text-blue-700 text-sm">Communicate openly about expectations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">🤝</span>
                            <span className="text-blue-700 text-sm">Respect each other's family traditions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">🎯</span>
                            <span className="text-blue-700 text-sm">Set common goals and work together</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">🧘</span>
                            <span className="text-blue-700 text-sm">Practice meditation together</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">🙏</span>
                            <span className="text-blue-700 text-sm">Visit temples and perform pujas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">💪</span>
                            <span className="text-blue-700 text-sm">Build mutual understanding and patience</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compatibility Insights */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200">
                  <h3 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
                    💡 Compatibility Insights
                  </h3>

                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">👥</div>
                      <h4 className="font-bold text-emerald-800 mb-2">Communication</h4>
                      <p className="text-sm text-emerald-700">
                        {(result.compatibility?.score || result.percentage) >= 70 ? 'Excellent communication flow between partners' :
                         (result.compatibility?.score || result.percentage) >= 50 ? 'Good communication with minor differences' :
                         'May need to work on communication styles'}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">💰</div>
                      <h4 className="font-bold text-emerald-800 mb-2">Finance</h4>
                      <p className="text-sm text-emerald-700">
                        {(result.compatibility?.score || result.percentage) >= 70 ? 'Harmonious financial planning' :
                         (result.compatibility?.score || result.percentage) >= 50 ? 'Compatible with some financial discussions needed' :
                         'May need careful financial planning'}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
                      <h4 className="font-bold text-emerald-800 mb-2">Family Life</h4>
                      <p className="text-sm text-emerald-700">
                        {(result.compatibility?.score || result.percentage) >= 70 ? 'Strong foundation for family life' :
                         (result.compatibility?.score || result.percentage) >= 50 ? 'Good potential for happy family life' :
                         'May require extra effort for family harmony'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl shadow-lg p-8 border-2 border-pink-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                      <span className="text-3xl">💒</span> Need Detailed Marriage Consultation?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get a comprehensive marriage compatibility analysis with Dr. Arup Shastri including detailed
                      predictions, dosha analysis, gemstone recommendations, and personalized remedies for a successful marriage.
                    </p>
                    <a
                      href="/book-appointment"
                      className="inline-block bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Book Marriage Consultation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} message="Please login or register to view the full premium matching analysis." />
      <Footer />
    </div>
  );
}
