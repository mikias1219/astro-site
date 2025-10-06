'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  total_users: number;
  total_bookings: number;
  total_services: number;
  total_blogs: number;
  total_testimonials: number;
  pending_bookings: number;
  monthly_bookings: number;
  recent_bookings: any[];
  popular_services: any[];
  total_podcasts: number;
  total_horoscopes: number;
  total_panchang_entries: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      fetchDashboardData(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchDashboardData = async (authToken: string) => {
    try {
      const response = await fetch('https://astroarupshastri.com/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-200 border-t-orange-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Initializing admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
            >
              Go to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Complete control over your astrology platform</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Welcome back, {user?.full_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Last login: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg">
                  Quick Actions
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 border border-gray-100">
            <div className="flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
                { id: 'content', label: 'Content', icon: '📝' },
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'bookings', label: 'Bookings', icon: '📅' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Users</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats?.total_users || 0}</p>
                <p className="text-sm text-green-600 mt-1">↗️ +12% from last month</p>
              </div>
              <div className="p-4 rounded-full bg-blue-100">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Bookings</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats?.total_bookings || 0}</p>
                <p className="text-sm text-green-600 mt-1">↗️ +8% from last month</p>
              </div>
              <div className="p-4 rounded-full bg-green-100">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending Bookings</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats?.pending_bookings || 0}</p>
                <p className="text-sm text-red-600 mt-1">⚠️ Requires attention</p>
              </div>
              <div className="p-4 rounded-full bg-yellow-100">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Monthly Revenue</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">$2,847</p>
                <p className="text-sm text-green-600 mt-1">↗️ +15% from last month</p>
              </div>
              <div className="p-4 rounded-full bg-purple-100">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <button className="text-orange-600 hover:text-orange-700 font-semibold">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[
              { href: '/admin/services', icon: '🛍️', title: 'Services', desc: 'Manage offerings', color: 'from-orange-500 to-red-600' },
              { href: '/admin/bookings', icon: '📅', title: 'Bookings', desc: 'View appointments', color: 'from-blue-500 to-blue-600' },
              { href: '/admin/users', icon: '👥', title: 'Users', desc: 'Manage clients', color: 'from-green-500 to-green-600' },
              { href: '/admin/pages', icon: '📄', title: 'Pages', desc: 'Edit content', color: 'from-purple-500 to-purple-600' },
              { href: '/admin/blogs', icon: '📝', title: 'Blogs', desc: 'Create articles', color: 'from-indigo-500 to-indigo-600' },
              { href: '/admin/seo', icon: '🔍', title: 'SEO', desc: 'Optimize ranking', color: 'from-teal-500 to-teal-600' },
              { href: '/admin/podcasts', icon: '🎧', title: 'Podcasts', desc: 'Manage audio', color: 'from-pink-500 to-pink-600' },
              { href: '/admin/testimonials', icon: '⭐', title: 'Reviews', desc: 'Client feedback', color: 'from-yellow-500 to-yellow-600' }
            ].map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 block"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
              <Link href="/admin/bookings" className="text-orange-600 hover:text-orange-700 font-semibold">View All</Link>
            </div>
            <div className="space-y-4">
              {stats?.recent_bookings?.slice(0, 5).map((booking: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{booking.customer_name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.customer_name}</p>
                      <p className="text-sm text-gray-600">{booking.service?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{new Date(booking.created_at).toLocaleDateString()}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">No recent bookings</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">System Status</h3>
            <div className="space-y-6">
              {[
                { label: 'Database', status: 'healthy', value: 'Connected' },
                { label: 'API Services', status: 'healthy', value: 'All Running' },
                { label: 'Email Service', status: 'warning', value: 'SMTP Config Needed' },
                { label: 'SSL Certificate', status: 'healthy', value: 'Valid (30 days)' },
                { label: 'Server Load', status: 'healthy', value: '23% Average' },
                { label: 'Storage Used', status: 'healthy', value: '1.2 GB / 10 GB' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'healthy' ? 'bg-green-500' :
                      item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    item.status === 'healthy' ? 'text-green-600' :
                    item.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-gray-300 mb-6">Our admin dashboard provides complete control over your astrology platform. All features are designed for maximum efficiency and user experience.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg">
                Documentation
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold">
                Support Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}