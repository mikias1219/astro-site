'use client';

import { useState } from 'react';
import { seoUrlsAPI, type URLData } from '@/lib/api/seo-urls';

interface URLManagerProps {
  data: URLData[];
  token: string | null;
  onRefresh: () => void;
}

export default function URLManager({ data, token, onRefresh }: URLManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<URLData | null>(null);
  const [formData, setFormData] = useState({
    original_url: '',
    optimized_url: '',
    canonical_url: '',
    url_status: 'active' as 'active' | 'redirect' | 'broken'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingItem) {
        await seoUrlsAPI.update(token, editingItem.id!, formData);
        onRefresh();
        setShowForm(false);
        setEditingItem(null);
        resetForm();
      } else {
        await seoUrlsAPI.create(token, formData);
        onRefresh();
        setShowForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save URL data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      original_url: '',
      optimized_url: '',
      canonical_url: '',
      url_status: 'active'
    });
  };

  const handleEdit = (item: URLData) => {
    setEditingItem(item);
    setFormData({
      original_url: item.original_url || item.page_url || '',
      optimized_url: item.optimized_url || item.custom_slug || '',
      canonical_url: item.canonical_url || '',
      url_status: item.url_status
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Are you sure you want to delete this URL data?')) return;
    try {
      await seoUrlsAPI.delete(token, id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete URL data:', error);
    }
  };

  const generateSlug = async () => {
    if (!token || !formData.original_url) return;
    try {
      const { slug } = await seoUrlsAPI.generateSlug(token, formData.original_url);
      setFormData(prev => ({ ...prev, optimized_url: slug }));
    } catch (error) {
      console.error('Failed to generate slug:', error);
    }
  };

  const checkSlugAvailability = async () => {
    if (!token || !formData.optimized_url) return;
    try {
      const { available } = await seoUrlsAPI.checkSlug(token, formData.optimized_url);
      alert(available ? 'Slug is available ✅' : 'Slug is already taken ❌');
    } catch (error) {
      console.error('Failed to check slug availability:', error);
    }
  };

  const saveCanonical = async () => {
    if (!token || !formData.original_url || !formData.canonical_url) return;
    try {
      await seoUrlsAPI.setCanonical(token, formData.original_url, formData.canonical_url);
      alert('Canonical URL saved');
      onRefresh();
    } catch (error) {
      console.error('Failed to set canonical URL:', error);
      alert('Failed to set canonical URL');
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">URL & Canonical Control</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            resetForm();
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Add URL Configuration
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit URL Configuration' : 'Add New URL Configuration'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original URL</label>
                <input
                  type="text"
                  value={formData.original_url}
                  onChange={(e) => setFormData({...formData, original_url: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="/about"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Optimized URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.optimized_url}
                    onChange={(e) => setFormData({...formData, optimized_url: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="optimized-url"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={checkSlugAvailability}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Check
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={formData.canonical_url}
                    onChange={(e) => setFormData({...formData, canonical_url: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/page"
                  />
                  <button
                    type="button"
                    onClick={saveCanonical}
                    className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Status</label>
                <select
                  value={formData.url_status}
                  onChange={(e) => setFormData({...formData, url_status: e.target.value as 'active' | 'redirect' | 'broken'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="active">Active</option>
                  <option value="redirect">Redirect</option>
                  <option value="broken">Broken</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {editingItem ? 'Update' : 'Add'} URL Configuration
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimized URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEO Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.original_url}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.optimized_url || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.url_status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.seo_score || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
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
