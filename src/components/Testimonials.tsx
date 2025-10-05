'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface Testimonial {
  id: number;
  name: string;
  email: string;
  rating: number;
  content: string;
  is_approved: boolean;
  service_used: string;
  created_at: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const result = await apiClient.getTestimonials();
        if (result.success && Array.isArray(result.data)) {
          // Filter only approved testimonials
          const approvedTestimonials = result.data.filter((t: Testimonial) => t.is_approved);
          setTestimonials(approvedTestimonials.slice(0, 3)); // Show only 3 testimonials on home page
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-300 rounded mb-3"></div>
                <div className="h-3 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
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
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0).toUpperCase()}
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
              <p className="text-gray-600 mb-3">"{testimonial.content}"</p>
              <p className="text-sm text-orange-600 font-semibold">
                - {testimonial.service_used || 'Astrology Service'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
