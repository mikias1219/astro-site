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
    page_url: '',
    custom_slug: '',
    canonical_url: '',
    redirect_from: [] as string[],
    redirect_to: '',
    redirect_type: 301 as 301 | 302,
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingItem) {
        await seoUrlsAPI.update(token, editingItem.id!, formData);
      } else {
        await seoUrlsAPI.create(token, formData);
      }
      onRefresh();
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save URL data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      page_url: '',
      custom_slug: '',
      canonical_url: '',
      redirect_from: [],
      redirect_to: '',
      redirect_type: 301,
      is_active: true
    });
  };

  const handleEdit = (item: URLData) => {
    setEditingItem(item);
    setFormData({
      page_url: item.page_url,
      custom_slug: item.custom_slug,
      canonical_url: item.canonical_url,
      redirect_from: item.redirect_from || [],
      redirect_to: item.redirect_to || '',
      redirect_type: item.redirect_type || 301,
      is_active: item.is_active
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
    if (!token || !formData.page_url) return;
    try {
      const result = await seoUrlsAPI.generateSlug(token, formData.page_url, formData.page_url);
      setFormData(prev => ({ ...prev, custom_slug: result.slug }));
    } catch (error) {
      console.error('Failed to generate slug:', error);
    }
  };

  const checkSlugAvailability = async () => {
    if (!token || !formData.custom_slug) return;
    try {
      const result = await seoUrlsAPI.checkSlugAvailability(token, formData.custom_slug);
      if (result.available) {
        alert('Slug is available!');
      } else {
        alert('Slug is already taken. Please choose a different one.');
      }
    } catch (error) {
      console.error('Failed to check slug availability:', error);
    }
  };

  const addRedirectFrom = () => {
    setFormData(prev => ({
      ...prev,
      redirect_from: [...prev.redirect_from, '']
    }));
  };

  const updateRedirectFrom = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      redirect_from: prev.redirect_from.map((item, idx) => idx === index ? value : item)
    }));
  };

  const removeRedirectFrom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      redirect_from: prev.redirect_from.filter((_, idx) => idx !== index)
    }));
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Slug</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.custom_slug}
                    onChange={(e) => setFormData({...formData, custom_slug: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="custom-slug"
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
                <input
                  type="url"
                  value={formData.canonical_url}
                  onChange={(e) => setFormData({...formData, canonical_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/page"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Redirect To</label>
                <input
                  type="url"
                  value={formData.redirect_to}
                  onChange={(e) => setFormData({...formData, redirect_to: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/new-page"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Redirect Type</label>
                <select
                  value={formData.redirect_type}
                  onChange={(e) => setFormData({...formData, redirect_type: parseInt(e.target.value) as 301 | 302})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={301}>301 - Permanent Redirect</option>
                  <option value={302}>302 - Temporary Redirect</option>
                </select>
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Redirect From URLs</label>
              <div className="space-y-2">
                {formData.redirect_from.map((url, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateRedirectFrom(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/old-page"
                    />
                    <button
                      type="button"
                      onClick={() => removeRedirectFrom(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRedirectFrom}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Redirect From URL
                </button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custom Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canonical URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Redirects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.page_url}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.custom_slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.canonical_url}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.redirect_from?.length || 0} redirects
                </td>
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
