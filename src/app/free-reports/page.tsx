'use client';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';

export default function FreeReportsPage() {
  const freeReports = [
    {
      title: 'Free Horoscope',
      description: 'Get your detailed daily, weekly, and monthly horoscope predictions based on your zodiac sign.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      href: '/horoscope',
      color: 'from-purple-500 to-indigo-600',
      features: ['Daily Predictions', 'Weekly Overview', 'Monthly Forecast', 'Love & Career Insights']
    },
    {
      title: 'Free Kundli',
      description: 'Generate your complete birth chart with planetary positions, doshas, and detailed analysis.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/calculators/kundli',
      color: 'from-orange-500 to-red-600',
      features: ['Birth Chart', 'Planetary Positions', 'Dosha Analysis', 'Life Predictions']
    },
    {
      title: 'Free Marriage Matching',
      description: 'Check compatibility between partners using traditional Ashtakoot matching system.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      href: '/calculators/horoscope-matching',
      color: 'from-pink-500 to-rose-600',
      features: ['Ashtakoot Matching', 'Compatibility Score', 'Detailed Analysis', 'Remedies']
    },
    {
      title: 'Free Career Horoscope',
      description: 'Discover your career potential and favorable periods for professional growth.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      href: '/predictions/career',
      color: 'from-blue-500 to-indigo-600',
      features: ['Career Analysis', 'Job Prospects', 'Business Opportunities', 'Success Periods']
    },
    {
      title: 'Free Numerology',
      description: 'Explore the power of numbers in your life with comprehensive numerology analysis.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      href: '/calculators/numerology',
      color: 'from-green-500 to-emerald-600',
      features: ['Life Path Number', 'Lucky Numbers', 'Personality Traits', 'Future Predictions']
    },
    {
      title: 'Free Love Matching',
      description: 'Check romantic compatibility and understand your relationship dynamics.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      href: '/matching/love',
      color: 'from-red-500 to-pink-600',
      features: ['Love Compatibility', 'Relationship Insights', 'Romantic Forecast', 'Bonding Analysis']
    },
    {
      title: 'Free Wealth Horoscope',
      description: 'Understand your financial prospects and wealth accumulation potential.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      href: '/predictions/wealth',
      color: 'from-yellow-500 to-orange-600',
      features: ['Financial Analysis', 'Investment Guidance', 'Wealth Periods', 'Money Flow']
    },
    {
      title: 'Free Panchang',
      description: 'Get daily panchang with auspicious timings, festivals, and muhurat details.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/panchang',
      color: 'from-teal-500 to-cyan-600',
      features: ['Daily Panchang', 'Muhurat Timings', 'Festival Dates', 'Rahu Kaal']
    }
  ];

  const quickCalculators = [
    {
      title: 'Moon Sign Calculator',
      description: 'Find your moon sign instantly',
      href: '/calculators/moon-sign',
      icon: '🌙'
    },
    {
      title: 'Ascendant Calculator',
      description: 'Calculate your rising sign',
      href: '/calculators/ascendant',
      icon: '⬆️'
    },
    {
      title: 'Dosha Calculator',
      description: 'Check for doshas in your chart',
      href: '/calculators/dosha',
      icon: '🔍'
    },
    {
      title: 'Gemstone Recommendation',
      description: 'Find your lucky gemstone',
      href: '/calculators/gemstone',
      icon: '💎'
    },
    {
      title: 'Rudraksha Recommendation',
      description: 'Get personalized rudraksha guidance',
      href: '/calculators/rudraksha',
      icon: '📿'
    },
    {
      title: 'Lucky Number Calculator',
      description: 'Discover your lucky numbers',
      href: '/calculators/lucky-number',
      icon: '🍀'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Free Astrology Reports
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Access comprehensive astrology reports absolutely free. Get insights into your personality, 
              relationships, career, and future with our authentic Vedic astrology calculations.
            </p>
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🎉 Special Offer</h3>
              <p className="text-lg text-gray-600">
                Get your first premium report absolutely FREE when you sign up today!
              </p>
              <Link 
                href="/register"
                className="inline-block mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300"
              >
                Sign Up for Free Reports
              </Link>
            </div>
          </div>
        </section>

        {/* Free Reports Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
              Comprehensive Free Reports
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {freeReports.map((report, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <div className={`bg-gradient-to-r ${report.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                        {report.icon}
                      </div>
                      <span className="text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        FREE
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{report.title}</h3>
                    <p className="text-white text-opacity-90 text-sm">
                      {report.description}
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {report.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link
                      href={report.href}
                      className={`w-full bg-gradient-to-r ${report.color} text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center block group-hover:scale-105`}
                    >
                      Get Free Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Calculators */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
              Quick Astrology Calculators
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickCalculators.map((calc, index) => (
                <Link
                  key={index}
                  href={calc.href}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 group hover:scale-105"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{calc.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {calc.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{calc.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-orange-600 font-semibold text-sm">Calculate Now →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Free Reports */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Why Choose Our Free Reports?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our free astrology reports are based on authentic Vedic astrology principles 
                and provide accurate, personalized insights.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: '✨',
                  title: 'Authentic Calculations',
                  description: 'Based on traditional Vedic astrology methods'
                },
                {
                  icon: '🎯',
                  title: 'Personalized Insights',
                  description: 'Tailored predictions based on your birth details'
                },
                {
                  icon: '🔒',
                  title: 'Privacy Protected',
                  description: 'Your personal information is completely secure'
                },
                {
                  icon: '📱',
                  title: 'Instant Access',
                  description: 'Get your reports immediately after calculation'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Discover Your Destiny?
            </h2>
            <p className="text-xl text-white text-opacity-90 mb-8">
              Start with our free reports and unlock the secrets of your future. 
              Join thousands of satisfied users who trust our astrology services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/horoscope"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-colors text-lg"
              >
                View Sample Report
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
