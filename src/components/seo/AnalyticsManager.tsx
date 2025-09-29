'use client';

import { useState } from 'react';
import { seoAnalyticsAPI, type AnalyticsData } from '@/lib/api/seo-analytics';

interface AnalyticsManagerProps {
  data: AnalyticsData[];
  token: string | null;
  onRefresh: () => void;
}

export default function AnalyticsManager({ data, token, onRefresh }: AnalyticsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AnalyticsData | null>(null);
  const [formData, setFormData] = useState({
    service: 'google_analytics' as 'google_analytics' | 'google_search_console' | 'facebook_pixel' | 'other',
    tracking_id: '',
    measurement_id: '',
    property_id: '',
    is_active: true,
    config: {} as Record<string, any>
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingItem) {
        await seoAnalyticsAPI.update(token, editingItem.id!, formData);
      } else {
        await seoAnalyticsAPI.add(token, formData);
      }
      onRefresh();
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save analytics data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      service: 'google_analytics',
      tracking_id: '',
      measurement_id: '',
      property_id: '',
      is_active: true,
      config: {}
    });
  };

  const handleEdit = (item: AnalyticsData) => {
    setEditingItem(item);
    setFormData({
      service: item.service,
      tracking_id: item.tracking_id,
      measurement_id: item.measurement_id || '',
      property_id: item.property_id || '',
      is_active: item.is_active,
      config: item.config
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Are you sure you want to delete this analytics configuration?')) return;
    try {
      await seoAnalyticsAPI.delete(token, id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete analytics data:', error);
    }
  };

  const testConnection = async () => {
    if (!token || !formData.tracking_id) return;
    try {
      const result = await seoAnalyticsAPI.testConnection(token, formData.service, formData.tracking_id);
      if (result.success) {
        alert('Connection test successful!');
      } else {
        alert(`Connection test failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to test connection:', error);
      alert('Failed to test connection');
    }
  };

  const generateTrackingCode = async () => {
    if (!token) return;
    try {
      const result = await seoAnalyticsAPI.generateTrackingCode(token, formData.service);
      // You could show this in a modal or copy to clipboard
      navigator.clipboard.writeText(result.code);
      alert('Tracking code copied to clipboard!');
    } catch (error) {
      console.error('Failed to generate tracking code:', error);
      alert('Failed to generate tracking code');
    }
  };

  const getServiceDisplayName = (service: string) => {
    switch (service) {
      case 'google_analytics': return 'Google Analytics (GA4)';
      case 'google_search_console': return 'Google Search Console';
      case 'facebook_pixel': return 'Facebook Pixel';
      default: return service;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'google_analytics': return '📊';
      case 'google_search_console': return '🔍';
      case 'facebook_pixel': return '📘';
      default: return '📈';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Analytics & Tracking</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            resetForm();
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Add Analytics
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Analytics Configuration' : 'Add New Analytics Configuration'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="google_analytics">Google Analytics (GA4)</option>
                  <option value="google_search_console">Google Search Console</option>
                  <option value="facebook_pixel">Facebook Pixel</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tracking ID</label>
                <input
                  type="text"
                  value={formData.tracking_id}
                  onChange={(e) => setFormData({...formData, tracking_id: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                />
              </div>
              {formData.service === 'google_analytics' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Measurement ID (GA4)</label>
                  <input
                    type="text"
                    value={formData.measurement_id}
                    onChange={(e) => setFormData({...formData, measurement_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              )}
              {formData.service === 'google_search_console' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property ID</label>
                  <input
                    type="text"
                    value={formData.property_id}
                    onChange={(e) => setFormData({...formData, property_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="sc-domain:example.com"
                  />
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={testConnection}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Test Connection
              </button>
              <button
                type="button"
                onClick={generateTrackingCode}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Generate Code
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {editingItem ? 'Update' : 'Add'} Analytics
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getServiceIcon(item.service)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{getServiceDisplayName(item.service)}</h3>
                  <p className="text-sm text-gray-500">ID: {item.tracking_id}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              {item.measurement_id && (
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Measurement ID:</span>
                  <span className="ml-2 text-gray-800">{item.measurement_id}</span>
                </div>
              )}
              {item.property_id && (
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Property ID:</span>
                  <span className="ml-2 text-gray-800">{item.property_id}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id!)}
                className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Configured</h3>
          <p className="text-gray-500 mb-6">Set up Google Analytics, Search Console, and other tracking services</p>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
              resetForm();
            }}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add Analytics
          </button>
        </div>
      )}

      {/* Analytics Setup Guide */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Analytics Setup Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">Google Analytics (GA4)</h5>
            <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
              <li>Create a GA4 property in Google Analytics</li>
              <li>Get your Measurement ID (G-XXXXXXXXXX)</li>
              <li>Add it to your tracking configuration</li>
              <li>Verify the connection is working</li>
            </ol>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">Google Search Console</h5>
            <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
              <li>Add your website to Search Console</li>
              <li>Verify ownership using HTML file or meta tag</li>
              <li>Submit your sitemap</li>
              <li>Monitor your search performance</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
