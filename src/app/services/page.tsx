'use client';

import { useState, useEffect } from 'react';

interface Service {
  id: number;
  name: string;
  description: string;
  service_type: string;
  price?: number;
  duration_minutes?: number;
  is_active: boolean;
  image_url?: string;
  features?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Use relative path - will be proxied by Next.js rewrites
        const response = await fetch('/api/services/');
        
        if (response.ok) {
          const data = await response.json();
          setServices(data);
          setError(null);
        } else {
          setError('Failed to load services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Error</h1>
            <p className="text-xl text-gray-600 mb-8">{error}</p>
            <a 
              href="/" 
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Our <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Astrological Services</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the comprehensive range of Vedic astrology services offered by Dr. Arup Shastri. 
              From personal consultations to detailed reports, we provide authentic guidance for all aspects of life.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{service.name}</h3>
                <p className="text-gray-600 mb-4 text-center">{service.description}</p>
                
                {service.price && (
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-orange-600">₹{service.price}</span>
                    {service.duration_minutes && (
                      <span className="text-gray-500 ml-2">({service.duration_minutes} min)</span>
                    )}
                  </div>
                )}
                
                <div className="text-center">
                  <a 
                    href="/book-appointment"
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Services Available</h2>
            <p className="text-gray-600 mb-8">Services are being updated. Please check back later.</p>
            <a 
              href="/contact"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Discover Your Destiny?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Book a personal consultation with Dr. Arup Shastri and get authentic Vedic astrology guidance for your life's journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/book-appointment"
              className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Book Personal Consultation
            </a>
            <a 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
