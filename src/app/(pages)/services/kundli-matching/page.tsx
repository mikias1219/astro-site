'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function KundliMatchingPage() {
  const [formData, setFormData] = useState({
    boyName: '',
    boyBirthDate: '',
    boyBirthTime: '',
    boyBirthPlace: '',
    girlName: '',
    girlBirthDate: '',
    girlBirthTime: '',
    girlBirthPlace: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Kundli matching service will be available soon. Please contact us for personal consultation.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Kundli Matching for Marriage
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover compatibility and harmony in marriage through traditional Vedic astrology.
            Our comprehensive Kundli matching service ensures a blissful and prosperous married life.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Service Description */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Kundli Matching Matters</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💕</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Compatibility Analysis</h3>
                  <p className="text-gray-600">Detailed analysis of 36 points (Guna Milan) to determine marriage compatibility</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔮</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Dosha Detection</h3>
                  <p className="text-gray-600">Identification and remedies for Manglik Dosha, Kaal Sarp Dosha, and other astrological imbalances</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Reports</h3>
                  <p className="text-gray-600">Comprehensive reports with remedies, gemstone recommendations, and mantras</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Future Predictions</h3>
                  <p className="text-gray-600">Insights into married life, children, career, and overall prosperity</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Service Pricing</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">₹1,500</div>
                <p className="text-gray-600">Complete Kundli Matching Report</p>
                <p className="text-sm text-gray-500 mt-2">Includes consultation and remedies</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Get Your Kundli Matched</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Boy's Details */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Boy's Birth Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="boyName"
                      value={formData.boyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                    <input
                      type="date"
                      name="boyBirthDate"
                      value={formData.boyBirthDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Time</label>
                    <input
                      type="time"
                      name="boyBirthTime"
                      value={formData.boyBirthTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place</label>
                    <input
                      type="text"
                      name="boyBirthPlace"
                      value={formData.boyBirthPlace}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State, Country"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Girl's Details */}
              <div className="bg-pink-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-pink-800 mb-4">Girl's Birth Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="girlName"
                      value={formData.girlName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                    <input
                      type="date"
                      name="girlBirthDate"
                      value={formData.girlBirthDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Time</label>
                    <input
                      type="time"
                      name="girlBirthTime"
                      value={formData.girlBirthTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place</label>
                    <input
                      type="text"
                      name="girlBirthPlace"
                      value={formData.girlBirthPlace}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="City, State, Country"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Kundli Matching Report
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Prefer personal consultation?{' '}
                <Link href="/book-appointment" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Book appointment now
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">What You Get in the Report</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">36 Guna Matching</h3>
              <p className="text-gray-600">Detailed analysis of all 36 compatibility points</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔮</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Manglik Dosha Check</h3>
              <p className="text-gray-600">Complete Manglik analysis and remedies</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Gemstone Recommendations</h3>
              <p className="text-gray-600">Personalized gemstones for harmony</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Marriage Timing</h3>
              <p className="text-gray-600">Auspicious dates for marriage ceremony</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🙏</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Remedial Measures</h3>
              <p className="text-gray-600">Mantras, pujas, and rituals for harmony</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Future Predictions</h3>
              <p className="text-gray-600">Life predictions after marriage</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let Vedic astrology guide you to a harmonious and prosperous married life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book-appointment"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Personal Consultation
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
