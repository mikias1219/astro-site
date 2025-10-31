'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  anchor_text?: string;
  anchor_link?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author_id?: number;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesPerPage] = useState(10);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    anchor_text: '',
    anchor_link: '',
    is_active: true
  });

  useEffect(() => {
    if (token && !loading && !fetching) {
      fetchPages(token);
    } else if (!token) {
      setLoading(false);
    }
  }, [token]);

  const fetchPages = async (authToken: string) => {
    if (fetching) return; // Prevent multiple simultaneous calls

    setFetching(true);
    try {
      // Use relative path - will be proxied by Next.js rewrites
      const apiUrl = '/api/admin/pages';

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPages(Array.isArray(data) ? data : []);
        setError(null);
      } else {
        setError('Failed to fetch pages');
        setPages([]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError('Failed to fetch pages');
      setPages([]);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      // Use relative path - will be proxied by Next.js rewrites
      const baseUrl = '/api/admin/pages';

      const url = editingPage
        ? `${baseUrl}/${editingPage.id}`
        : baseUrl;

      const method = editingPage ? 'PUT' : 'POST';

      // Prepare the data for the API
      const submitData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || (formData.content ? formData.content.substring(0, 200) + '...' : ''),
        anchor_text: formData.anchor_text || null,
        anchor_link: formData.anchor_link || null,
        is_published: formData.is_active
      };

      console.log('Submitting page data:', submitData);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Page saved successfully:', result);
        await fetchPages(token);
        setShowAddForm(false);
        setEditingPage(null);
        resetForm();
        alert('✅ Page saved successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to save page:', errorData);
        setError(`Failed to save page: ${errorData.detail || 'Unknown error'}`);
        alert(`❌ Failed to save page: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving page:', error);
      setError('Failed to save page');
      alert('❌ Failed to save page. Please check your connection.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      anchor_text: '',
      anchor_link: '',
      is_active: true
    });
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt || '',
      anchor_text: page.anchor_text || '',
      anchor_link: page.anchor_link || '',
      is_active: page.is_published
    });
    setShowAddForm(true);
  };

  const handleDelete = async (pageId: number) => {
    if (!token || !confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;

    try {
      // Use relative path - will be proxied by Next.js rewrites
      const baseUrl = '/api/admin/pages';

      const response = await fetch(`${baseUrl}/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchPages(token);
        alert('✅ Page deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(`Failed to delete page: ${errorData.detail || 'Unknown error'}`);
        alert(`❌ Failed to delete page: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      setError('Failed to delete page');
      alert('❌ Failed to delete page. Please check your connection.');
    }
  };

  const togglePageStatus = async (pageId: number, currentStatus: boolean) => {
    if (!token) return;

    try {
      // Use relative path - will be proxied by Next.js rewrites
      const baseUrl = '/api/admin/pages';

      const response = await fetch(`${baseUrl}/${pageId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchPages(token);
        alert(`✅ Page ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(`Failed to update page status: ${errorData.detail || 'Unknown error'}`);
        alert(`❌ Failed to update page status: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating page status:', error);
      setError('Failed to update page status');
      alert('❌ Failed to update page status. Please check your connection.');
    }
  };

  // Filter and search pages
  const filteredPages = pages.filter(page => {
    const searchLower = searchTerm?.toLowerCase() || '';
    const titleLower = page.title?.toLowerCase() || '';
    const slugLower = page.slug?.toLowerCase() || '';
    const contentLower = page.content?.toLowerCase() || '';

    const matchesSearch = titleLower.includes(searchLower) ||
                         slugLower.includes(searchLower) ||
                         contentLower.includes(searchLower);

    return matchesSearch;
  });

  // Pagination
  const indexOfLastPage = currentPage * pagesPerPage;
  const indexOfFirstPage = indexOfLastPage - pagesPerPage;
  const currentPages = filteredPages.slice(indexOfFirstPage, indexOfLastPage);
  const totalPages = Math.ceil(filteredPages.length / pagesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">📄 Pages Management</h1>
              <p className="text-gray-600">Create and manage website pages with SEO optimization</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                ➕ Create New Page
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-blue-600">{pages.length}</span>
            </div>
            <h3 className="font-semibold text-blue-900 mb-1">Total Pages</h3>
            <p className="text-sm text-blue-700">All website pages</p>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-green-600">{pages.filter(p => p.is_published).length}</span>
            </div>
            <h3 className="font-semibold text-green-900 mb-1">Published Pages</h3>
            <p className="text-sm text-green-700">Live on website</p>
          </div>

          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m4 0H8l.5 16h7L16 4z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-purple-600">{pages.filter(p => !p.is_published).length}</span>
            </div>
            <h3 className="font-semibold text-purple-900 mb-1">Draft Pages</h3>
            <p className="text-sm text-purple-700">Not yet published</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search pages by title, slug, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute left-4 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredPages.length} of {pages.length} pages
            </div>
          </div>
        </div>

        {/* Add/Edit Page Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {editingPage ? '✏️ Edit Page' : '✨ Create New Page'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingPage(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter page title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug *</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="about-us"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt (Optional)</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={3}
                      placeholder="Brief description of the page (auto-generated from content if left empty)"
                    />
                    <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length} characters</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Anchor Text (Optional)</label>
                      <input
                        type="text"
                        value={formData.anchor_text}
                        onChange={(e) => setFormData({ ...formData, anchor_text: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Text for internal linking"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Anchor Link (Optional)</label>
                      <input
                        type="url"
                        value={formData.anchor_link}
                        onChange={(e) => setFormData({ ...formData, anchor_link: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://astroarupshastri.com/related-page"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Page Content *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={12}
                      placeholder="Write your page content here... (supports HTML and Markdown)"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-3 text-sm font-medium text-gray-700">
                        {formData.is_active ? '✅ Page is active' : '🚫 Page is inactive'}
                      </label>
                    </div>
                    <div className="text-sm text-gray-500">
                      {editingPage ? 'Update existing page' : 'Create new page'}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingPage(null);
                        resetForm();
                      }}
                      className="px-8 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      {editingPage ? '💾 Update Page' : '🚀 Publish Page'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Pages Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Page</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">SEO</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500 font-mono">/{page.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          {page.excerpt ? (
                            <span className="text-green-600">✓ Excerpt</span>
                          ) : (
                            <span className="text-gray-400">○ Excerpt</span>
                          )}
                        </div>
                        <div className="flex items-center text-xs">
                          {page.anchor_text ? (
                            <span className="text-green-600">✓ Anchor</span>
                          ) : (
                            <span className="text-gray-400">○ Anchor</span>
                          )}
                        </div>
                        <div className="flex items-center text-xs">
                          {page.anchor_link ? (
                            <span className="text-green-600">✓ Link</span>
                          ) : (
                            <span className="text-gray-400">○ Link</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePageStatus(page.id, page.is_published)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                          page.is_published
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {page.is_published ? '✅ Published' : '🚫 Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Edit Page"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => togglePageStatus(page.id, page.is_published)}
                          className={`p-2 rounded-lg transition-colors ${
                            page.is_published
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={page.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {page.is_published ? '📥' : '📤'}
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Page"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstPage + 1} to {Math.min(indexOfLastPage, filteredPages.length)} of {filteredPages.length} pages
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        currentPage === number
                          ? 'bg-indigo-500 text-white border-indigo-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {pages.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first page.</p>
          </div>
        )}
      </div>
    </div>
  );
}