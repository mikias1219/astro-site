export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Banner Background */}
      <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20 relative">
        <div className="absolute inset-0 opacity-20">
          <img src="/consultation we banner.png" alt="Banner" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Personal <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Voice Reports</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Receive personalized audio consultation directly from Dr. Arup Shastri. 
              Get detailed astrology analysis and guidance in a voice format that's easy to understand and reference.
            </p>
          </div>
        </div>
      </div>

      {/* Astrologer Profile Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img src="/images/whatsapp/astrologer-2.jpg" alt="Dr. Arup Shastri" className="rounded-2xl shadow-lg w-full object-cover" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Dr. Arup Shastri</h2>
              <p className="text-gray-600 mb-4 text-lg">
                Experience personalized astrological guidance directly from Dr. Arup Shastri through our voice consultation service. His warm and insightful approach makes complex astrological concepts easy to understand.
              </p>
              <p className="text-gray-600 mb-4 text-lg">
                With decades of expertise, Dr. Arup Shastri delivers personalized voice reports that provide comprehensive analysis and actionable guidance tailored to your unique birth chart.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-3">✓</span> Direct Expert Consultation
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-3">✓</span> Personalized Voice Reports
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-3">✓</span> Easy to Reference & Share
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Voice Reports */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Why Choose Voice Reports?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="flex items-start mb-4">
              <svg className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Direct from Expert</h3>
                <p className="text-gray-600">Listen to personalized insights directly from Dr. Arup Shastri himself</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="flex items-start mb-4">
              <svg className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Explanations</h3>
                <p className="text-gray-600">Better understand complex astrological concepts through audio explanations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="flex items-start mb-4">
              <svg className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Accessible Format</h3>
                <p className="text-gray-600">Listen anytime, anywhere - perfect for busy schedules</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="flex items-start mb-4">
              <svg className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Touch</h3>
                <p className="text-gray-600">Receive guidance tailored specifically to your unique birth chart</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">What Your Voice Report Includes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Birth Chart Overview</h3>
              <p className="text-gray-600 text-sm">Complete analysis of your planetary positions and their meanings</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4m0 2a2 2 0 11-4 0m4 0a2 2 0 01-4 0m-5 6h2.945m2.735-2.735h-5.39" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Life Predictions</h3>
              <p className="text-gray-600 text-sm">Insights into career, relationships, finances, and health</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Remedial Measures</h3>
              <p className="text-gray-600 text-sm">Specific mantras, gemstones, and practices for balance</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Yearly Forecast</h3>
              <p className="text-gray-600 text-sm">Monthly predictions and auspicious timings</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Guidance</h3>
              <p className="text-gray-600 text-sm">Actionable advice tailored to your unique situation</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Simple Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full shadow-lg overflow-hidden">
                <img src="/Book Your Session.png" alt="Step 1: Book Your Session" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Book Your Session</h3>
              <p className="text-gray-600">Share your birth details and schedule your voice report recording date</p>
            </div>

            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full shadow-lg overflow-hidden">
                <img src="/Consultation.png" alt="Step 2: Personalized Recording" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">2. Personalized Recording</h3>
              <p className="text-gray-600">Dr. Arup Shastri records a detailed voice report specifically for you</p>
            </div>

            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full shadow-lg overflow-hidden">
                <img src="/Get Guidance.png" alt="Step 3: Receive Your Audio" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">3. Receive Your Audio</h3>
              <p className="text-gray-600">Get your voice report delivered within 3 business days via email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Affordable Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">30-Minute Report</h3>
              <div className="text-4xl font-bold text-orange-600 mb-4">₹3,999</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Birth Chart Analysis</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Life Overview</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Basic Remedies</li>
              </ul>
              <a href="/book-appointment" className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors block text-center">Book Now</a>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-500">
              <div className="text-orange-500 font-bold mb-4">RECOMMENDED</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">60-Minute Report</h3>
              <div className="text-4xl font-bold text-orange-600 mb-4">₹6,999</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Complete Birth Chart</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> All Life Aspects</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Yearly Predictions</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Detailed Remedies</li>
              </ul>
              <a href="/book-appointment" className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors block text-center">Book Now</a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Get Your Personalized Voice Report</h2>
          <p className="text-xl text-orange-100 mb-8">Listen to expert guidance crafted just for you</p>
          <a href="/book-appointment" className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all inline-block shadow-lg">
            Book Your Voice Report
          </a>
        </div>
      </div>
    </div>
  );
}
