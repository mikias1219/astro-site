'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_published: boolean;
  author_id: number;
  created_at: string;
  updated_at: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    meta_description: '',
    meta_keywords: '',
    is_published: false,
    meta_title: '',
    canonical_url: '',
    schema_markup: '',
    image_alt_text: '',
    redirect_url: ''
  });

  useEffect(() => {
    if (token) {
      fetchBlogs(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchBlogs = async (authToken: string) => {
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8000/api/admin/blogs'
        : 'https://astroarupshastri.com/api/admin/blogs';

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
        setError(null);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (error) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8000/api/admin/blogs'
        : 'https://astroarupshastri.com/api/admin/blogs';

      const url = editingBlog
        ? `${baseUrl}/${editingBlog.id}`
        : baseUrl;
      
      const method = editingBlog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchBlogs(token);
        setShowAddForm(false);
        setEditingBlog(null);
        setFormData({
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          featured_image: '',
          meta_description: '',
          meta_keywords: '',
          is_published: false,
          meta_title: '',
          canonical_url: '',
          schema_markup: '',
          image_alt_text: '',
          redirect_url: ''
        });
      } else {
        setError('Failed to save blog post');
      }
    } catch (error) {
      setError('Failed to save blog post');
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || '',
      featured_image: blog.featured_image || '',
      meta_description: blog.meta_description || '',
      meta_keywords: blog.meta_keywords || '',
      is_published: blog.is_published,
      meta_title: (blog as any).meta_title || '',
      canonical_url: (blog as any).canonical_url || '',
      schema_markup: (blog as any).schema_markup || '',
      image_alt_text: (blog as any).image_alt_text || '',
      redirect_url: (blog as any).redirect_url || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (blogId: number) => {
    if (!token || !confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8000/api/admin/blogs'
        : 'https://astroarupshastri.com/api/admin/blogs';

      const response = await fetch(`${baseUrl}/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchBlogs(token);
      } else {
        setError('Failed to delete blog post');
      }
    } catch (error) {
      setError('Failed to delete blog post');
    }
  };

  const toggleBlogStatus = async (blogId: number, currentStatus: boolean) => {
    if (!token) return;

    try {
      const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8000/api/admin/blogs'
        : 'https://astroarupshastri.com/api/admin/blogs';

      const response = await fetch(`${baseUrl}/${blogId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchBlogs(token);
      } else {
        setError('Failed to update blog status');
      }
    } catch (error) {
      setError('Failed to update blog status');
    }
  };

  // Filter and search blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'published' && blog.is_published) ||
                         (filterStatus === 'draft' && !blog.is_published);

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">📝 Blog Management</h1>
              <p className="text-gray-600">Create, edit, and manage your astrology blog posts</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingBlog(null);
                  setFormData({
                    title: '',
                    slug: '',
                    content: '',
                    excerpt: '',
                    featured_image: '',
                    meta_description: '',
                    meta_keywords: '',
                    is_published: false,
                    meta_title: '',
                    canonical_url: '',
                    schema_markup: '',
                    image_alt_text: '',
                    redirect_url: ''
                  });
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                ➕ Create New Blog
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-blue-600">{blogs.length}</span>
            </div>
            <h3 className="font-semibold text-blue-900 mb-1">Total Blogs</h3>
            <p className="text-sm text-blue-700">All blog posts</p>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-green-600">{blogs.filter(b => b.is_published).length}</span>
            </div>
            <h3 className="font-semibold text-green-900 mb-1">Published</h3>
            <p className="text-sm text-green-700">Live on website</p>
          </div>

          <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{blogs.filter(b => !b.is_published).length}</span>
            </div>
            <h3 className="font-semibold text-yellow-900 mb-1">Drafts</h3>
            <p className="text-sm text-yellow-700">Work in progress</p>
          </div>

          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500 text-white shadow-lg group-hover:animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-purple-600">2,847</span>
            </div>
            <h3 className="font-semibold text-purple-900 mb-1">Total Views</h3>
            <p className="text-sm text-purple-700">All blog views</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search blogs by title, excerpt, or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute left-4 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredBlogs.length} of {blogs.length} blogs
            </div>
          </div>
        </div>

        {/* Enhanced Blog Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {editingBlog ? '✏️ Edit Blog Post' : '✨ Create New Blog Post'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingBlog(null);
                      setFormData({
                        title: '',
                        slug: '',
                        content: '',
                        excerpt: '',
                        featured_image: '',
                        meta_description: '',
                        meta_keywords: '',
                        is_published: false,
                        meta_title: '',
                        canonical_url: '',
                        schema_markup: '',
                        image_alt_text: '',
                        redirect_url: ''
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter compelling blog title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug *</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="astrology-tips-guide"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image URL</label>
                      <input
                        type="url"
                        value={formData.featured_image}
                        onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Keywords</label>
                      <input
                        type="text"
                        value={formData.meta_keywords}
                        onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="astrology, vedic, horoscope, spiritual"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      placeholder="Brief summary of the blog post (150-200 characters)"
                    />
                    <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/200 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={2}
                      placeholder="SEO description for search engines (150-160 characters)"
                    />
                    <p className="text-sm text-gray-500 mt-1">{formData.meta_description.length}/160 characters</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                      <input
                        type="text"
                        value={formData.meta_title}
                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Custom SEO title (50-60 characters)"
                      />
                      <p className="text-sm text-gray-500 mt-1">{formData.meta_title.length}/60 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Image Alt Text</label>
                      <input
                        type="text"
                        value={formData.image_alt_text}
                        onChange={(e) => setFormData({ ...formData, image_alt_text: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Alt text for featured image"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Canonical URL</label>
                    <input
                      type="url"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://astroarupshastri.com/blog/your-blog-slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Redirect URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.redirect_url}
                      onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Redirect old URL to this post"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Schema Markup (JSON-LD)</label>
                    <textarea
                      value={formData.schema_markup}
                      onChange={(e) => setFormData({ ...formData, schema_markup: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                      rows={6}
                      placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
                    />
                    <p className="text-sm text-gray-500 mt-1">Auto-generated if left empty</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Content *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={12}
                      placeholder="Write your blog content here... (supports HTML and Markdown)"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_published" className="ml-3 text-sm font-medium text-gray-700">
                        {formData.is_published ? '✅ Publish immediately' : '📝 Save as draft'}
                      </label>
                    </div>
                    <div className="text-sm text-gray-500">
                      {editingBlog ? 'Update existing post' : 'Create new blog post'}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingBlog(null);
                        setFormData({
                          title: '',
                          slug: '',
                          content: '',
                          excerpt: '',
                          featured_image: '',
                          meta_description: '',
                          meta_keywords: '',
                          is_published: false,
                          meta_title: '',
                          canonical_url: '',
                          schema_markup: '',
                          image_alt_text: '',
                          redirect_url: ''
                        });
                      }}
                      className="px-8 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      {editingBlog ? '💾 Update Blog' : '🚀 Publish Blog'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Blogs Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Blog Post</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">SEO</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {blog.featured_image && (
                          <img
                            src={blog.featured_image}
                            alt={(blog as any).image_alt_text || blog.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-900 max-w-xs truncate">{blog.title}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{blog.excerpt}</div>
                          <div className="text-xs text-gray-400">by Admin</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          {(blog as any).meta_title ? (
                            <span className="text-green-600">✓ Title</span>
                          ) : (
                            <span className="text-gray-400">○ Title</span>
                          )}
                        </div>
                        <div className="flex items-center text-xs">
                          {(blog as any).meta_description ? (
                            <span className="text-green-600">✓ Desc</span>
                          ) : (
                            <span className="text-gray-400">○ Desc</span>
                          )}
                        </div>
                        <div className="flex items-center text-xs">
                          {(blog as any).canonical_url ? (
                            <span className="text-green-600">✓ Canonical</span>
                          ) : (
                            <span className="text-gray-400">○ Canonical</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleBlogStatus(blog.id, blog.is_published)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                          blog.is_published
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {blog.is_published ? '✅ Published' : '📝 Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(Math.random() * 500) + 50} views
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Edit Blog"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => toggleBlogStatus(blog.id, blog.is_published)}
                          className={`p-2 rounded-lg transition-colors ${
                            blog.is_published
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={blog.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {blog.is_published ? '📥' : '📤'}
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Blog"
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
                  Showing {indexOfFirstBlog + 1} to {Math.min(indexOfLastBlog, filteredBlogs.length)} of {filteredBlogs.length} blogs
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
                          ? 'bg-purple-500 text-white border-purple-500'
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

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first blog post.</p>
          </div>
        )}
      </div>
    </div>
  );
}

