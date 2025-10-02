'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  anchor_text?: string;
  anchor_link?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    meta_keywords: '',
    anchor_text: '',
    anchor_link: '',
    is_published: false
  });

  useEffect(() => {
    if (token) {
      fetchPages(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchPages = async (authToken: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/pages?published_only=false', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data);
        setError(null);
      } else {
        setError('Failed to fetch pages');
      }
    } catch (error) {
      setError('Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const url = editingPage 
        ? `http://localhost:8000/api/pages/${editingPage.id}`
        : 'http://localhost:8000/api/pages';
      
      const method = editingPage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchPages(token);
        setShowAddForm(false);
        setEditingPage(null);
        setFormData({
          title: '',
          slug: '',
          content: '',
          meta_description: '',
          meta_keywords: '',
          anchor_text: '',
          anchor_link: '',
          is_published: false
        });
      } else {
        setError('Failed to save page');
      }
    } catch (error) {
      setError('Failed to save page');
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      anchor_text: page.anchor_text || '',
      anchor_link: page.anchor_link || '',
      is_published: page.is_published
    });
    setShowAddForm(true);
  };

  const handleDelete = async (pageId: number) => {
    if (!token || !confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchPages(token);
      } else {
        setError('Failed to delete page');
      }
    } catch (error) {
      setError('Failed to delete page');
    }
  };

  const togglePageStatus = async (pageId: number, currentStatus: boolean) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_published: !currentStatus })
      });

      if (response.ok) {
        await fetchPages(token);
      } else {
        setError('Failed to update page status');
      }
    } catch (error) {
      setError('Failed to update page status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Pages</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pages Management</h1>
            <p className="text-gray-600">Manage website pages and content</p>
          </div>
          <button
            onClick={() => {
            setShowAddForm(true);
            setEditingPage(null);
            setFormData({
              title: '',
              slug: '',
              content: '',
              meta_description: '',
              meta_keywords: '',
              anchor_text: '',
              anchor_link: '',
              is_published: false
            });
          }}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Add New Page
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pages</p>
                <p className="text-3xl font-bold text-gray-900">{pages.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-gray-900">{pages.filter(p => p.is_published).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">{pages.filter(p => !p.is_published).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Page Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingPage ? 'Edit Page' : 'Add New Page'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter page title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter URL slug (e.g., about-us)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter meta description for SEO"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter keywords separated by commas"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Anchor Text (Internal Linking)</label>
                  <input
                    type="text"
                    value={formData.anchor_text}
                    onChange={(e) => setFormData({...formData, anchor_text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Best Astrologer in Kolkata"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link To (URL)</label>
                  <input
                    type="text"
                    value={formData.anchor_link}
                    onChange={(e) => setFormData({...formData, anchor_link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="/services/consultation"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter page content (HTML supported)"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  {editingPage ? 'Update Page' : 'Add Page'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPage(null);
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pages Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anchor Text
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500">{page.meta_description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">/{page.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      {page.anchor_text ? (
                        <div className="text-sm">
                          <div className="font-medium text-blue-600">{page.anchor_text}</div>
                          <div className="text-gray-500 text-xs">→ {page.anchor_link}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No anchor text</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePageStatus(page.id, page.is_published)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          page.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {page.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
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

        {pages.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first page.</p>
          </div>
        )}
      </div>
    </div>
  );
}

