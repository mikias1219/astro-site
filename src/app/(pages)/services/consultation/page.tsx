import { Header } from '../../../../components/Header';
import { Footer } from '../../../../components/Footer';
import Link from 'next/link';

export default function ConsultationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Banner */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20 relative overflow-hidden">
          {/* Banner in top-left corner */}
          <div className="absolute top-0 left-0 w-48 h-48 opacity-20 pointer-events-none">
            <img src="/consultation we banner.png" alt="Banner" className="w-full h-full object-cover" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Personal Consultation
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get personalized astrological guidance from Dr. Arup Shastri. 
                One-on-one consultation for accurate predictions and remedies.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Why Choose Personal Consultation?
                </h2>
                <ul className="space-y-4 text-lg text-gray-700">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-3">✓</span>
                    Detailed analysis of your birth chart
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-3">✓</span>
                    Personalized predictions and remedies
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-3">✓</span>
                    Direct interaction with experienced astrologer
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-3">✓</span>
                    Comprehensive life guidance
                  </li>
                </ul>
              </div>
              
              <div className="relative">
                <img 
                  src="/images/whatsapp/consultation-1.jpg" 
                  alt="Personal Consultation" 
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple process to get your personalized astrological consultation
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

        {/* Services Offered */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Consultation Services
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Marriage & Relationships</h3>
                <p className="text-gray-600 mb-4">
                  Compatibility analysis, marriage timing, relationship guidance, and love predictions.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Kundli matching</li>
                  <li>• Marriage timing</li>
                  <li>• Relationship compatibility</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Career & Business</h3>
                <p className="text-gray-600 mb-4">
                  Career guidance, business timing, job changes, and professional success predictions.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Career timing</li>
                  <li>• Business opportunities</li>
                  <li>• Job change guidance</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Health & Wellness</h3>
                <p className="text-gray-600 mb-4">
                  Health predictions, remedies for ailments, and wellness guidance based on astrology.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Health predictions</li>
                  <li>• Disease remedies</li>
                  <li>• Wellness guidance</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Finance & Wealth</h3>
                <p className="text-gray-600 mb-4">
                  Financial predictions, investment timing, and wealth accumulation guidance.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Financial timing</li>
                  <li>• Investment guidance</li>
                  <li>• Wealth remedies</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Education & Learning</h3>
                <p className="text-gray-600 mb-4">
                  Educational guidance, exam timing, and learning success predictions.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Exam timing</li>
                  <li>• Study guidance</li>
                  <li>• Educational remedies</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Spiritual Growth</h3>
                <p className="text-gray-600 mb-4">
                  Spiritual guidance, meditation practices, and inner peace recommendations.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Spiritual practices</li>
                  <li>• Meditation guidance</li>
                  <li>• Inner peace remedies</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Consultation Pricing
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border-2 border-orange-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Basic Consultation</h3>
                <div className="text-4xl font-bold text-orange-600 mb-4">₹1,500</div>
                <p className="text-gray-600 mb-6">60-minute detailed consultation</p>
                <ul className="text-left text-gray-700 space-y-2 mb-8">
                  <li>✓ Birth chart analysis</li>
                  <li>✓ Basic predictions</li>
                  <li>✓ General remedies</li>
                  <li>✓ Q&A session</li>
                </ul>
                <Link 
                  href="/book-appointment" 
                  className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
                >
                  Book Now
                </Link>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl border-2 border-red-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Consultation</h3>
                <div className="text-4xl font-bold text-red-600 mb-4">₹2,500</div>
                <p className="text-gray-600 mb-6">90-minute comprehensive consultation</p>
                <ul className="text-left text-gray-700 space-y-2 mb-8">
                  <li>✓ Detailed birth chart analysis</li>
                  <li>✓ Comprehensive predictions</li>
                  <li>✓ Personalized remedies</li>
                  <li>✓ Follow-up support</li>
                  <li>✓ Written report</li>
                </ul>
                <Link 
                  href="/book-appointment" 
                  className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors inline-block"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                What Our Clients Say
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  <img 
                    src="/images/whatsapp/testimonials-1.jpg" 
                    alt="Client" 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">Priya Sharma</h4>
                    <p className="text-gray-600">Mumbai</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Dr. Arup Shastri's consultation helped me understand my career path. 
                  His predictions were accurate and his guidance was invaluable."
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  <img 
                    src="/images/whatsapp/testimonials-2.jpg" 
                    alt="Client" 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">Rajesh Kumar</h4>
                    <p className="text-gray-600">Delhi</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "The marriage compatibility analysis was spot on. 
                  We followed his advice and our relationship has been blessed."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready for Your Personal Consultation?
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              Book your session with Dr. Arup Shastri and get personalized astrological guidance
            </p>
            <Link 
              href="/book-appointment" 
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
            >
              Book Your Consultation Now
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
