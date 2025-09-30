'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { seoMetaAPI, type SEOMetaData } from '@/lib/api/seo-meta';
import { seoSchemaAPI, type SchemaData } from '@/lib/api/seo-schema';
import { seoUrlsAPI, type URLData } from '@/lib/api/seo-urls';
import { seoRobotsAPI, type RobotsData, type SitemapData } from '@/lib/api/seo-robots';
import { seoAnalyticsAPI, type AnalyticsData } from '@/lib/api/seo-analytics';
import { seoImagesAPI, type ImageData } from '@/lib/api/seo-images';
import { seoPerformanceAPI, type PerformanceSettings } from '@/lib/api/seo-performance';
import { seoRedirectsAPI, type RedirectData } from '@/lib/api/seo-redirects';
import SchemaManager from '@/components/seo/SchemaManager';
import URLManager from '@/components/seo/URLManager';
import RobotsSitemapManager from '@/components/seo/RobotsSitemapManager';
import AnalyticsManager from '@/components/seo/AnalyticsManager';
import ImageOptimizationManager from '@/components/seo/ImageOptimizationManager';
import PerformanceManager from '@/components/seo/PerformanceManager';
import RedirectManager from '@/components/seo/RedirectManager';

type ActiveTab = 'meta' | 'schema' | 'urls' | 'robots' | 'analytics' | 'images' | 'performance' | 'redirects';

export default function AdminSEOPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('meta');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Data states
  const [seoMetaData, setSeoMetaData] = useState<SEOMetaData[]>([]);
  const [schemaData, setSchemaData] = useState<SchemaData[]>([]);
  const [urlData, setUrlData] = useState<URLData[]>([]);
  const [robotsData, setRobotsData] = useState<RobotsData | null>(null);
  const [sitemapData, setSitemapData] = useState<SitemapData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettings | null>(null);
  const [redirectData, setRedirectData] = useState<RedirectData[]>([]);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    if (token) {
      fetchAllData(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchAllData = async (authToken: string) => {
    try {
      setLoading(true);
      await Promise.all([
        fetchSEOMetaData(authToken),
        fetchSchemaData(authToken),
        fetchUrlData(authToken),
        fetchRobotsData(authToken),
        fetchSitemapData(authToken),
        fetchAnalyticsData(authToken),
        fetchImageData(authToken),
        fetchPerformanceSettings(authToken),
        fetchRedirectData(authToken)
      ]);
      setError(null);
    } catch (error) {
      setError('Failed to fetch SEO data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSEOMetaData = async (authToken: string) => {
    try {
      const data = await seoMetaAPI.getAll(authToken);
      setSeoMetaData(data);
    } catch (error) {
      console.error('Failed to fetch SEO meta data:', error);
    }
  };

  const fetchSchemaData = async (authToken: string) => {
    try {
      const data = await seoSchemaAPI.getAll(authToken);
      setSchemaData(data);
    } catch (error) {
      console.error('Failed to fetch schema data:', error);
    }
  };

  const fetchUrlData = async (authToken: string) => {
    try {
      const data = await seoUrlsAPI.getAll(authToken);
      setUrlData(data);
    } catch (error) {
      console.error('Failed to fetch URL data:', error);
    }
  };

  const fetchRobotsData = async (authToken: string) => {
    try {
      const data = await seoRobotsAPI.getRobots(authToken);
      setRobotsData({ content: data.content } as any);
    } catch (error) {
      console.error('Failed to fetch robots data:', error);
    }
  };

  const fetchSitemapData = async (authToken: string) => {
    try {
      const data = await seoRobotsAPI.getSitemapEntries(authToken);
      setSitemapData(data);
    } catch (error) {
      console.error('Failed to fetch sitemap data:', error);
    }
  };

  const fetchAnalyticsData = async (authToken: string) => {
    try {
      const data = await seoAnalyticsAPI.getAll(authToken);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  const fetchImageData = async (authToken: string) => {
    try {
      const data = await seoImagesAPI.getAll(authToken);
      setImageData(data);
    } catch (error) {
      console.error('Failed to fetch image data:', error);
    }
  };

  const fetchPerformanceSettings = async (authToken: string) => {
    try {
      const data = await seoPerformanceAPI.getSettings(authToken);
      setPerformanceSettings(data);
    } catch (error) {
      console.error('Failed to fetch performance settings:', error);
    }
  };

  const fetchRedirectData = async (authToken: string) => {
    try {
      const data = await seoRedirectsAPI.getAll(authToken);
      setRedirectData(data);
    } catch (error) {
      console.error('Failed to fetch redirect data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading SEO Manager</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading SEO Manager</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'meta', name: 'Basic Meta Options', icon: '📝' },
    { id: 'schema', name: 'Structured Data', icon: '🏗️' },
    { id: 'urls', name: 'URL & Canonical', icon: '🔗' },
    { id: 'robots', name: 'Robots & Sitemap', icon: '🤖' },
    { id: 'analytics', name: 'Analytics & Tracking', icon: '📊' },
    { id: 'images', name: 'Image Optimization', icon: '🖼️' },
    { id: 'performance', name: 'Performance', icon: '⚡' },
    { id: 'redirects', name: 'Redirect Manager', icon: '🔄' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SEO Manager</h1>
          <p className="text-gray-600">Comprehensive SEO management for your astrology website</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SEO Pages</p>
                <p className="text-3xl font-bold text-gray-900">{seoMetaData.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Schema Markups</p>
                <p className="text-3xl font-bold text-gray-900">{schemaData.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Optimized Images</p>
                <p className="text-3xl font-bold text-gray-900">{imageData.filter(img => img.is_optimized).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Redirects</p>
                <p className="text-3xl font-bold text-gray-900">{redirectData.filter(r => r.is_active).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'meta' && (
            <BasicMetaOptions 
              data={seoMetaData}
              token={token}
              onRefresh={() => token && fetchSEOMetaData(token)}
            />
          )}
          {activeTab === 'schema' && (
            <SchemaManager 
              data={schemaData}
              token={token}
              onRefresh={() => token && fetchSchemaData(token)}
            />
          )}
          {activeTab === 'urls' && (
            <URLManager 
              data={urlData}
              token={token}
              onRefresh={() => token && fetchUrlData(token)}
            />
          )}
          {activeTab === 'robots' && (
            <RobotsSitemapManager 
              robotsData={robotsData}
              sitemapData={sitemapData}
              token={token}
              onRefresh={() => token && Promise.all([fetchRobotsData(token), fetchSitemapData(token)])}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsManager 
              data={analyticsData}
              token={token}
              onRefresh={() => token && fetchAnalyticsData(token)}
            />
          )}
          {activeTab === 'images' && (
            <ImageOptimizationManager 
              data={imageData}
              token={token}
              onRefresh={() => token && fetchImageData(token)}
            />
          )}
          {activeTab === 'performance' && (
            <PerformanceManager 
              settings={performanceSettings}
              token={token}
              onRefresh={() => token && fetchPerformanceSettings(token)}
            />
          )}
          {activeTab === 'redirects' && (
            <RedirectManager 
              data={redirectData}
              token={token}
              onRefresh={() => token && fetchRedirectData(token)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Basic Meta Options Component
function BasicMetaOptions({ data, token, onRefresh }: { data: SEOMetaData[], token: string | null, onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SEOMetaData | null>(null);
  const [formData, setFormData] = useState({
    page_url: '',
    title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    robots: 'index, follow'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingItem) {
        await seoMetaAPI.update(token, editingItem.id!, formData);
      } else {
        await seoMetaAPI.create(token, formData);
      }
      onRefresh();
      setShowForm(false);
      setEditingItem(null);
      setFormData({
        page_url: '',
        title: '',
        meta_description: '',
        meta_keywords: '',
        canonical_url: '',
        robots: 'index, follow'
      });
    } catch (error) {
      console.error('Failed to save meta data:', error);
    }
  };

  const handleEdit = (item: SEOMetaData) => {
    setEditingItem(item);
    setFormData({
      page_url: item.page_url,
      title: item.title,
      meta_description: item.meta_description,
      meta_keywords: item.meta_keywords,
      canonical_url: item.canonical_url || '',
      robots: item.robots || 'index, follow'
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Are you sure you want to delete this meta data?')) return;
    try {
      await seoMetaAPI.delete(token, id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete meta data:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Basic Meta Options</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            setFormData({
              page_url: '',
              title: '',
              meta_description: '',
              meta_keywords: '',
              canonical_url: '',
              robots: 'index, follow'
            });
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Add Meta Data
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Meta Data' : 'Add New Meta Data'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page URL</label>
                <input
                  type="text"
                  value={formData.page_url}
                  onChange={(e) => setFormData({...formData, page_url: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="/about"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Page Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Meta description (max 160 characters)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                <input
                  type="url"
                  value={formData.canonical_url}
                  onChange={(e) => setFormData({...formData, canonical_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/page"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Robots</label>
                <select
                  value={formData.robots}
                  onChange={(e) => setFormData({...formData, robots: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="index, follow">Index, Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, follow">No Index, Follow</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {editingItem ? 'Update' : 'Add'} Meta Data
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.page_url}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.meta_description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.meta_description && item.meta_keywords ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.meta_description && item.meta_keywords ? 'Optimized' : 'Needs Work'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
