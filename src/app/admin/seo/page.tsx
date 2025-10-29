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

interface PageSEO {
  id: number;
  page_url: string;
  title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  schema_markup: string;
  is_published: boolean;
  last_updated: string;
}

interface BlogSEO {
  id: number;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  schema_markup: string;
  is_published: boolean;
  last_updated: string;
}

interface ImageSEO {
  id: number;
  image_url: string;
  alt_text: string;
  title_attribute: string;
  caption: string;
  page_url: string;
  is_optimized: boolean;
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

  const [pages, setPages] = useState<PageSEO[]>([]);
  const [blogs, setBlogs] = useState<BlogSEO[]>([]);
  const [images, setImages] = useState<ImageSEO[]>([]);
  const [redirects, setRedirects] = useState<any[]>([]);
  const [editingPage, setEditingPage] = useState<PageSEO | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogSEO | null>(null);
  const [editingRedirect, setEditingRedirect] = useState<any>(null);
  const [showPageModal, setShowPageModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [analyticsConfig, setAnalyticsConfig] = useState({
    google_analytics_id: '',
    google_search_console_property: '',
    google_analytics_enabled: false,
    google_search_console_enabled: false
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchSEOSettings();
      fetchSEOPerformance();
      fetchPages();
      fetchBlogs();
      fetchImages();
      fetchRedirects();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchSEOSettings = async () => {
    try {
      // Use relative path - will be proxied by Next.js rewrites
      const apiUrl = '/api/admin/seo/settings';

      const response = await fetch(apiUrl, {
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
      // Use relative path - will be proxied by Next.js rewrites
      const apiUrl = '/api/admin/seo/performance';

      const response = await fetch(apiUrl, {
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

  const fetchPages = async () => {
    try {
      // Use relative path - will be proxied by Next.js rewrites
      const apiUrl = '/api/pages';

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const pagesData = await response.json();

        // Fetch SEO data for each page
        const pagesWithSEO = await Promise.all(
          pagesData.map(async (page: any) => {
            try {
              // Use relative path - will be proxied by Next.js rewrites
              const seoApiUrl = `/api/seo/page/${page.slug}`;

              const seoResponse = await fetch(seoApiUrl, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              let seoData = null;
              if (seoResponse.ok) {
                seoData = await seoResponse.json();
              }

              return {
                id: page.id,
                page_url: `/${page.slug}`,
                title: seoData?.meta_title || page.title,
                meta_description: seoData?.meta_description || '',
                meta_keywords: seoData?.meta_keywords || '',
                canonical_url: seoData?.canonical_url || `https://astroarupshastri.com/${page.slug}`,
                schema_markup: seoData?.schema_markup || '',
                is_published: page.is_published,
                last_updated: page.updated_at || page.created_at
              };
            } catch (error) {
              // Return page data without SEO
              return {
                id: page.id,
                page_url: `/${page.slug}`,
                title: page.title,
                meta_description: '',
                meta_keywords: '',
                canonical_url: `https://astroarupshastri.com/${page.slug}`,
                schema_markup: '',
                is_published: page.is_published,
                last_updated: page.updated_at || page.created_at
              };
            }
          })
        );

        setPages(pagesWithSEO);
      }
    } catch (error) {
      console.error('Failed to fetch pages');
    }
  };

  const fetchBlogs = async () => {
    try {
      // Use relative path - will be proxied by Next.js rewrites
      const apiUrl = '/api/blogs';

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blogsData = await response.json();

        // Fetch SEO data for each blog
        const blogsWithSEO = await Promise.all(
          blogsData.map(async (blog: any) => {
            try {
              // Use relative path - will be proxied by Next.js rewrites
              const seoApiUrl = `/api/seo/blog/${blog.slug}`;

              const seoResponse = await fetch(seoApiUrl, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              let seoData = null;
              if (seoResponse.ok) {
                seoData = await seoResponse.json();
              }

              return {
                id: blog.id,
                title: blog.title,
                slug: blog.slug,
                meta_title: seoData?.meta_title || `${blog.title} - AstroArupShastri`,
                meta_description: seoData?.meta_description || blog.description.substring(0, 160),
                meta_keywords: seoData?.meta_keywords || '',
                canonical_url: seoData?.canonical_url || `https://astroarupshastri.com/blog/${blog.slug}`,
                schema_markup: seoData?.schema_markup || '',
                is_published: blog.is_published,
                last_updated: blog.updated_at || blog.created_at
              };
            } catch (error) {
              // Return blog data without SEO
              return {
                id: blog.id,
                title: blog.title,
                slug: blog.slug,
                meta_title: `${blog.title} - AstroArupShastri`,
                meta_description: blog.description.substring(0, 160),
                meta_keywords: '',
                canonical_url: `https://astroarupshastri.com/blog/${blog.slug}`,
                schema_markup: '',
                is_published: blog.is_published,
                last_updated: blog.updated_at || blog.created_at
              };
            }
          })
        );

        setBlogs(blogsWithSEO);
      }
    } catch (error) {
      console.error('Failed to fetch blogs');
    }
  };

  const fetchImages = async () => {
    try {
      // Use relative path - will be proxied by Next.js rewrites
      const apiUrl = '/api/admin/seo/images';

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Failed to fetch images');
    }
  };

  const fetchRedirects = async () => {
    try {
      // Use relative path - will be proxied by Next.js rewrites
      const apiUrl = '/api/admin/seo/redirects';

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRedirects(data);
      }
    } catch (error) {
      console.error('Failed to fetch redirects');
    }
  };

  const handleDeleteRedirect = async (redirectId: number) => {
    if (!confirm('Are you sure you want to delete this redirect?')) return;

    try {
      // Use relative path - will be proxied by Next.js rewrites
      const apiUrl = `/api/admin/seo/redirects/${redirectId}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setRedirects(redirects.filter(r => r.id !== redirectId));
        alert('Redirect deleted successfully!');
      } else {
        alert('Failed to delete redirect');
      }
    } catch (error) {
      alert('Failed to delete redirect');
    }
  };

  const updateSEOSettings = async () => {
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8000/api/admin/seo/settings'
        : 'https://astroarupshastri.com/api/admin/seo/settings';

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('SEO settings updated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update SEO settings: ${errorData.detail || 'Unknown error'}`);
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
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊', color: 'from-blue-500 to-blue-600' },
              { id: 'pages', label: 'Pages', icon: '📄', color: 'from-green-500 to-green-600' },
              { id: 'blogs', label: 'Blogs', icon: '📝', color: 'from-purple-500 to-purple-600' },
              { id: 'images', label: 'Images', icon: '🖼️', color: 'from-orange-500 to-orange-600' },
              { id: 'redirects', label: 'Redirects', icon: '🔀', color: 'from-red-500 to-red-600' },
              { id: 'analytics', label: 'Analytics', icon: '📈', color: 'from-teal-500 to-teal-600' },
              { id: 'tools', label: 'Tools', icon: '🛠️', color: 'from-indigo-500 to-indigo-600' }
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
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schema Markup Auto-Generator</h2>

              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Page Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="article">Article/Blog Post</option>
                      <option value="product">Product/Service</option>
                      <option value="organization">Organization</option>
                      <option value="local-business">Local Business</option>
                      <option value="faq">FAQ Page</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Page URL</label>
                    <input
                      type="text"
                      placeholder="/blog/my-article"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-colors font-semibold">
                      Generate Schema
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Schema</h3>
                  <pre className="text-xs bg-white p-4 rounded border overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${settings.site_title || 'AstroArupShastri'}",
  "url": "https://astroarupshastri.com",
  "logo": "https://astroarupshastri.com/logo.svg",
  "description": "${settings.site_description}",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9876543210",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://facebook.com/astroarupshastri",
    "https://twitter.com/astroarupshastri"
  ]
}`}
                  </pre>
                  <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                    Copy Schema
                  </button>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Schema</h3>
                  <pre className="text-xs bg-white p-4 rounded border overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title",
  "description": "Article description here",
  "author": {
    "@type": "Person",
    "name": "Dr. Arup Shastri"
  },
  "publisher": {
    "@type": "Organization",
    "name": "${settings.site_title || 'AstroArupShastri'}",
    "logo": {
      "@type": "ImageObject",
      "url": "https://astroarupshastri.com/logo.svg"
    }
  },
  "datePublished": "2024-01-01T00:00:00Z",
  "dateModified": "2024-01-01T00:00:00Z"
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
  "@id": "https://astroarupshastri.com/#organization",
  "name": "Vedic Astrology Consultation Services",
  "description": "${settings.site_description}",
  "url": "https://astroarupshastri.com",
  "logo": "https://astroarupshastri.com/logo.svg",
  "image": "https://astroarupshastri.com/featured-image.jpg",
  "telephone": "+91-9876543210",
  "priceRange": "₹1500-₹10000",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Astrology Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Birth Chart Analysis",
          "description": "Detailed Vedic birth chart analysis"
        }
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "500"
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

        {activeTab === 'pages' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Page SEO Management</h2>
              <span className="text-sm text-gray-500">{pages.length} pages</span>
            </div>

            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{page.page_url}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          page.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.is_published ? 'Published' : 'Draft'}
                        </span>
                        <span>Updated: {new Date(page.last_updated).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingPage(page);
                        setShowPageModal(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Edit SEO
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-gray-700">Meta Title:</label>
                      <p className={`mt-1 ${page.title ? 'text-gray-900' : 'text-red-500 italic'}`}>
                        {page.title || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Meta Description:</label>
                      <p className={`mt-1 ${page.meta_description ? 'text-gray-900' : 'text-red-500 italic'}`}>
                        {page.meta_description || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Blog SEO Management</h2>
              <span className="text-sm text-gray-500">{blogs.length} blogs</span>
            </div>

            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{blog.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          blog.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {blog.is_published ? 'Published' : 'Draft'}
                        </span>
                        <span>Slug: {blog.slug}</span>
                        <span>Updated: {new Date(blog.last_updated).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingBlog(blog);
                        setShowBlogModal(true);
                      }}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                    >
                      Edit SEO
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-gray-700">Meta Title:</label>
                      <p className={`mt-1 ${blog.meta_title ? 'text-gray-900' : 'text-red-500 italic'}`}>
                        {blog.meta_title || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Meta Description:</label>
                      <p className={`mt-1 ${blog.meta_description ? 'text-gray-900' : 'text-red-500 italic'}`}>
                        {blog.meta_description || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Image SEO Optimization</h2>
              <span className="text-sm text-gray-500">{images.length} images</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || 'Image'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <label className="font-medium text-gray-700">Alt Text:</label>
                      <p className={`mt-1 ${image.alt_text ? 'text-gray-900' : 'text-red-500 italic'}`}>
                        {image.alt_text || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Title:</label>
                      <p className={`mt-1 ${image.title_attribute ? 'text-gray-900' : 'text-gray-500 italic'}`}>
                        {image.title_attribute || 'Not set'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        image.is_optimized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {image.is_optimized ? 'Optimized' : 'Not Optimized'}
                      </span>
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'redirects' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">URL Redirects</h2>
              <button
                onClick={() => setShowRedirectModal(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                ➕ Add Redirect
              </button>
            </div>

            <div className="space-y-4">
              {redirects.map((redirect: any) => (
                <div key={redirect.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className={`font-mono text-sm px-2 py-1 rounded ${
                          redirect.redirect_type === 301 ? 'bg-green-100 text-green-800' :
                          redirect.redirect_type === 302 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {redirect.redirect_type}
                        </span>
                        <span className={`font-medium ${
                          redirect.is_active ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {redirect.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">From:</span>
                          <span className="font-mono ml-2 text-red-600">{redirect.from_url}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">To:</span>
                          <span className="font-mono ml-2 text-green-600">{redirect.to_url}</span>
                        </div>
                        {redirect.description && (
                          <div>
                            <span className="font-medium text-gray-700">Description:</span>
                            <span className="ml-2 text-gray-600">{redirect.description}</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Created: {new Date(redirect.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingRedirect(redirect);
                          setShowRedirectModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRedirect(redirect.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {redirects.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">🔀</div>
                  <p className="text-lg mb-2">No redirects configured</p>
                  <p className="text-sm">Add your first redirect to manage URL changes and migrations.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🔍 Google Analytics & Search Console Setup</h2>
              
              <div className="space-y-6">
                {/* Google Analytics Section */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-500 rounded-xl">
                        <span className="text-white text-2xl">📊</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Google Analytics (GA4)</h3>
                        <p className="text-sm text-gray-600">Track website traffic and user behavior</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={analyticsConfig.google_analytics_enabled}
                        onChange={(e) => setAnalyticsConfig({...analyticsConfig, google_analytics_enabled: e.target.checked})}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">Enabled</label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Measurement ID (GA4)</label>
                      <input
                        type="text"
                        value={analyticsConfig.google_analytics_id}
                        onChange={(e) => setAnalyticsConfig({...analyticsConfig, google_analytics_id: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="G-XXXXXXXXXX"
                      />
                      <p className="text-sm text-gray-500 mt-1">Enter your Google Analytics 4 Measurement ID</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">📖 How to Get Your GA4 Measurement ID:</h4>
                      <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                        <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Google Analytics</a></li>
                        <li>Click "Admin" in the bottom left corner</li>
                        <li>Select your property (or create a new GA4 property)</li>
                        <li>Go to "Data Streams" → "Web"</li>
                        <li>Copy your "Measurement ID" (starts with G-)</li>
                        <li>Paste it in the field above and enable</li>
                      </ol>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>⚡ Auto-Integration:</strong> Once enabled, the GA4 tracking code will be automatically added to all pages of your website.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Google Search Console Section */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-green-500 rounded-xl">
                        <span className="text-white text-2xl">🔍</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Google Search Console</h3>
                        <p className="text-sm text-gray-600">Monitor search performance and indexing</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={analyticsConfig.google_search_console_enabled}
                        onChange={(e) => setAnalyticsConfig({...analyticsConfig, google_search_console_enabled: e.target.checked})}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">Enabled</label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Property URL</label>
                      <input
                        type="text"
                        value={analyticsConfig.google_search_console_property}
                        onChange={(e) => setAnalyticsConfig({...analyticsConfig, google_search_console_property: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="https://astroarupshastri.com"
                        disabled
                      />
                      <p className="text-sm text-gray-500 mt-1">This is your website URL (automatically set)</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">📖 How to Set Up Google Search Console:</h4>
                      <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
                        <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600">Google Search Console</a></li>
                        <li>Click "Add Property" and select "URL prefix"</li>
                        <li>Enter your website URL: <code className="bg-white px-2 py-1 rounded">https://astroarupshastri.com</code></li>
                        <li>Verify ownership using one of these methods:
                          <ul className="ml-6 mt-2 space-y-1 list-disc">
                            <li><strong>HTML File Upload:</strong> Download and upload the file to your server</li>
                            <li><strong>HTML Meta Tag:</strong> Add the meta tag to your homepage (Recommended)</li>
                            <li><strong>Google Analytics:</strong> If you've already set up GA4 above, use this method</li>
                          </ul>
                        </li>
                        <li>After verification, submit your sitemap: <code className="bg-white px-2 py-1 rounded">https://astroarupshastri.com/sitemap.xml</code></li>
                        <li>Enable the setting above once verified</li>
                      </ol>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>💡 Pro Tip:</strong> It may take 24-48 hours for Google Search Console to start showing data after verification and sitemap submission.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={async () => {
                      if (!token) return;
                      try {
                        const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
                          ? 'http://localhost:8000/api/admin/seo/settings'
                          : 'https://astroarupshastri.com/api/admin/seo/settings';

                        const updatedSettings = {
                          ...settings,
                          google_analytics_id: analyticsConfig.google_analytics_id,
                          google_search_console_property: analyticsConfig.google_search_console_property
                        };

                        const response = await fetch(apiUrl, {
                          method: 'PUT',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(updatedSettings)
                        });

                        if (response.ok) {
                          alert('✅ Analytics settings saved successfully! Changes will be applied within a few minutes.');
                        } else {
                          alert('❌ Failed to save analytics settings. Please try again.');
                        }
                      } catch (error) {
                        alert('❌ Failed to save analytics settings. Please check your connection.');
                      }
                    }}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    💾 Save Analytics Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Integration Status */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Integration Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`border-2 rounded-xl p-6 ${analyticsConfig.google_analytics_enabled && analyticsConfig.google_analytics_id ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">Google Analytics</h3>
                    {analyticsConfig.google_analytics_enabled && analyticsConfig.google_analytics_id ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">✓ ACTIVE</span>
                    ) : (
                      <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold">INACTIVE</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {analyticsConfig.google_analytics_id || 'Not configured'}
                  </p>
                </div>

                <div className={`border-2 rounded-xl p-6 ${analyticsConfig.google_search_console_enabled ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">Google Search Console</h3>
                    {analyticsConfig.google_search_console_enabled ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">✓ ACTIVE</span>
                    ) : (
                      <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold">INACTIVE</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {analyticsConfig.google_search_console_property || 'https://astroarupshastri.com'}
                  </p>
                </div>
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

        {/* Page SEO Edit Modal */}
        {showPageModal && editingPage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit SEO for {editingPage.page_url}</h2>
                  <button
                    onClick={() => setShowPageModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter meta title..."
                    />
                    <p className="text-sm text-gray-500 mt-1">{editingPage.title.length}/60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      value={editingPage.meta_description}
                      onChange={(e) => setEditingPage({...editingPage, meta_description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter meta description..."
                    />
                    <p className="text-sm text-gray-500 mt-1">{editingPage.meta_description.length}/160 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Keywords</label>
                    <input
                      type="text"
                      value={editingPage.meta_keywords}
                      onChange={(e) => setEditingPage({...editingPage, meta_keywords: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Canonical URL</label>
                    <input
                      type="url"
                      value={editingPage.canonical_url}
                      onChange={(e) => setEditingPage({...editingPage, canonical_url: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://astroarupshastri.com/page-url"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Schema Markup (JSON-LD)</label>
                    <textarea
                      value={editingPage.schema_markup}
                      onChange={(e) => setEditingPage({...editingPage, schema_markup: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      rows={8}
                      placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setShowPageModal(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {/* Save logic */}}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog SEO Edit Modal */}
        {showBlogModal && editingBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit SEO for "{editingBlog.title}"</h2>
                  <button
                    onClick={() => setShowBlogModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={editingBlog.meta_title}
                      onChange={(e) => setEditingBlog({...editingBlog, meta_title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter meta title..."
                    />
                    <p className="text-sm text-gray-500 mt-1">{editingBlog.meta_title.length}/60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      value={editingBlog.meta_description}
                      onChange={(e) => setEditingBlog({...editingBlog, meta_description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter meta description..."
                    />
                    <p className="text-sm text-gray-500 mt-1">{editingBlog.meta_description.length}/160 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Keywords</label>
                    <input
                      type="text"
                      value={editingBlog.meta_keywords}
                      onChange={(e) => setEditingBlog({...editingBlog, meta_keywords: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Canonical URL</label>
                    <input
                      type="url"
                      value={editingBlog.canonical_url}
                      onChange={(e) => setEditingBlog({...editingBlog, canonical_url: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://astroarupshastri.com/blog/slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Schema Markup (JSON-LD)</label>
                    <textarea
                      value={editingBlog.schema_markup}
                      onChange={(e) => setEditingBlog({...editingBlog, schema_markup: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                      rows={8}
                      placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setShowBlogModal(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {/* Save logic */}}
                    className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Redirect Modal */}
        {showRedirectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingRedirect ? 'Edit Redirect' : 'Add New Redirect'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowRedirectModal(false);
                      setEditingRedirect(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const redirectData = {
                    from_url: formData.get('from_url'),
                    to_url: formData.get('to_url'),
                    redirect_type: parseInt(formData.get('redirect_type') as string),
                    is_active: formData.get('is_active') === 'on',
                    description: formData.get('description')
                  };

                  try {
                    const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
                      ? 'http://localhost:8000/api/admin/seo/redirects'
                      : 'https://astroarupshastri.com/api/admin/seo/redirects';

                    const method = editingRedirect ? 'PUT' : 'POST';
                    const url = editingRedirect ? `${apiUrl}/${editingRedirect.id}` : apiUrl;

                    const response = await fetch(url, {
                      method,
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(redirectData)
                    });

                    if (response.ok) {
                      const result = await response.json();
                      if (editingRedirect) {
                        setRedirects(redirects.map(r => r.id === editingRedirect.id ? result : r));
                      } else {
                        setRedirects([...redirects, result]);
                      }
                      setShowRedirectModal(false);
                      setEditingRedirect(null);
                      alert(editingRedirect ? 'Redirect updated successfully!' : 'Redirect created successfully!');
                    } else {
                      const error = await response.json();
                      alert(`Error: ${error.detail || 'Failed to save redirect'}`);
                    }
                  } catch (error) {
                    alert('Failed to save redirect');
                  }
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">From URL *</label>
                      <input
                        type="text"
                        name="from_url"
                        defaultValue={editingRedirect?.from_url || ''}
                        placeholder="/old-page"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">The URL to redirect from (e.g., /old-page)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">To URL *</label>
                      <input
                        type="text"
                        name="to_url"
                        defaultValue={editingRedirect?.to_url || ''}
                        placeholder="/new-page"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">The URL to redirect to (e.g., /new-page)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Redirect Type</label>
                      <select
                        name="redirect_type"
                        defaultValue={editingRedirect?.redirect_type || 301}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value={301}>301 - Permanent Redirect</option>
                        <option value={302}>302 - Temporary Redirect</option>
                        <option value={307}>307 - Temporary Redirect (HTTP/1.1)</option>
                        <option value={308}>308 - Permanent Redirect (HTTP/1.1)</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_active"
                          defaultChecked={editingRedirect?.is_active ?? true}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm font-semibold text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingRedirect?.description || ''}
                      placeholder="Optional description for this redirect"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRedirectModal(false);
                        setEditingRedirect(null);
                      }}
                      className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                      {editingRedirect ? 'Update Redirect' : 'Create Redirect'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}