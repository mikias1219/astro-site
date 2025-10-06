'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface SEOSettings {
  site_title: string;
  site_description: string;
  site_keywords: string;
  google_analytics_id: string;
  facebook_app_id: string;
  twitter_handle: string;
  robots_txt: string;
  sitemap_url: string;
  schema_markup: string;
}

interface SEOPerformance {
  total_pages: number;
  pages_with_meta_title: number;
  pages_with_meta_description: number;
  pages_with_canonical: number;
  pages_with_schema: number;
  broken_links: number;
  seo_score: number;
}

export default function AdminSEOpage() {
  const [settings, setSettings] = useState<SEOSettings>({
    site_title: '',
    site_description: '',
    site_keywords: '',
    google_analytics_id: '',
    facebook_app_id: '',
    twitter_handle: '',
    robots_txt: '',
    sitemap_url: '',
    schema_markup: ''
  });

  const [performance, setPerformance] = useState<SEOPerformance>({
    total_pages: 0,
    pages_with_meta_title: 0,
    pages_with_meta_description: 0,
    pages_with_canonical: 0,
    pages_with_schema: 0,
    broken_links: 0,
    seo_score: 0
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchSEOSettings();
      fetchSEOPerformance();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchSEOSettings = async () => {
    try {
      const response = await fetch('https://astroarupshastri.com/api/admin/seo/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch SEO settings');
    }
  };

  const fetchSEOPerformance = async () => {
    try {
      const response = await fetch('https://astroarupshastri.com/api/admin/seo/performance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPerformance(data);
      }
    } catch (error) {
      console.error('Failed to fetch SEO performance');
    } finally {
      setLoading(false);
    }
  };

  const updateSEOSettings = async () => {
    try {
      const response = await fetch('https://astroarupshastri.com/api/admin/seo/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('SEO settings updated successfully!');
      }
    } catch (error) {
      alert('Failed to update SEO settings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 SEO Management</h1>
              <p className="text-gray-600">Optimize your website for search engines and track performance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={updateSEOSettings}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                💾 Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* SEO Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg group-hover:animate-pulse">
                <span className="text-xl">📊</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{performance.seo_score}%</span>
            </div>
            <h3 className="font-semibold text-blue-900 mb-1">SEO Score</h3>
            <p className="text-sm text-blue-700">Overall performance</p>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500 text-white shadow-lg group-hover:animate-pulse">
                <span className="text-xl">✅</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{performance.pages_with_meta_title}</span>
            </div>
            <h3 className="font-semibold text-green-900 mb-1">Meta Titles</h3>
            <p className="text-sm text-green-700">Pages with SEO titles</p>
          </div>

          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500 text-white shadow-lg group-hover:animate-pulse">
                <span className="text-xl">📝</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">{performance.pages_with_meta_description}</span>
            </div>
            <h3 className="font-semibold text-purple-900 mb-1">Meta Descriptions</h3>
            <p className="text-sm text-purple-700">Pages with descriptions</p>
          </div>

          <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500 text-white shadow-lg group-hover:animate-pulse">
                <span className="text-xl">🔗</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{performance.pages_with_canonical}</span>
            </div>
            <h3 className="font-semibold text-yellow-900 mb-1">Canonical URLs</h3>
            <p className="text-sm text-yellow-700">Pages with canonical tags</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-3 border border-gray-100 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊', color: 'from-blue-500 to-blue-600' },
              { id: 'settings', label: 'Settings', icon: '⚙️', color: 'from-green-500 to-green-600' },
              { id: 'schema', label: 'Schema', icon: '🏗️', color: 'from-purple-500 to-purple-600' },
              { id: 'tools', label: 'Tools', icon: '🛠️', color: 'from-orange-500 to-orange-600' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg ring-4 ring-white`
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 bg-gray-50'
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

        {/* Dynamic Content Based on Active Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">SEO Performance Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Content Optimization</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                      <span className="font-medium text-green-800">Pages with Meta Titles</span>
                      <span className="font-bold text-green-600">{performance.pages_with_meta_title}/{performance.total_pages}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                      <span className="font-medium text-blue-800">Pages with Meta Descriptions</span>
                      <span className="font-bold text-blue-600">{performance.pages_with_meta_description}/{performance.total_pages}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                      <span className="font-medium text-purple-800">Pages with Schema Markup</span>
                      <span className="font-bold text-purple-600">{performance.pages_with_schema}/{performance.total_pages}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Technical SEO</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                      <span className="font-medium text-yellow-800">Canonical URLs</span>
                      <span className="font-bold text-yellow-600">{performance.pages_with_canonical}/{performance.total_pages}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                      <span className="font-medium text-red-800">Broken Links</span>
                      <span className="font-bold text-red-600">{performance.broken_links}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl">
                      <span className="font-medium text-indigo-800">SEO Health Score</span>
                      <span className="font-bold text-indigo-600">{performance.seo_score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">SEO Recommendations</h2>
              <div className="space-y-4">
                {performance.pages_with_meta_title < performance.total_pages && (
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Missing Meta Titles:</strong> {performance.total_pages - performance.pages_with_meta_title} pages don't have meta titles. Add custom SEO titles to improve search rankings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {performance.pages_with_meta_description < performance.total_pages && (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-800">
                          <strong>Missing Meta Descriptions:</strong> {performance.total_pages - performance.pages_with_meta_description} pages don't have meta descriptions. Add compelling descriptions for better click-through rates.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {performance.broken_links > 0 && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">
                          <strong>Broken Links Detected:</strong> {performance.broken_links} broken links found. Fix broken links to improve user experience and SEO.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Global SEO Settings</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Site Title</label>
                  <input
                    type="text"
                    value={settings.site_title}
                    onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="AstroArupShastri - Vedic Astrology Services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Site Description</label>
                  <input
                    type="text"
                    value={settings.site_description}
                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Professional Vedic astrology consultations..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Site Keywords</label>
                <input
                  type="text"
                  value={settings.site_keywords}
                  onChange={(e) => setSettings({ ...settings, site_keywords: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="astrology, vedic, horoscope, spiritual, consultation"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics & Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Google Analytics ID</label>
                    <input
                      type="text"
                      value={settings.google_analytics_id}
                      onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="GA-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook App ID</label>
                    <input
                      type="text"
                      value={settings.facebook_app_id}
                      onChange={(e) => setSettings({ ...settings, facebook_app_id: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="1234567890123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter Handle</label>
                    <input
                      type="text"
                      value={settings.twitter_handle}
                      onChange={(e) => setSettings({ ...settings, twitter_handle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="@astroarupshastri"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical SEO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Robots.txt Content</label>
                    <textarea
                      value={settings.robots_txt}
                      onChange={(e) => setSettings({ ...settings, robots_txt: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                      rows={8}
                      placeholder={`User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/

Sitemap: https://astroarupshastri.com/sitemap.xml`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Global Schema Markup</label>
                    <textarea
                      value={settings.schema_markup}
                      onChange={(e) => setSettings({ ...settings, schema_markup: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                      rows={8}
                      placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Schema Markup Generator</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Schema</h3>
                  <pre className="text-xs bg-white p-4 rounded border overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AstroArupShastri",
  "url": "https://astroarupshastri.com",
  "logo": "https://astroarupshastri.com/logo.png",
  "description": "${settings.site_description}",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "customer service"
  }
}`}
                  </pre>
                  <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                    Copy Schema
                  </button>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Local Business Schema</h3>
                  <pre className="text-xs bg-white p-4 rounded border overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "AstroArupShastri",
  "image": "https://astroarupshastri.com/featured-image.jpg",
  "description": "${settings.site_description}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Your Address",
    "addressLocality": "Your City",
    "addressRegion": "Your State",
    "postalCode": "Your PIN",
    "addressCountry": "IN"
  },
  "telephone": "+91-XXXXXXXXXX"
}`}
                  </pre>
                  <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                    Copy Schema
                  </button>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Professional Service Schema</h3>
                <pre className="text-xs bg-white p-4 rounded border overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Vedic Astrology Consultation",
  "provider": {
    "@type": "Organization",
    "name": "AstroArupShastri"
  },
  "serviceType": "Astrology Consultation",
  "areaServed": "Worldwide",
  "description": "Professional Vedic astrology consultations and horoscope readings",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "1500",
    "description": "Detailed astrology consultation"
  }
}`}
                </pre>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                  Copy Schema
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">SEO Tools & Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-500 rounded-xl mr-4">
                      <span className="text-white text-xl">🔍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Meta Tag Checker</h3>
                      <p className="text-sm text-green-700">Validate meta tags</p>
                    </div>
                  </div>
                  <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                    Run Check
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl mr-4">
                      <span className="text-white text-xl">🔗</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Link Checker</h3>
                      <p className="text-sm text-blue-700">Find broken links</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                    Check Links
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-500 rounded-xl mr-4">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900">Sitemap Generator</h3>
                      <p className="text-sm text-purple-700">Update sitemap</p>
                    </div>
                  </div>
                  <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                    Generate Sitemap
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-yellow-500 rounded-xl mr-4">
                      <span className="text-white text-xl">📈</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-900">Performance Report</h3>
                      <p className="text-sm text-yellow-700">SEO performance</p>
                    </div>
                  </div>
                  <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium">
                    Generate Report
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-red-500 rounded-xl mr-4">
                      <span className="text-white text-xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-900">Submit to Search Engines</h3>
                      <p className="text-sm text-red-700">Index new content</p>
                    </div>
                  </div>
                  <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                    Submit Now
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-indigo-500 rounded-xl mr-4">
                      <span className="text-white text-xl">📋</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-indigo-900">Keyword Research</h3>
                      <p className="text-sm text-indigo-700">Find new keywords</p>
                    </div>
                  </div>
                  <button className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium">
                    Research Keywords
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick SEO Fixes</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">Generate Missing Meta Titles</h3>
                    <p className="text-sm text-gray-600">Auto-generate SEO titles for pages without them</p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    Generate
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">Add Canonical URLs</h3>
                    <p className="text-sm text-gray-600">Automatically add canonical tags to all pages</p>
                  </div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                    Add Canonicals
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">Optimize Images</h3>
                    <p className="text-sm text-gray-600">Add alt text and compress images</p>
                  </div>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                    Optimize
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}