'use client';

import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HoroscopePreview } from '@/components/HoroscopePreview';
import { Services } from '@/components/Services';
import { Podcasts } from '@/components/Podcasts';
import { Blogs } from '@/components/Blogs';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface FreeReport {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

const freeReports: FreeReport[] = [
  {
    id: 'horoscope',
    title: 'Free Horoscope',
    description: 'Daily, weekly & monthly predictions',
    href: '/horoscope',
    icon: '⭐',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'kundli',
    title: 'Free Kundli',
    description: 'Complete birth chart analysis',
    href: '/calculators/kundli',
    icon: '📊',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'matching',
    title: 'Marriage Matching',
    description: 'Compatibility analysis',
    href: '/calculators/horoscope-matching',
    icon: '💕',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'numerology',
    title: 'Numerology',
    description: 'Lucky numbers & predictions',
    href: '/calculators/numerology',
    icon: '🔢',
    color: 'from-green-500 to-emerald-600'
  }
];

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
              {freeReports.map((item) => (
                <Link
                  key={item.id}
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
        <HoroscopePreview />

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

        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
