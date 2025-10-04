'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

interface PanchangData {
  id: number;
  date: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithi: string;
  tithi_end_time: string;
  nakshatra: string;
  nakshatra_end_time: string;
  yoga: string;
  yoga_end_time: string;
  karan: string;
  karan_end_time: string;
  amanta_month: string;
  purnimanta_month: string;
  vikram_samvat: string;
  shaka_samvat: string;
}

export default function PanchangPage() {
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchPanchang();
  }, [selectedDate]);

  const fetchPanchang = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://astroarupshastri.com/api/panchang/?date_filter=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setPanchang(data[0]);
        } else {
          // If no data for selected date, fetch today's data
          const todayResponse = await fetch('https://astroarupshastri.com/api/panchang/today');
          if (todayResponse.ok) {
            const todayData = await todayResponse.json();
            setPanchang(todayData);
          }
        }
      } else {
        setError('Failed to fetch panchang data');
      }
    } catch (error) {
      setError('Failed to fetch panchang data');
    } finally {
      setLoading(false);
    }
  };

  // Fallback data if API fails
  const fallbackPanchang: PanchangData = {
    id: 0,
    date: selectedDate,
    sunrise: "06:30",
    sunset: "18:30",
    moonrise: "20:15",
    moonset: "08:45",
    tithi: "Shukla Paksha, Dwitiya",
    tithi_end_time: "14:30",
    nakshatra: "Rohini",
    nakshatra_end_time: "16:45",
    yoga: "Siddhi",
    yoga_end_time: "12:20",
    karan: "Bava",
    karan_end_time: "10:15",
    amanta_month: "Kartik",
    purnimanta_month: "Kartik",
    vikram_samvat: "2081",
    shaka_samvat: "1946"
  };

  const displayPanchang = panchang || fallbackPanchang;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Daily Panchang
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get detailed daily panchang information including tithi, nakshatra, yoga, karan, 
                sunrise, sunset, moonrise, moonset and more for any date.
              </p>
            </div>
          </div>
        </section>

        {/* Date Selector */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <label htmlFor="date-select" className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  id="date-select"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Panchang Details */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-32 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="text-red-600 text-xl mb-4">{error}</div>
                <button
                  onClick={fetchPanchang}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Aaj Ka Panchang</h2>
                  <p className="text-gray-600">New Delhi, India</p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedDate).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Sun and Moon Times */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <div className="text-orange-600 font-semibold mb-2">Sunrise</div>
                    <div className="text-2xl font-bold text-gray-800">{displayPanchang.sunrise}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <div className="text-orange-600 font-semibold mb-2">Sunset</div>
                    <div className="text-2xl font-bold text-gray-800">{displayPanchang.sunset}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-blue-600 font-semibold mb-2">Moonrise</div>
                    <div className="text-2xl font-bold text-gray-800">{displayPanchang.moonrise}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-blue-600 font-semibold mb-2">Moonset</div>
                    <div className="text-2xl font-bold text-gray-800">{displayPanchang.moonset}</div>
                  </div>
                </div>

                {/* Astrological Elements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Month Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amanta:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.amanta_month}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purnimanta:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.purnimanta_month}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Samvat</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vikram:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.vikram_samvat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shaka:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.shaka_samvat}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tithi and Nakshatra */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Tithi</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.tithi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Till:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.tithi_end_time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Nakshatra</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.nakshatra}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Till:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.nakshatra_end_time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Yoga and Karan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Yog</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.yoga}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Till:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.yoga_end_time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Karan</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.karan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Till:</span>
                        <span className="font-semibold text-gray-800">{displayPanchang.karan_end_time}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                  Need More Astrological Guidance?
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Get personalized astrological predictions and detailed analysis based on your birth chart. 
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
