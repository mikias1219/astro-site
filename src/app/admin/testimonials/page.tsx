'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface Testimonial {
  id: number;
  name: string;
  email: string | null;
  rating: number | null;
  content: string;
  is_approved: boolean;
  service_used: string | null;
  user_id: number | null;
  created_at: string;
  updated_at: string | null;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    content: '',
    service_used: '',
    is_approved: false
  });

  useEffect(() => {
    if (token) {
      fetchTestimonials(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchTestimonials = async (authToken: string) => {
    try {
      const response = await fetch('https://astroarupshastri.com/api/admin/testimonials', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
        setError(null);
      } else {
        setError('Failed to fetch testimonials');
      }
    } catch (error) {
      setError('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await fetch('https://astroarupshastri.com/api/admin/testimonials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchTestimonials(token);
        setShowAddForm(false);
        setFormData({
          name: '',
          email: '',
          rating: 5,
          content: '',
          service_used: '',
          is_approved: false
        });
      } else {
        setError('Failed to save testimonial');
      }
    } catch (error) {
      setError('Failed to save testimonial');
    }
  };

  const toggleTestimonialStatus = async (testimonialId: number, currentStatus: boolean) => {
    if (!token) return;

    try {
      const response = await fetch(`https://astroarupshastri.com/api/admin/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_approved: !currentStatus })
      });

      if (response.ok) {
        await fetchTestimonials(token);
      } else {
        setError('Failed to update testimonial status');
      }
    } catch (error) {
      setError('Failed to update testimonial status');
    }
  };

  const deleteTestimonial = async (testimonialId: number) => {
    if (!token || !confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`https://astroarupshastri.com/api/admin/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchTestimonials(token);
      } else {
        setError('Failed to delete testimonial');
      }
    } catch (error) {
      setError('Failed to delete testimonial');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Testimonials</h2>
            <p className="text-gray-600">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Testimonials Management</h1>
            <p className="text-gray-600">Manage customer testimonials and reviews</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setFormData({
                name: '',
                email: '',
                rating: 5,
                content: '',
                service_used: '',
                is_approved: false
              });
            }}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Add Testimonial
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Testimonials</p>
                <p className="text-3xl font-bold text-gray-900">{testimonials.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{testimonials.filter(t => t.is_approved).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-3xl font-bold text-gray-900">{testimonials.filter(t => !t.is_approved).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Testimonial Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Testimonial</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter email address (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Used</label>
                  <input
                    type="text"
                    value={formData.service_used}
                    onChange={(e) => setFormData({...formData, service_used: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Horoscope Reading"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                    <option value={3}>⭐⭐⭐ (3 stars)</option>
                    <option value={2}>⭐⭐ (2 stars)</option>
                    <option value={1}>⭐ (1 star)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter the testimonial content"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_approved"
                  checked={formData.is_approved}
                  onChange={(e) => setFormData({...formData, is_approved: e.target.checked})}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is_approved" className="ml-2 block text-sm text-gray-900">
                  Approve immediately
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Add Testimonial
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Testimonials Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.email || 'No email'}</div>
                        <div className="text-xs text-gray-400">{testimonial.service_used || 'No service specified'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex text-yellow-400">
                        {testimonial.rating ? [...Array(testimonial.rating)].map((_, i) => (
                          <span key={i}>⭐</span>
                        )) : <span className="text-gray-400">No rating</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {testimonial.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleTestimonialStatus(testimonial.id, testimonial.is_approved)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          testimonial.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {testimonial.is_approved ? 'Approved' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first testimonial.</p>
          </div>
        )}
      </div>
    </div>
  );
}
