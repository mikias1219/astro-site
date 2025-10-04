'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

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
  { name: 'Aries', symbol: '♈', color: 'from-red-400 to-red-600', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉', color: 'from-green-400 to-green-600', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊', color: 'from-yellow-400 to-yellow-600', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋', color: 'from-blue-400 to-blue-600', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌', color: 'from-orange-400 to-orange-600', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍', color: 'from-purple-400 to-purple-600', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎', color: 'from-pink-400 to-pink-600', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏', color: 'from-red-500 to-red-700', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐', color: 'from-indigo-400 to-indigo-600', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑', color: 'from-gray-400 to-gray-600', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒', color: 'from-cyan-400 to-cyan-600', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓', color: 'from-teal-400 to-teal-600', dates: 'Feb 19 - Mar 20' }
];

export default function HoroscopePage() {
  const [horoscopes, setHoroscopes] = useState<HoroscopeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedSign, setSelectedSign] = useState<string>('');

  useEffect(() => {
    fetchHoroscopes();
  }, [selectedPeriod]);

  const fetchHoroscopes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://astroarupshastri.com/api/horoscopes/${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setHoroscopes(data);
      } else {
        setError('Failed to fetch horoscope data');
      }
    } catch (error) {
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

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const filteredHoroscopes = selectedSign 
    ? horoscopes.filter(h => h.zodiac_sign === selectedSign)
    : horoscopes;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Free Daily / Weekly / Monthly Horoscope
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get personalized astrological predictions for all zodiac signs. 
                Discover what the stars have in store for you today, this week, and this month.
              </p>
            </div>
          </div>
        </section>

        {/* Period Selection */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center space-x-2 mb-6">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)} Horoscope
                </button>
              ))}
            </div>

            {/* Zodiac Sign Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedSign('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSign === ''
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Signs
              </button>
              {zodiacSigns.map((zodiac) => (
                <button
                  key={zodiac.name}
                  onClick={() => setSelectedSign(zodiac.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSign === zodiac.name
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {zodiac.symbol} {zodiac.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Horoscopes Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 text-xl mb-4">{error}</div>
                <button
                  onClick={fetchHoroscopes}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredHoroscopes.map((horoscope) => {
                  const zodiacInfo = getZodiacInfo(horoscope.zodiac_sign);
                  
                  return (
                    <div
                      key={`${horoscope.zodiac_sign}-${horoscope.period_type}`}
                      className={`bg-gradient-to-br ${zodiacInfo.color} rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300`}
                    >
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">{zodiacInfo.symbol}</div>
                        <div className="font-bold text-lg">{horoscope.zodiac_sign}</div>
                        <div className="text-sm opacity-80">{zodiacInfo.dates}</div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Love:</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreBgColor(horoscope.love_score)} ${getScoreColor(horoscope.love_score)}`}>
                            {horoscope.love_score}/10
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Career:</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreBgColor(horoscope.career_score)} ${getScoreColor(horoscope.career_score)}`}>
                            {horoscope.career_score}/10
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Health:</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreBgColor(horoscope.health_score)} ${getScoreColor(horoscope.health_score)}`}>
                            {horoscope.health_score}/10
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/20 pt-3 mb-4">
                        <div className="text-xs space-y-1">
                          <div>Lucky Color: <span className="font-semibold">{horoscope.lucky_color}</span></div>
                          <div>Lucky Number: <span className="font-semibold">{horoscope.lucky_number}</span></div>
                        </div>
                      </div>

                      <div className="text-sm leading-relaxed opacity-90">
                        {horoscope.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl shadow-2xl p-8 md:p-12">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Want Personalized Predictions?
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Get detailed astrological analysis and personalized predictions based on your complete birth chart. 
                  Consult with Dr. Arup Shastri for accurate and insightful guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/book-appointment"
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Book Consultation
                  </a>
                  <a 
                    href="/calculators/kundli"
                    className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
                  >
                    Generate Free Kundli
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}