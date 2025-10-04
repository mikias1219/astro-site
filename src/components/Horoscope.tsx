'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface HoroscopeData {
  id: number;
  zodiac_sign: string;
  date: string;
  period_type: string;
  content: string;
  love_score: number;
  career_score: number;
  health_score: number;
  lucky_color: string;
  lucky_number: string;
}

const zodiacSigns = [
  { name: 'Aries', symbol: '♈', color: 'from-red-400 to-red-600' },
  { name: 'Taurus', symbol: '♉', color: 'from-green-400 to-green-600' },
  { name: 'Gemini', symbol: '♊', color: 'from-yellow-400 to-yellow-600' },
  { name: 'Cancer', symbol: '♋', color: 'from-blue-400 to-blue-600' },
  { name: 'Leo', symbol: '♌', color: 'from-orange-400 to-orange-600' },
  { name: 'Virgo', symbol: '♍', color: 'from-purple-400 to-purple-600' },
  { name: 'Libra', symbol: '♎', color: 'from-pink-400 to-pink-600' },
  { name: 'Scorpio', symbol: '♏', color: 'from-red-500 to-red-700' },
  { name: 'Sagittarius', symbol: '♐', color: 'from-indigo-400 to-indigo-600' },
  { name: 'Capricorn', symbol: '♑', color: 'from-gray-400 to-gray-600' },
  { name: 'Aquarius', symbol: '♒', color: 'from-cyan-400 to-cyan-600' },
  { name: 'Pisces', symbol: '♓', color: 'from-teal-400 to-teal-600' }
];

export function Horoscope() {
  const [horoscopes, setHoroscopes] = useState<HoroscopeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetchHoroscopes();
  }, [selectedPeriod]);

  const fetchHoroscopes = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getHoroscopes();
      if (result.success && Array.isArray(result.data)) {
        setHoroscopes(result.data as HoroscopeData[]);
      } else {
        setError('Failed to fetch horoscope data');
      }
    } catch (err) {
      setError('Failed to fetch horoscope data');
      setHoroscopes([]);
      setError('Failed to fetch horoscope data');
    } finally {
      setLoading(false);
    }
  };

  const getZodiacInfo = (signName: string) => {
    return zodiacSigns.find(sign => sign.name === signName) || zodiacSigns[0];
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Free Daily / Weekly / Monthly Horoscope
        </h3>
        
        <div className="flex justify-center space-x-2 mb-6">
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {zodiacSigns.map((zodiac) => {
          const horoscope = horoscopes.find(h => h.zodiac_sign === zodiac.name);
          const zodiacInfo = getZodiacInfo(zodiac.name);
          
          return (
            <div
              key={zodiac.name}
              className={`bg-gradient-to-br ${zodiacInfo.color} rounded-lg p-4 text-white hover:shadow-lg transition-shadow cursor-pointer`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{zodiac.symbol}</div>
                <div className="font-semibold text-sm mb-2">{zodiac.name}</div>
                
                {horoscope && (
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Love:</span>
                      <span className={getScoreColor(horoscope.love_score)}>
                        {horoscope.love_score}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Career:</span>
                      <span className={getScoreColor(horoscope.career_score)}>
                        {horoscope.career_score}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health:</span>
                      <span className={getScoreColor(horoscope.health_score)}>
                        {horoscope.health_score}/10
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <div className="text-xs">
                        <div>Lucky Color: {horoscope.lucky_color}</div>
                        <div>Lucky Number: {horoscope.lucky_number}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <a
          href="/horoscope"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          View Detailed Horoscopes →
        </a>
      </div>
    </div>
  );
}
