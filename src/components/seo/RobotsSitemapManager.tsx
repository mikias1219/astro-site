'use client';

import { useState } from 'react';
import { seoRobotsAPI, type RobotsData, type SitemapData } from '@/lib/api/seo-robots';

interface RobotsSitemapManagerProps {
  robotsData: RobotsData | null;
  sitemapData: SitemapData[];
  token: string | null;
  onRefresh: () => void;
}

export default function RobotsSitemapManager({ robotsData, sitemapData, token, onRefresh }: RobotsSitemapManagerProps) {
  const [activeTab, setActiveTab] = useState<'robots' | 'sitemap'>('robots');
  const [robotsContent, setRobotsContent] = useState(robotsData?.content || '');
  const [showSitemapForm, setShowSitemapForm] = useState(false);
  const [editingSitemap, setEditingSitemap] = useState<SitemapData | null>(null);
  const [sitemapFormData, setSitemapFormData] = useState({
    url: '',
    last_modified: new Date().toISOString().split('T')[0],
    change_frequency: 'weekly' as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: 0.5,
    page_type: '',
    include_images: false,
    include_categories: false,
    include_tags: false,
    is_active: true
  });

  const handleRobotsUpdate = async () => {
    if (!token) return;
    try {
      await seoRobotsAPI.updateRobots(token, robotsContent);
      alert('Robots.txt updated successfully!');
      onRefresh();
    } catch (error) {
      console.error('Failed to update robots.txt:', error);
      alert('Failed to update robots.txt');
    }
  };

  const handleSitemapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingSitemap) {
        await seoRobotsAPI.updateSitemapEntry(token, editingSitemap.id!, sitemapFormData);
      } else {
        await seoRobotsAPI.addSitemapEntry(token, sitemapFormData);
      }
      onRefresh();
      setShowSitemapForm(false);
      setEditingSitemap(null);
      resetSitemapForm();
    } catch (error) {
      console.error('Failed to save sitemap entry:', error);
    }
  };

  const resetSitemapForm = () => {
    setSitemapFormData({
      url: '',
      last_modified: new Date().toISOString().split('T')[0],
      change_frequency: 'weekly',
      priority: 0.5,
      page_type: '',
      include_images: false,
      include_categories: false,
      include_tags: false,
      is_active: true
    });
  };

  const handleEditSitemap = (item: SitemapData) => {
    setEditingSitemap(item);
    setSitemapFormData({
      url: item.url,
      last_modified: item.last_modified.split('T')[0],
      change_frequency: item.change_frequency,
      priority: item.priority,
      page_type: item.page_type,
      include_images: item.include_images,
      include_categories: item.include_categories,
      include_tags: item.include_tags,
      is_active: item.is_active
    });
    setShowSitemapForm(true);
  };

  const handleDeleteSitemap = async (id: number) => {
    if (!token || !confirm('Are you sure you want to delete this sitemap entry?')) return;
    try {
      await seoRobotsAPI.deleteSitemapEntry(token, id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete sitemap entry:', error);
    }
  };

  const generateSitemap = async () => {
    if (!token) return;
    try {
      const result = await seoRobotsAPI.generateSitemap(token);
      alert(`Sitemap generated successfully! URL: ${result.url}`);
    } catch (error) {
      console.error('Failed to generate sitemap:', error);
      alert('Failed to generate sitemap');
    }
  };

  const autoGenerateSitemap = async () => {
    if (!token) return;
    try {
      await seoRobotsAPI.autoGenerateSitemap(token);
      alert('Sitemap entries auto-generated successfully!');
      onRefresh();
    } catch (error) {
      console.error('Failed to auto-generate sitemap:', error);
      alert('Failed to auto-generate sitemap');
    }
  };

  const submitSitemap = async (searchEngine: 'google' | 'bing') => {
    if (!token) return;
    try {
      const result = await seoRobotsAPI.submitSitemap(token, searchEngine);
      if (result.success) {
        alert(`Sitemap submitted to ${searchEngine} successfully!`);
      } else {
        alert(`Failed to submit sitemap to ${searchEngine}: ${result.message}`);
      }
    } catch (error) {
      console.error(`Failed to submit sitemap to ${searchEngine}:`, error);
      alert(`Failed to submit sitemap to ${searchEngine}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Robots & Sitemap</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('robots')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'robots' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Robots.txt
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'sitemap' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sitemap
          </button>
        </div>
      </div>

      {activeTab === 'robots' && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Robots.txt Editor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Robots.txt Content</label>
                <textarea
                  value={robotsContent}
                  onChange={(e) => setRobotsContent(e.target.value)}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                  placeholder="User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleRobotsUpdate}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Update Robots.txt
                </button>
                <button
                  onClick={() => setRobotsContent(robotsData?.content || '')}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-md font-semibold text-blue-800 mb-2">Robots.txt Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use "User-agent: *" to apply rules to all crawlers</li>
              <li>• Use "Allow: /" to allow crawling of all content</li>
              <li>• Use "Disallow: /path/" to block specific directories</li>
              <li>• Include your sitemap URL at the bottom</li>
              <li>• Test your robots.txt with Google Search Console</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sitemap Management</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowSitemapForm(true);
                  setEditingSitemap(null);
                  resetSitemapForm();
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Entry
              </button>
              <button
                onClick={autoGenerateSitemap}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Auto Generate
              </button>
              <button
                onClick={generateSitemap}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Generate XML
              </button>
            </div>
          </div>

          {showSitemapForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">
                {editingSitemap ? 'Edit Sitemap Entry' : 'Add New Sitemap Entry'}
              </h4>
              <form onSubmit={handleSitemapSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                    <input
                      type="url"
                      value={sitemapFormData.url}
                      onChange={(e) => setSitemapFormData({...sitemapFormData, url: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/page"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Modified</label>
                    <input
                      type="date"
                      value={sitemapFormData.last_modified}
                      onChange={(e) => setSitemapFormData({...sitemapFormData, last_modified: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Frequency</label>
                    <select
                      value={sitemapFormData.change_frequency}
                      onChange={(e) => setSitemapFormData({...sitemapFormData, change_frequency: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="always">Always</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority (0.0 - 1.0)</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={sitemapFormData.priority}
                      onChange={(e) => setSitemapFormData({...sitemapFormData, priority: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Type</label>
                    <input
                      type="text"
                      value={sitemapFormData.page_type}
                      onChange={(e) => setSitemapFormData({...sitemapFormData, page_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="blog, product, page"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={sitemapFormData.is_active}
                      onChange={(e) => setSitemapFormData({...sitemapFormData, is_active: e.target.checked})}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include_images"
                      checked={sitemapFormData.include_images}
                      onChange={(e) => setSitemapFormData({...sitemapFormData, include_images: e.target.checked})}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include_images" className="ml-2 block text-sm text-gray-900">
                      Include Images
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include_categories"
                      checked={sitemapFormData.include_categories}
                      onChange={(e) => setSitemapFormData({...sitemapFormData, include_categories: e.target.checked})}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include_categories" className="ml-2 block text-sm text-gray-900">
                      Include Categories
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include_tags"
                      checked={sitemapFormData.include_tags}
                      onChange={(e) => setSitemapFormData({...sitemapFormData, include_tags: e.target.checked})}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include_tags" className="ml-2 block text-sm text-gray-900">
                      Include Tags
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    {editingSitemap ? 'Update' : 'Add'} Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSitemapForm(false);
                      setEditingSitemap(null);
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sitemapData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.url}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.last_modified.split('T')[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{item.change_frequency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.priority}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSitemap(item)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSitemap(item.id!)}
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

          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="text-md font-semibold text-green-800 mb-4">Submit to Search Engines</h4>
            <div className="flex space-x-4">
              <button
                onClick={() => submitSitemap('google')}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit to Google
              </button>
              <button
                onClick={() => submitSitemap('bing')}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Submit to Bing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
