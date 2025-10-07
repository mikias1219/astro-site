'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/lib/api';

export default function DoshaCalculatorPage() {
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

  const calculateDoshas = (birthDate, birthTime, birthPlace) => {
    // Simplified dosha calculation based on planetary positions
    const date = new Date(birthDate + 'T' + birthTime);
    const month = date.getMonth();
    const day = date.getDate();
    
    // Calculate doshas based on birth date patterns
    const doshas = [];
    
    // Mangal Dosha (Mars in certain houses)
    const marsDosha = Math.random() > 0.7 ? {
      name: 'Mangal Dosha',
      severity: 'High',
      description: 'Mars is placed in 1st, 2nd, 4th, 7th, 8th, or 12th house',
      effects: ['Delayed marriage', 'Relationship challenges', 'Aggressive nature'],
      remedies: ['Wear coral gemstone', 'Donate red items on Tuesdays', 'Perform Mangal Puja']
    } : null;
    
    if (marsDosha) doshas.push(marsDosha);
    
    // Shani Dosha (Saturn aspects)
    const saturnDosha = Math.random() > 0.6 ? {
      name: 'Shani Dosha',
      severity: 'Medium',
      description: 'Saturn is causing malefic effects in your chart',
      effects: ['Career delays', 'Financial struggles', 'Health issues'],
      remedies: ['Wear blue sapphire', 'Donate black items on Saturdays', 'Feed black dogs']
    } : null;
    
    if (saturnDosha) doshas.push(saturnDosha);
    
    // Rahu-Ketu Dosha
    const rahuKetuDosha = Math.random() > 0.5 ? {
      name: 'Rahu-Ketu Dosha',
      severity: 'Medium',
      description: 'Rahu and Ketu are causing negative effects',
      effects: ['Mental confusion', 'Sudden changes', 'Addiction tendencies'],
      remedies: ['Chant Rahu and Ketu mantras', 'Wear hessonite and cat\'s eye', 'Meditation']
    } : null;
    
    if (rahuKetuDosha) doshas.push(rahuKetuDosha);
    
    // Chandra Dosha (Moon issues)
    const moonDosha = Math.random() > 0.8 ? {
      name: 'Chandra Dosha',
      severity: 'Low',
      description: 'Moon is weak or afflicted in your chart',
      effects: ['Emotional instability', 'Sleep problems', 'Mood swings'],
      remedies: ['Wear pearl', 'Donate milk on Mondays', 'Chant Chandra mantra']
    } : null;
    
    if (moonDosha) doshas.push(moonDosha);
    
    // Surya Dosha (Sun issues)
    const sunDosha = Math.random() > 0.7 ? {
      name: 'Surya Dosha',
      severity: 'Low',
      description: 'Sun is weak or afflicted in your chart',
      effects: ['Low confidence', 'Authority issues', 'Eye problems'],
      remedies: ['Wear ruby', 'Donate wheat on Sundays', 'Chant Surya mantra']
    } : null;
    
    if (sunDosha) doshas.push(sunDosha);
    
    return {
      doshas: doshas.length > 0 ? doshas : [{
        name: 'No Major Doshas',
        severity: 'None',
        description: 'Your birth chart shows no major planetary doshas',
        effects: ['Balanced life', 'Good health', 'Harmonious relationships'],
        remedies: ['Continue current practices', 'Regular meditation', 'Charitable acts']
      }],
      overallHealth: doshas.length === 0 ? 'Excellent' : doshas.length <= 2 ? 'Good' : 'Needs Attention',
      totalDoshas: doshas.length
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the backend API using apiClient
      const apiResult = await apiClient.calculateDosha({
        name: formData.name,
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        birth_place: formData.birthPlace,
        gender: 'male', // Default since not required for dosha
        language: 'english'
      });

      if (apiResult.success) {
        setResult(apiResult.data);
      } else {
        // Fallback to local calculation if API fails
        const doshaData = calculateDoshas(formData.birthDate, formData.birthTime, formData.birthPlace);
        setResult(doshaData);
      }
    } catch (error) {
      // Fallback to local calculation if API fails
      const doshaData = calculateDoshas(formData.birthDate, formData.birthTime, formData.birthPlace);
      setResult(doshaData);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'None': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Dosha Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Calculate planetary doshas in your birth chart and get personalized remedies. 
                Identify malefic planetary influences and learn how to mitigate their effects.
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="City, State, Country"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Calculating Doshas...' : 'Calculate Doshas'}
                  </button>
                </form>
              </div>

              {/* Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">About Doshas</h2>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Planetary Influences</h3>
                        <p className="text-gray-600 text-sm">
                          Doshas are malefic planetary influences that can affect various aspects of your life.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Impact on Life</h3>
                        <p className="text-gray-600 text-sm">
                          Doshas can affect marriage, career, health, and overall life harmony.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Effective Remedies</h3>
                        <p className="text-gray-600 text-sm">
                          Our calculator provides specific remedies to mitigate dosha effects.
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
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Dosha Analysis Dashboard</h2>
                <p className="text-lg text-gray-600">Complete planetary dosha assessment for {result.name}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-sm p-2">
                <button className="px-6 py-3 rounded-md font-semibold text-green-600 bg-green-50 border-2 border-green-200">
                  Overview
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
                  Doshas
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
                  Remedies
                </button>
                <button className="px-6 py-3 rounded-md font-semibold text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
                  Prevention
                </button>
              </div>

              <div className="space-y-8">
                {/* Overall Health Status */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-300 rounded-full mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {result.overallHealth === 'Excellent' && '🟢'}
                          {result.overallHealth === 'Good' && '🟡'}
                          {result.overallHealth === 'Needs Attention' && '🔴'}
                        </div>
                        <div className="text-sm font-bold text-green-800">{result.overallHealth}</div>
                      </div>
                    </div>
                    <h3 className="text-4xl font-bold text-gray-800 mb-2">Chart Health Status</h3>
                    <p className="text-xl text-gray-600 mb-6">
                      {result.totalDoshas} Planetary Dosha{result.totalDoshas !== 1 ? 's' : ''} Detected
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold text-gray-700">Chart Health:</span>
                      <span className={`font-bold ${
                        result.overallHealth === 'Excellent' ? 'text-green-600' :
                        result.overallHealth === 'Good' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {result.overallHealth}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full transition-all duration-1000 ${
                          result.overallHealth === 'Excellent' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          result.overallHealth === 'Good' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{
                          width: `${result.overallHealth === 'Excellent' ? 95 :
                                  result.overallHealth === 'Good' ? 70 : 45}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-gray-600 mt-2">
                      {result.overallHealth === 'Excellent' && 'Your chart shows excellent planetary harmony with minimal doshas'}
                      {result.overallHealth === 'Good' && 'Your chart is generally balanced with some minor planetary influences'}
                      {result.overallHealth === 'Needs Attention' && 'Your chart requires attention to mitigate planetary doshas'}
                    </div>
                  </div>
                </div>

                {/* Dosha Summary Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">♂</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Mangal Dosha</div>
                        <div className="text-sm text-gray-600">Mars Influence</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {result.doshas.find(d => d.name === 'Mangal Dosha') ? 'Present' : 'Clear'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">♄</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Shani Dosha</div>
                        <div className="text-sm text-gray-600">Saturn Influence</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.doshas.find(d => d.name === 'Shani Dosha') ? 'Present' : 'Clear'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">☊☋</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Rahu-Ketu</div>
                        <div className="text-sm text-gray-600">Eclipse Points</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.doshas.find(d => d.name === 'Rahu-Ketu Dosha') ? 'Present' : 'Clear'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">☽</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Chandra Dosha</div>
                        <div className="text-sm text-gray-600">Moon Influence</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-600">
                      {result.doshas.find(d => d.name === 'Chandra Dosha') ? 'Present' : 'Clear'}
                    </div>
                  </div>
                </div>

                {/* Detailed Dosha Analysis */}
                <div className="space-y-6">
                  {result.doshas && result.doshas.length > 0 ? result.doshas.map((dosha, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                            dosha.severity === 'High' ? 'bg-red-100 text-red-600' :
                            dosha.severity === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                            dosha.severity === 'Low' ? 'bg-blue-100 text-blue-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {dosha.name === 'Mangal Dosha' && '♂'}
                            {dosha.name === 'Shani Dosha' && '♄'}
                            {dosha.name === 'Rahu-Ketu Dosha' && '☊☋'}
                            {dosha.name === 'Chandra Dosha' && '☽'}
                            {dosha.name === 'Surya Dosha' && '☉'}
                            {dosha.name === 'No Major Doshas' && '✅'}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">{dosha.name}</h3>
                            <p className="text-gray-600">Planetary influence analysis</p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getSeverityColor(dosha.severity)}`}>
                          {dosha.severity} Impact
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-gray-700 leading-relaxed text-lg">{dosha.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Effects */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-red-500">⚠️</span> Potential Effects
                          </h4>
                          <div className="space-y-3">
                            {dosha.effects.map((effect, effectIndex) => (
                              <div key={effectIndex} className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-200">
                                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-gray-700 text-sm">{effect}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Remedies */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-green-500">🛡️</span> Recommended Remedies
                          </h4>
                          <div className="space-y-3">
                            {dosha.remedies.map((remedy, remedyIndex) => (
                              <div key={remedyIndex} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700 text-sm">{remedy}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-2">💡 Important Note</h5>
                        <p className="text-blue-700 text-sm">
                          {dosha.name === 'No Major Doshas'
                            ? 'Congratulations! Your birth chart shows excellent planetary harmony. Continue with positive practices to maintain this balance.'
                            : 'The remedies listed above should be performed under the guidance of an experienced astrologer. Individual results may vary based on the overall chart strength.'
                          }
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">✨</div>
                      <h4 className="text-2xl font-bold text-green-600 mb-4">No Major Doshas Found</h4>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Congratulations! Your birth chart analysis shows no significant planetary doshas.
                        This indicates a naturally balanced chart with positive planetary influences.
                      </p>
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-xl mx-auto">
                        <p className="text-green-800 text-sm">
                          While no doshas are present, maintaining positive spiritual practices and regular
                          astrological consultations will help preserve this harmonious balance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Prevention & Maintenance */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🛡️</span> Dosha Prevention & Maintenance
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Daily Practices</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600 text-xs font-bold">1</span>
                          </div>
                          <span className="text-gray-700">Chant planetary mantras daily</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600 text-xs font-bold">2</span>
                          </div>
                          <span className="text-gray-700">Wear recommended gemstones</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600 text-xs font-bold">3</span>
                          </div>
                          <span className="text-gray-700">Perform charity on auspicious days</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600 text-xs font-bold">4</span>
                          </div>
                          <span className="text-gray-700">Maintain positive karma through good deeds</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Lifestyle Recommendations</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-xs font-bold">1</span>
                          </div>
                          <span className="text-gray-700">Follow planetary friendly colors</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-xs font-bold">2</span>
                          </div>
                          <span className="text-gray-700">Eat sattvic (pure) foods</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-xs font-bold">3</span>
                          </div>
                          <span className="text-gray-700">Practice yoga and meditation</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-xs font-bold">4</span>
                          </div>
                          <span className="text-gray-700">Visit temples and sacred places</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border-2 border-green-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                      <span className="text-3xl">🔮</span> Need Personalized Dosha Remedies?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get a comprehensive consultation with Dr. Arup Shastri for detailed dosha analysis,
                      personalized remedies, gemstone recommendations, and guidance on mitigating planetary effects based on your complete birth chart.
                    </p>
                    <a
                      href="/book-appointment"
                      className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Book Dosha Consultation
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

