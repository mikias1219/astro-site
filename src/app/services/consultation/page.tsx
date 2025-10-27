import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

export default function ConsultationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Personal Consultation
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get personalized astrological guidance through one-on-one consultation 
                with Dr. Arup Shastri. Discover your destiny and navigate life's challenges.
              </p>
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                  Comprehensive Life Analysis
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    Our personal consultation service provides you with a deep, comprehensive analysis 
                    of your birth chart and life path. Dr. Arup Shastri will examine all aspects of 
                    your astrological profile to provide accurate predictions and practical guidance.
                  </p>
                  <p>
                    During the consultation, we'll cover your career prospects, relationship dynamics, 
                    health predictions, financial outlook, and spiritual growth. You'll receive 
                    personalized remedies and solutions tailored to your specific planetary positions.
                  </p>
                  <p>
                    This is not just a prediction session - it's a transformative experience that 
                    empowers you to make informed decisions and align with your cosmic blueprint.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Consultation Includes</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Complete birth chart analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Career and financial guidance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Relationship and marriage insights</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Health predictions and remedies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Spiritual growth guidance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Personalized remedies and solutions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple steps to get your personalized astrological consultation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg overflow-hidden">
                  <img src="/Book Your Session.png" alt="Step 1: Book Your Session" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Book Your Session</h3>
                <p className="text-gray-600">
                  Choose your preferred date and time. Provide your birth details for accurate analysis.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg overflow-hidden">
                  <img src="/Consultation.png" alt="Step 2: Consultation" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Consultation</h3>
                <p className="text-gray-600">
                  Meet with Dr. Arup Shastri for a comprehensive 60-minute consultation session.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg overflow-hidden">
                  <img src="/Get Guidance.png" alt="Step 3: Get Guidance" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Get Guidance</h3>
                <p className="text-gray-600">
                  Receive detailed predictions, remedies, and actionable guidance for your life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Consultation Pricing
              </h2>
              <p className="text-lg text-gray-600">
                Choose the consultation type that best fits your needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Standard Consultation</h3>
                <div className="text-3xl font-bold text-orange-600 mb-6">₹2,500</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>60-minute consultation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete birth chart analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All life aspects covered</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Personalized remedies</span>
                  </li>
                </ul>
                <a
                  href="/book-appointment"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 text-center block"
                >
                  Book Now
                </a>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border-2 border-orange-200">
                <div className="text-center mb-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Consultation</h3>
                <div className="text-3xl font-bold text-orange-600 mb-6">₹3,500</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>90-minute consultation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Everything in Standard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Written report included</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day follow-up support</span>
                  </li>
                </ul>
                <a
                  href="/book-appointment"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 text-center block"
                >
                  Book Premium
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to Discover Your Destiny?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Book your personal consultation with Dr. Arup Shastri and get expert 
                astrological guidance to navigate life's challenges and opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/book-appointment"
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Book Consultation Now
                </a>
                <a
                  href="/contact"
                  className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  Have Questions?
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
