'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';

interface Service {
  id: number;
  name: string;
  description: string;
  service_type: string;
  price: number;
  duration_minutes: number;
  features: string;
}

interface BookingData {
  service_id: number;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  notes?: string;
}

export default function BookAppointmentPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { token, login } = useAuth();
  
  const [formData, setFormData] = useState<BookingData>({
    service_id: 0,
    booking_date: '',
    booking_time: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    notes: ''
  });

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/services/');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      // Ensure we have a token (auto-login demo user if needed)
      let authToken = token;
      if (!authToken) {
        const loginResult = await login('testuser', 'test123');
        if (!loginResult.success) {
          throw new Error(loginResult.message || 'Authentication failed');
        }
        // AuthContext stores token internally; re-read it
        authToken = localStorage.getItem('auth_token');
      }

      if (!authToken) {
        throw new Error('Missing authentication token');
      }

      // Build ISO datetimes per backend schema
      const bookingDateIso = new Date(`${formData.booking_date}T${formData.booking_time}:00`).toISOString();
      const birthDateIso = formData.birth_date && formData.birth_time
        ? new Date(`${formData.birth_date}T${formData.birth_time}:00`).toISOString()
        : undefined;

      const payload: any = {
        service_id: Number(formData.service_id),
        booking_date: bookingDateIso,
        booking_time: formData.booking_time,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        notes: formData.notes,
      };
      if (birthDateIso) payload.birth_date = birthDateIso;
      if (formData.birth_time) payload.birth_time = formData.birth_time;
      if (formData.birth_place) payload.birth_place = formData.birth_place;

      const response = await apiClient.createBooking(authToken, payload);
      if (response.success && response.data) {
        const bookingData: any = response.data;
        setMessage({
          type: 'success',
          text: `Booking successful! Your booking ID is ${bookingData.id}. You will receive a confirmation email shortly.`
        });
        setFormData({
          service_id: 0,
          booking_date: '',
          booking_time: '',
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          birth_date: '',
          birth_time: '',
          birth_place: '',
          notes: ''
        });
      } else {
        throw new Error(response.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred while booking. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Book Your Consultation
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Schedule a personalized consultation with our expert astrologer. 
                Get professional astrological guidance tailored to your specific needs.
              </p>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Booking Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Schedule Your Session</h2>
                
                {message && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="customer_name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="customer_email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="customer_email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="customer_phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="customer_phone"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label htmlFor="service_id" className="block text-sm font-semibold text-gray-700 mb-2">
                      Consultation Type *
                    </label>
                    <select
                      id="service_id"
                      name="service_id"
                      value={formData.service_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value={0}>Select consultation type</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} ({service.duration_minutes} min) - ₹{service.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="booking_date" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="booking_date"
                      name="booking_date"
                      value={formData.booking_date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking_time" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      id="booking_time"
                      name="booking_time"
                      value={formData.booking_time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select time slot</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="birth_details" className="block text-sm font-semibold text-gray-700 mb-2">
                      Birth Details *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="date"
                        id="birth_date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Birth Date"
                      />
                      <input
                        type="time"
                        id="birth_time"
                        name="birth_time"
                        value={formData.birth_time}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Birth Time"
                      />
                      <input
                        type="text"
                        id="birth_place"
                        name="birth_place"
                        value={formData.birth_place}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Birth Place"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                      Specific Questions or Concerns
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Please share any specific questions or areas you'd like to focus on during the consultation..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Booking...' : 'Book Consultation'}
                  </button>
                </form>
              </div>

              {/* Consultation Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Consultation Details</h2>
                
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">What to Expect</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Detailed birth chart analysis</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Personalized predictions and guidance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Practical remedies and solutions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Q&A session for your concerns</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Services</h3>
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div key={service.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="font-medium text-gray-800">{service.name}</span>
                            <p className="text-sm text-gray-500">{service.duration_minutes} minutes</p>
                          </div>
                          <span className="text-orange-600 font-semibold">₹{service.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Important Notes</h3>
                    <ul className="space-y-3 text-gray-600 text-sm">
                      <li>• Please provide accurate birth details for precise predictions</li>
                      <li>• Consultations are conducted in Hindi, English, or regional languages</li>
                      <li>• Payment is required before the consultation</li>
                      <li>• Rescheduling is allowed up to 24 hours before the appointment</li>
                      <li>• You will receive a confirmation call/email after booking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}