'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../../components/Header';
import { SEOAnalyzer } from '../../../components/SEOAnalyzer';
import { apiClient } from '../../../lib/api';

interface SEOMetrics {
  totalPages: number;
  totalBlogs: number;
  pagesWithSEO: number;
  blogsWithSEO: number;
  averageSEOScore: number;
  topPerformingPages: any[];
  pagesNeedingAttention: any[];
}

export default function SEOAdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analyzer' | 'optimization'>('overview');
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // SEO Analyzer state
  const [analyzerContent, setAnalyzerContent] = useState('');
  const [analyzerTitle, setAnalyzerTitle] = useState('');
  const [analyzerDescription, setAnalyzerDescription] = useState('');
  const [analyzerKeywords, setAnalyzerKeywords] = useState<string[]>([]);

  useEffect(() => {
    fetchSEOMetrics();
  }, []);

  const fetchSEOMetrics = async () => {
    try {
      // This would be a new API endpoint for SEO metrics
      // For now, we'll use placeholder data
      setMetrics({
        totalPages: 15,
        totalBlogs: 45,
        pagesWithSEO: 12,
        blogsWithSEO: 38,
        averageSEOScore: 75,
        topPerformingPages: [],
        pagesNeedingAttention: []
      });
    } catch (error) {
      console.error('Failed to fetch SEO metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordInput = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    setAnalyzerKeywords(keywords);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading SEO Dashboard</h2>
            <p className="text-gray-600">Please wait while we load your SEO data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">SEO Management</h1>
            <p className="text-gray-600">Optimize your content for better search engine rankings</p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'analyzer', label: 'SEO Analyzer', icon: '🔍' },
                { id: 'optimization', label: 'Optimization', icon: '⚡' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* SEO Metrics Cards */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Pages</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics?.totalPages}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics?.totalBlogs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">SEO Score</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics?.averageSEOScore}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metrics ? metrics.totalPages + metrics.totalBlogs - metrics.pagesWithSEO - metrics.blogsWithSEO : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analyzer' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Content Analysis</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={analyzerTitle}
                      onChange={(e) => setAnalyzerTitle(e.target.value)}
                      placeholder="Enter your page title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={analyzerDescription}
                      onChange={(e) => setAnalyzerDescription(e.target.value)}
                      placeholder="Enter meta description..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={analyzerKeywords.join(', ')}
                      onChange={(e) => handleKeywordInput(e.target.value)}
                      placeholder="astrology, horoscope, vedic..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={analyzerContent}
                      onChange={(e) => setAnalyzerContent(e.target.value)}
                      placeholder="Paste your content here..."
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Analysis Results */}
              <div>
                <SEOAnalyzer
                  content={analyzerContent}
                  title={analyzerTitle}
                  metaDescription={analyzerDescription}
                  keywords={analyzerKeywords}
                />
              </div>
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">SEO Optimization Tips</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">On-Page SEO</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Use target keywords in title, headings, and content
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Write compelling meta descriptions (120-160 chars)
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Optimize images with alt text and compression
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Use proper heading hierarchy (H1, H2, H3)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical SEO</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">🔧</span>
                        Ensure mobile-friendly responsive design
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">🔧</span>
                        Implement proper URL structure
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">🔧</span>
                        Add structured data (JSON-LD) for rich snippets
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">🔧</span>
                        Optimize page loading speed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Generate Meta Tags
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                    Check Broken Links
                  </button>
                  <button className="bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                    Sitemap Generator
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}