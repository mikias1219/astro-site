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

        {/* Comprehensive Astrology Content */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Best Astrology Consultation – Personalized Guidance
              </h2>
              
              <div className="text-gray-700 leading-relaxed space-y-6">
                <p className="text-xl font-semibold text-gray-800 mb-6">
                  Top Famous Astrologers Consultation
                </p>
                
                <p>
                  The field of astrology has been captivating human beings over centuries, enabling them to lead their lives, professions, and relationships. The modern world with its hectic status has made astrology even more relevant with the personal consultation with professional astrologers. A lot of individuals are interested in consultancy in order to know about their birth signs and their planetary placements, to make good judgments in their future. Dr. Arup Adhikary is one of the most credible and accurate astrologers whose face is the most famous in this field and who was rather well-educated and provided good advice to thousands of people.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Which is the Most Accurate Form of Astrology?
                </h3>
                
                <p>
                  Astrology practiced in various cultures varies into many types Vedic, western, Chinese etc. The issue of what shape is the best is relative to the belief system, culture, and purpose. Nonetheless, Vedic Astrology can be considered one of the most accurate systems because of its use of mathematical methods and based on the location of the planets at the very moment of birth.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Types of Astrology and Their Accuracy
                </h4>
                
                <p>There are several different forms of astrology, each of which is more or less accurate:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Vedic Astrology (Jyotish):</strong> It is founded on Indian tradition and is focused on karma and fate. It is very precise when it comes to consulting regarding finances, career and marriage.</li>
                  <li><strong>Western Astrology:</strong> It is pegged on the tropical zodiac and it dwells on psychological traits and spiritual growth.</li>
                  <li><strong>Chinese Astrology:</strong> Destiny and personality depends on animal signs and year of birth.</li>
                  <li><strong>Mayan and Celtic Astrology:</strong> The rare but very useful school of thought based on the ancient calendars and signs of nature.</li>
                </ul>
                
                <p>The accuracy usually relies on the depth of the interpretation of the astrologer of the birth chart and the accuracy of the birth data.</p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Is Astrology 100% Accurate?
                </h3>
                
                <p>
                  Astrology is an art and science that comprises intuition. Even though a hundred percent accuracy can not be said about any of the varieties of astrology, it does provide deep insights into the patterns of life and what could happen in life. Astrologers comprehend the cosmic energies and free will plays a role in the formation of our destiny. An effective consultation will allow you to perceive your inclinations, possibilities and disadvantages and not foresee predetermined things.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Reliability of Astrology Predictions
                </h4>
                
                <p>
                  The accuracy of astrology is determined by a number of factors including the proficiency of the astrologer, the precision of your birth information as well as the astrological system selected. Dr. Arup Adhikary is regarded as a reliable person in giving predictions based on a combination of Vedic and modern strategies such that every consultation offers realistic and precise advice.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Factors Affecting Accuracy
                </h4>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Precision of the Birth Time:</strong> Change of planetary positions can occur in a few minutes.</li>
                  <li><strong>Practice of the Astrologer:</strong> talented astrologers read the signs between the lines of the chart more effectively.</li>
                  <li><strong>Procedure:</strong> Vedic and Nadi astrology have been known to be more accurate in predictive insights.</li>
                  <li><strong>Free Will:</strong> Human behavior is able to alter the desired perception.</li>
                  <li><strong>Planetary Transits:</strong> These affect time and scale of life incidences.</li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Are Zodiac Signs 100% Accurate?
                </h3>
                
                <p>
                  Zodiac signs are a simplified method of personality traits that do not predetermine your destiny only. When a lot of individuals associate themselves with the sun sign traits, this only constitutes a small part of the whole astrological image.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Zodiac Signs and Their Influence
                </h4>
                
                <p>
                  Every zodiac sign determines our character and relationships. Aries, Taurus and Pisces are ambitious, earthly, and intuitive (but not all of these characteristics are universal). To get more information a professional consultation will help you relate your zodiac traits to your moon and rising signs.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Moon and Sun Sign Effects
                </h4>
                
                <p>
                  The Sun sign represents your external personality whereas the Moon sign is a representation of emotions and instincts. They both are crucial to defining the way you respond to life difficulties. The knowledge of these through astrology consultation can enable you to work to your advantage and suppress your shortcomings.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Limitations of Zodiac Predictions
                </h4>
                
                <p>
                  Zodiac readings are general. They are not able to reflect the complexity of an individual chart. Predictions could not be accurate without taking into account the place and time of birth. Therefore, professional advice is important in seeking personalized advice as opposed to using sun sign horoscopes.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  What is the Best Accurate Astrology Site?
                </h3>
                
                <p>
                  Astrology has been digitized in the online era. There are numerous platforms with free, as well as paid readings. The most preferred astrology site is that which has a combination of authenticity, professional astrologers, and privacy in consultation.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Free vs Paid Predictions
                </h4>
                
                <p>
                  Free websites give the general understanding, whereas the paid consultations will offer the personal interpretation. Although free readings may be entertaining, professional astrologers, such as Dr. Arup Adhikary, offers a deeper analysis of the charts, tailored remedies and life advice, which is not possible with free tools.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Personal Consultation
                </h3>
                
                <p>
                  Astrology consultation is a personalized session that proves useful with individuals finding patterns, challenges, and opportunities in life. It is not just forecasting but helps in self-understanding, decision making and spiritual development.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Personal Consultant Choices
                </h4>
                
                <p>Astrology advice can be received personally in a number of ways:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal meetings:</strong> The best meetings to be held in case of sensitive and confidential matters.</li>
                  <li><strong>Consultations online:</strong> Anywhere, convenient.</li>
                  <li><strong>Phone or video sessions:</strong> Can be made flexible to busy people.</li>
                </ul>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Personalized Consulting Tips
                </h4>
                
                <p>
                  When you book an astrology appointment, you will always have to possess your details of birth (date, time, place). Show open-mindedness and be able to ask questions. The more correct your information the more precise your readings will be.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Personal Consulting for Best Prediction
                </h4>
                
                <p>
                  To make the best predictions, select a well known astrologer such as Dr. Arup Adhikary, who customizes each consultation to your individual chart. His holism incorporates modern ideas with ancient Vedic astrology, and with him you can get spiritual as well as practical guidance.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Personal Branding Consultant
                </h3>
                
                <p>Astrology is also a huge contributor towards personal branding and career development.</p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  How Astrology Helps Personal Branding
                </h4>
                
                <p>
                  A birth chart will provide you with your strengths and preferred career line of work along with your communication style which is very crucial in personal branding. In an astrology reading, the professionals observe your ascendant, the 10th house (career), and your location of Mercury and advise you on how to project the best professional image.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Integrating Astrology into Career Decisions
                </h4>
                
                <p>
                  Knowing your planetary influences, you will be able to schedule career moves with good times. Consulting early enough means that the significant decisions made in life, including changing jobs or starting a business enterprise, are made during an opportune time and thus in tandem with positive planetary movements, which enhances success.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Best Astrologer Online Consultation
                </h3>
                
                <p>
                  The Internet astrology has helped to connect with professional astrologers across the globe. Clients are now able to access guidance at any time due to secure platforms, and instant communication.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  How Online Consultations Work
                </h4>
                
                <p>
                  The online consultations tend to occur as a video call, chat, or email. Once you have entered your birth details, the astrologer makes your chart and talks to you live. This approach is time-saving and it allows astrology across the world. An example here would be Dr. Arup Adhikary which is offering both national and international online sessions and is giving a clear picture and a personal remedy to clients all over the globe.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Best Astrologer in India for Consultation
                </h3>
                
                <p>
                  India has had a number of talented astrologers who are deep spiritual and analytical. One of them is Dr. Arup Adhikary, reputed to be among the most reputable in terms of astrology consultation. He adheres to the systematic arguments. But apply them to ancient knowledge.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  How to Choose the Right Astrologer
                </h4>
                
                <p>
                  Perceptions of the clients in choosing an astrologer to do business with. An excellent astrologer must listen and read your chart correctly, and come up with constructive solutions instead of predictions out of fear.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Tips for Effective Consultation
                </h4>
                
                <p>Guidelines to a Good Consultation:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be on time and be truthful regarding your life state.</li>
                  <li>Make your questions narrow and focused.</li>
                  <li>Never think of miracles; astrology rules rather than commands.</li>
                  <li>Record important tips and solutions that have been proposed in the session.</li>
                  <li>A follow up to gain more insights is necessary.</li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Top Accurate Astrology Predictions Expertise
                </h3>
                
                <p>
                  The precision of astrology relies on the skill of the astrologer and his interpretation ability. Top astronomers devote years in learning planetary combinations and transits.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  How to Access Free Predictions
                </h4>
                
                <p>
                  A variety of astrology websites offer weekly or monthly free predictions. They are generic, although useful. Personalised knowledge requires professional advice - it gives specialists such as Dr. Arup Adhikary an opportunity to read your birth chart relying on real planetary positions.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Understanding Accuracy Metrics
                </h4>
                
                <p>
                  Astrology does not offer to be conclusive. Rather, it gauges the possibilities and the time. Dashas (planetary periods) and transits are methods used by expert astrologers in order to estimate probabilities. Accuracy of prediction is dependent on accuracy of data and the ability of the astrologer.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  A Person Who Rules Without Consulting the Opinion of Others
                </h3>
                
                <p>
                  An individual who does not consult anyone can seem to be independent, but he or she may make uninformed decisions. In astrology, as in any other field, consultation can provide point of view and wisdom. Even great leaders tend to consult astrologers to determine the right time to venture big projects- this goes to show that great decision making is a process that requires one to listen and learn.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Who is the Most Famous Astrologer?
                </h3>
                
                <p>
                  There are numerous great astrologers that have influenced people throughout the world because of the predictions they made. Astrology is highly held by the Indians, with a number of their practitioners being internationally acclaimed.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Top Astrologers in India
                </h4>
                
                <p>
                  India is the country that hosts some of the most outstanding brains in astrology, such as Dr. Arup Adhikary whose precision and insight with consultation are outstanding. His knowledge on the art of predicting astrology, numerology, and vastu shastra has helped numerous individuals to pass all the challenges and ensure that they make decisions in their lives.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Global Recognition and Influence
                </h4>
                
                <p>
                  Well known astrologers usually become world famous through correct predictions, books and media exposure. Foreigners are using Indian astrologers in large numbers, as they value the richness of Vedic astrology and its practical use.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Impact of Famous Predictions
                </h4>
                
                <p>
                  The strength of forecasting trends via the use of astrology has been proven in historic prediction, such as political changes and marriages among celebrities. Astrology has the potential to be a light in the dark when supported by professional conduct and best prediction.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Do Mukesh Ambani Believe in Astrology?
                </h3>
                
                <p>
                  The business magnates in India are mostly linked to astrology. Although it keeps personal convictions to itself, it is a well-known fact that most businesspersons such as Mukesh Ambani consult astrologers prior to any big venture or investment.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Astrology Beliefs of Celebrities
                </h4>
                
                <p>
                  The celebrities in the world rely on astrology in making decisions and scheduling other important happenings. Actors in Bollywood, industrialists, and so forth are not the exception, and they use astrological consultation to make sure that planets are on their side when launching an important project or alliance.
                </p>

                <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  Influence on Business Decisions
                </h4>
                
                <p>
                  In strategic planning, astrology is very important. Business owners book openings, contracts and investments according to favorable planetary positions. The consultants of experts are also beneficial, to minimize the risks, and increase the probability of successes - that is why astrology is still closely connected with the Indian business culture.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  Conclusion
                </h3>
                
                <p>
                  Astrology is an ancient science that connects the cosmic power with the fate of man. A personal consultation gives clarity and direction whether you need some advice on relationships, career or business. In India and across the world, other great astrologers such as Dr. Arup Adhikary still strive to make people go through the uncertainties of life with wisdom, compassion and accuracy.
                </p>
                
                <p>
                  Zodiac interpretations to career counseling zodiac, astrology is not about rule making fate, it is rather about knowing who you are and making empowered decisions. The appropriate advice can make the difference between being confused and knowing what to do, to live with a sense of purpose and confidence.
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
