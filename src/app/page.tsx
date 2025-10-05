import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Podcasts } from '@/components/Podcasts';
import { Blogs } from '@/components/Blogs';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Quick Free Reports Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Get Your FREE Horoscope in 30 Seconds
              </h2>
              <p className="text-xl text-gray-600">
                Discover your destiny with our authentic Vedic astrology predictions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Free Horoscope',
                  description: 'Daily, weekly & monthly predictions',
                  href: '/horoscope',
                  icon: '⭐',
                  color: 'from-purple-500 to-indigo-600'
                },
                {
                  title: 'Free Kundli',
                  description: 'Complete birth chart analysis',
                  href: '/calculators/kundli',
                  icon: '📊',
                  color: 'from-orange-500 to-red-600'
                },
                {
                  title: 'Marriage Matching',
                  description: 'Compatibility analysis',
                  href: '/calculators/horoscope-matching',
                  icon: '💕',
                  color: 'from-pink-500 to-rose-600'
                },
                {
                  title: 'Numerology',
                  description: 'Lucky numbers & predictions',
                  href: '/calculators/numerology',
                  icon: '🔢',
                  color: 'from-green-500 to-emerald-600'
                }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className={`bg-gradient-to-r ${item.color} p-6 text-white text-center`}>
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white text-opacity-90 text-sm">{item.description}</p>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm font-semibold text-orange-600 group-hover:text-orange-700">
                      Get FREE Report →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                href="/free-reports"
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
              >
                View All Free Reports
              </Link>
            </div>
          </div>
        </section>

        {/* Daily Horoscope Preview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Check Your Daily Horoscope
              </h2>
              <p className="text-xl text-gray-600">
                Select your zodiac sign for today's predictions
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { sign: 'Aries', dates: '21 Mar - 20 Apr', symbol: '♈' },
                { sign: 'Taurus', dates: '21 Apr - 21 May', symbol: '♉' },
                { sign: 'Gemini', dates: '22 May - 21 Jun', symbol: '♊' },
                { sign: 'Cancer', dates: '22 Jun - 22 Jul', symbol: '♋' },
                { sign: 'Leo', dates: '23 Jul - 23 Aug', symbol: '♌' },
                { sign: 'Virgo', dates: '24 Aug - 22 Sep', symbol: '♍' },
                { sign: 'Libra', dates: '23 Sep - 23 Oct', symbol: '♎' },
                { sign: 'Scorpio', dates: '24 Oct - 22 Nov', symbol: '♏' },
                { sign: 'Sagittarius', dates: '23 Nov - 21 Dec', symbol: '♐' },
                { sign: 'Capricorn', dates: '22 Dec - 20 Jan', symbol: '♑' },
                { sign: 'Aquarius', dates: '21 Jan - 18 Feb', symbol: '♒' },
                { sign: 'Pisces', dates: '19 Feb - 20 Mar', symbol: '♓' }
              ].map((zodiac, index) => (
                <Link
                  key={index}
                  href={`/horoscope?sign=${zodiac.sign.toLowerCase()}`}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-2">{zodiac.symbol}</div>
                  <h3 className="font-bold text-gray-800 text-sm">{zodiac.sign}</h3>
                  <p className="text-xs text-gray-600">{zodiac.dates}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Services />

        {/* Premium Offers Section */}
        <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Premium Horoscope Offers
              </h2>
              <p className="text-xl text-gray-600">
                Get detailed insights with our premium astrology reports
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: '2025 Horoscope',
                  description: 'Complete year predictions for 2025',
                  price: '$29.99',
                  originalPrice: '$49.99',
                  features: ['Yearly Overview', 'Monthly Predictions', 'Career Guidance', 'Relationship Insights'],
                  color: 'from-purple-500 to-indigo-600',
                  badge: 'NEW'
                },
                {
                  title: "Couple's Horoscope",
                  description: 'Comprehensive relationship analysis',
                  price: '$24.99',
                  originalPrice: '$39.99',
                  features: ['Compatibility Score', 'Relationship Timeline', 'Marriage Predictions', 'Remedies'],
                  color: 'from-pink-500 to-rose-600',
                  badge: 'POPULAR'
                },
                {
                  title: 'In-Depth Horoscope',
                  description: 'Detailed life analysis and predictions',
                  price: '$34.99',
                  originalPrice: '$59.99',
                  features: ['Complete Life Analysis', 'Career & Finance', 'Health Predictions', 'Remedial Measures'],
                  color: 'from-orange-500 to-red-600',
                  badge: 'BESTSELLER'
                }
              ].map((offer, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className={`bg-gradient-to-r ${offer.color} p-6 text-white relative`}>
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        {offer.badge}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-white text-opacity-90 mb-4">{offer.description}</p>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold">{offer.price}</span>
                      <span className="text-lg line-through text-white text-opacity-70 ml-2">{offer.originalPrice}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      {offer.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className={`w-full bg-gradient-to-r ${offer.color} text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}>
                      Get Premium Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Podcasts />

        <Blogs />

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600">
                Thousands of satisfied customers trust our astrology services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Priya Sharma',
                  rating: 5,
                  comment: 'The kundli analysis was incredibly accurate. It helped me understand my life path better.',
                  service: 'Free Kundli'
                },
                {
                  name: 'Rajesh Kumar',
                  rating: 5,
                  comment: 'Marriage matching report was detailed and helped us make the right decision.',
                  service: 'Marriage Matching'
                },
                {
                  name: 'Anita Patel',
                  rating: 5,
                  comment: 'Daily horoscope predictions are very accurate. I check them every morning.',
                  service: 'Daily Horoscope'
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">"{testimonial.comment}"</p>
                  <p className="text-sm text-orange-600 font-semibold">- {testimonial.service}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
