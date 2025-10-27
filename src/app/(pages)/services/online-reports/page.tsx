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
              Online <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Astrology Reports</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get detailed written astrological analysis delivered instantly to your email. 
              Our comprehensive reports provide insights into all aspects of your life based on your birth chart.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">What's Included in Your Report</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Complete Birth Chart Analysis</h3>
            <p className="text-gray-600">Detailed interpretation of your planetary positions, aspects, and their influence on your life</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Career & Finance Predictions</h3>
            <p className="text-gray-600">Insights into your career prospects, financial stability, and best times for major decisions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Love & Relationships</h3>
            <p className="text-gray-600">Understanding your romantic prospects, compatibility, and relationship dynamics</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Health & Wellness</h3>
            <p className="text-gray-600">Health predictions and wellness recommendations based on your astrological profile</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4a1 1 0 001.134-1.6l-4.267-3.2 4.267-3.2a1 1 0 00-1.134-1.6l-5.334 4zM9.382 5.78A1 1 0 005 7.154V16.85a1 1 0 004.382.374l5.447-8.11-5.447-8.335z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Remedies & Solutions</h3>
            <p className="text-gray-600">Specific remedies, mantras, and gemstone recommendations to balance planetary influences</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Yearly Predictions</h3>
            <p className="text-gray-600">Month-by-month forecast and planetary periods affecting your life in the coming year</p>
          </div>
        </div>
      </div>

      {/* Astrologer Profile Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img src="/images/whatsapp/astrologer-1.jpg" alt="Dr. Arup Shastri" className="rounded-2xl shadow-lg w-full object-cover" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Dr. Arup Shastri</h2>
              <p className="text-gray-600 mb-4 text-lg">
                With over 20 years of experience in Vedic astrology, Dr. Arup Shastri has helped thousands of people discover their destiny through accurate and personalized astrological insights.
              </p>
              <p className="text-gray-600 mb-4 text-lg">
                His comprehensive reports combine traditional Vedic knowledge with modern analytical techniques to provide you with the most accurate predictions and practical guidance.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-3">✓</span> Doctorate in Vedic Astrology
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-3">✓</span> 50,000+ Satisfied Clients
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-3">✓</span> International Recognition
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg overflow-hidden">
                <img src="/Book Your Session.png" alt="Step 1: Book Your Session" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Book Your Session</h3>
              <p className="text-gray-600">Select your preferred date and provide your birth details for accurate analysis</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg overflow-hidden">
                <img src="/Consultation.png" alt="Step 2: Detailed Report Generation" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">2. Detailed Report Generation</h3>
              <p className="text-gray-600">Dr. Arup Shastri analyzes your chart and prepares a comprehensive report</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg overflow-hidden">
                <img src="/Get Guidance.png" alt="Step 3: Get Your Insights" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">3. Get Your Insights</h3>
              <p className="text-gray-600">Receive detailed predictions and actionable guidance via email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Basic Report</h3>
            <div className="text-4xl font-bold text-orange-600 mb-4">₹2,499</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Birth Chart Analysis</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Career Insights</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Remedies</li>
            </ul>
            <a href="/book-appointment" className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors block text-center">Order Now</a>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-500">
            <div className="text-orange-500 font-bold mb-4">MOST POPULAR</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Report</h3>
            <div className="text-4xl font-bold text-orange-600 mb-4">₹4,999</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Complete Birth Chart</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Career & Relationships</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Health & Wealth</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Yearly Forecast</li>
            </ul>
            <a href="/book-appointment" className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors block text-center">Order Now</a>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Complete Package</h3>
            <div className="text-4xl font-bold text-orange-600 mb-4">₹7,999</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Everything in Premium</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Gemstone Selection</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Personal Consultation</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Follow-up Support</li>
            </ul>
            <a href="/book-appointment" className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors block text-center">Order Now</a>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Get Your Detailed Astrology Report Today</h2>
          <p className="text-xl text-orange-100 mb-8">Receive comprehensive insights delivered within 48 hours</p>
          <a href="/book-appointment" className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all inline-block shadow-lg">
            Order Your Report
          </a>
        </div>
      </div>
    </div>
  );
}
