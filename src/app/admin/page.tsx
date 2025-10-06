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
          <div className="bg-white rounded-2xl shadow-xl p-3 border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: '📊', color: 'from-blue-500 to-blue-600' },
                { id: 'analytics', label: 'Analytics', icon: '📈', color: 'from-green-500 to-green-600' },
                { id: 'content', label: 'Content', icon: '📝', color: 'from-purple-500 to-purple-600' },
                { id: 'users', label: 'Users', icon: '👥', color: 'from-indigo-500 to-indigo-600' },
                { id: 'bookings', label: 'Bookings', icon: '📅', color: 'from-pink-500 to-pink-600' },
                { id: 'settings', label: 'Settings', icon: '⚙️', color: 'from-gray-500 to-gray-600' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg ring-4 ring-white`
                      : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-500 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl mb-2 ${activeTab === tab.id ? 'animate-bounce' : ''}`}>
                      {tab.icon}
                    </div>
                    <div className="text-sm font-medium">{tab.label}</div>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{stats?.total_users || 0}</div>
                <div className="text-xs text-blue-500 font-medium">Total Users</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-semibold">↗️ +12% from last month</span>
              <div className="w-16 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{stats?.total_bookings || 0}</div>
                <div className="text-xs text-green-500 font-medium">Total Bookings</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700 font-semibold">↗️ +8% from last month</span>
              <div className="w-16 h-2 bg-green-200 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">{stats?.pending_bookings || 0}</div>
                <div className="text-xs text-yellow-500 font-medium">Pending</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600 font-semibold">⚠️ Requires attention</span>
              <div className="w-16 h-2 bg-yellow-200 rounded-full overflow-hidden">
                <div className="w-1/4 h-full bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">$2,847</div>
                <div className="text-xs text-purple-500 font-medium">Revenue</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700 font-semibold">↗️ +15% from last month</span>
              <div className="w-16 h-2 bg-purple-200 rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Based on Active Tab */}
        {activeTab === 'overview' && (
          <>
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
                  { href: '/admin/podcasts', icon: '🎧', title: 'Podcasts', desc: 'Manage videos', color: 'from-pink-500 to-pink-600' },
                  { href: '/admin/testimonials', icon: '⭐', title: 'Reviews', desc: 'Client feedback', color: 'from-yellow-500 to-yellow-600' }
                ].map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 block"
                  >
              <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <span className="text-2xl">{action.icon}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Traffic Overview</h3>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-blue-700">Page Views</span>
                    <span className="text-2xl font-bold text-blue-600">12,847</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-green-700">Unique Visitors</span>
                    <span className="text-2xl font-bold text-green-600">8,432</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-3/5"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Popular Pages</h3>
                <div className="space-y-4">
                  {[
                    { page: '/services', views: '2,847', percentage: 85 },
                    { page: '/horoscope', views: '1,923', percentage: 65 },
                    { page: '/blog', views: '1,456', percentage: 45 },
                    { page: '/book-appointment', views: '987', percentage: 30 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-900">{item.page}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{item.views} views</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500 rounded-xl">
                      <span className="text-white text-xl">📝</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{stats?.total_blogs || 0}</span>
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Blog Posts</h3>
                  <p className="text-sm text-purple-700">Published articles and guides</p>
                  <Link href="/admin/blogs" className="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                    Manage Blogs →
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-pink-500 rounded-xl">
                      <span className="text-white text-xl">🎧</span>
                    </div>
                    <span className="text-2xl font-bold text-pink-600">{stats?.total_podcasts || 0}</span>
                  </div>
                  <h3 className="font-semibold text-pink-900 mb-2">Podcasts</h3>
                  <p className="text-sm text-pink-700">Video and audio content</p>
                  <Link href="/admin/podcasts" className="mt-4 inline-block bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium">
                    Manage Podcasts →
            </Link>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-indigo-500 rounded-xl">
                      <span className="text-white text-xl">🛍️</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">{stats?.total_services || 0}</span>
                  </div>
                  <h3 className="font-semibold text-indigo-900 mb-2">Services</h3>
                  <p className="text-sm text-indigo-700">Astrology services offered</p>
                  <Link href="/admin/services" className="mt-4 inline-block bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium">
                    Manage Services →
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Content Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">📝</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">New blog post published</p>
                      <p className="text-sm text-gray-600">"Understanding Vedic Astrology"</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">🎧</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Podcast uploaded</p>
                      <p className="text-sm text-gray-600">"Moon Signs and Emotions"</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <Link href="/admin/users" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg">
                Manage All Users →
            </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <span className="text-white text-xl">👥</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats?.total_users || 0}</span>
                </div>
                <h3 className="font-semibold text-green-900">Total Users</h3>
                <p className="text-sm text-green-700">Registered clients</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <span className="text-white text-xl">✅</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">87%</span>
                </div>
                <h3 className="font-semibold text-blue-900">Active Users</h3>
                <p className="text-sm text-blue-700">Engaged this month</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-500 rounded-xl">
                    <span className="text-white text-xl">🆕</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">23</span>
                </div>
                <h3 className="font-semibold text-yellow-900">New This Week</h3>
                <p className="text-sm text-yellow-700">Recent registrations</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
              <Link href="/admin/bookings" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg">
                Manage All Bookings →
            </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats?.total_bookings || 0}</div>
                <div className="text-sm font-medium text-green-700">Total Bookings</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats?.total_bookings - (stats?.pending_bookings || 0) || 0}</div>
                <div className="text-sm font-medium text-blue-700">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{stats?.pending_bookings || 0}</div>
                <div className="text-sm font-medium text-yellow-700">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">$2,847</div>
                <div className="text-sm font-medium text-purple-700">Revenue</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gray-500 rounded-xl mr-4">
                      <span className="text-white text-xl">🔐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Security</h3>
                      <p className="text-sm text-gray-600">Password & access</p>
                    </div>
                  </div>
                  <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                    Manage Security
                  </button>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl mr-4">
                      <span className="text-white text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Email</h3>
                      <p className="text-sm text-blue-600">Notifications & SMTP</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                    Configure Email
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-500 rounded-xl mr-4">
                      <span className="text-white text-xl">💳</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Payments</h3>
                      <p className="text-sm text-green-600">Payment gateway</p>
                    </div>
                  </div>
                  <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                    Payment Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Server Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Online</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Database</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Connected</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">SSL Certificate</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Monitoring</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Last Backup</span>
                    <span className="text-sm text-gray-600">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Uptime</span>
                    <span className="text-sm text-gray-600">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Version</span>
                    <span className="text-sm text-gray-600">v1.0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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