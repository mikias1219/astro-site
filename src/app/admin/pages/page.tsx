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

interface StaticPage {
  route: string;
  title: string;
  type: 'static' | 'dynamic';
  hasFile: boolean;
  canEdit: boolean;
}

interface ImageData {
  id?: number;
  filename: string;
  alt_text?: string;
  caption?: string;
  url?: string;
  page_id?: number;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [activeTab, setActiveTab] = useState<'dynamic' | 'static' | 'images'>('dynamic');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageForContent, setSelectedImageForContent] = useState<string>('');
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

  const [imageFormData, setImageFormData] = useState({
    filename: '',
    alt_text: '',
    caption: '',
    file: null as File | null,
    image_url: '' // For URL-based uploads
  });

  useEffect(() => {
    if (token) {
      fetchPages(token);
      discoverStaticPages();
      fetchImages(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchPages = async (authToken: string) => {
    try {
      const response = await fetch('https://astroarupshastri.com/api/pages?published_only=false', {
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

  const discoverStaticPages = () => {
    // List of known static pages in your app
    const staticPageList: StaticPage[] = [
      { route: '/', title: 'Home Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/about', title: 'About Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/contact', title: 'Contact Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/horoscope', title: 'Horoscope Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/panchang', title: 'Panchang Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/podcasts', title: 'Podcasts Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/blog', title: 'Blog Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/calculators', title: 'Calculators Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/calculators/kundli', title: 'Kundli Calculator', type: 'static', hasFile: true, canEdit: false },
      { route: '/calculators/horoscope-matching', title: 'Horoscope Matching', type: 'static', hasFile: true, canEdit: false },
      { route: '/calculators/numerology', title: 'Numerology Calculator', type: 'static', hasFile: true, canEdit: false },
      { route: '/calculators/gemstone', title: 'Gemstone Calculator', type: 'static', hasFile: true, canEdit: false },
      { route: '/calculators/moon-sign', title: 'Moon Sign Calculator', type: 'static', hasFile: true, canEdit: false },
      { route: '/calculators/ascendant', title: 'Ascendant Calculator', type: 'static', hasFile: true, canEdit: false },
      { route: '/calculators/dosha', title: 'Dosha Calculator', type: 'static', hasFile: true, canEdit: false },
      { route: '/calculators/rudraksha', title: 'Rudraksha Calculator', type: 'static', hasFile: true, canEdit: false },
      { route: '/services/consultation', title: 'Consultation Service', type: 'static', hasFile: true, canEdit: false },
      { route: '/book-appointment', title: 'Book Appointment', type: 'static', hasFile: true, canEdit: false },
      { route: '/free-reports', title: 'Free Reports', type: 'static', hasFile: true, canEdit: false },
      { route: '/login', title: 'Login Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/register', title: 'Register Page', type: 'static', hasFile: true, canEdit: false },
      { route: '/verify-email', title: 'Verify Email', type: 'static', hasFile: true, canEdit: false },
      { route: '/reset-password', title: 'Reset Password', type: 'static', hasFile: true, canEdit: false }
    ];
    setStaticPages(staticPageList);
  };

  const fetchImages = async (authToken: string) => {
    try {
      const response = await fetch('https://astroarupshastri.com/api/images', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setUploadingImage(true);
    try {
      let response;

      if (imageFormData.file) {
        // File upload
        const formData = new FormData();
        formData.append('file', imageFormData.file);
        formData.append('alt_text', imageFormData.alt_text);
        formData.append('caption', imageFormData.caption);

        response = await fetch('https://astroarupshastri.com/api/images/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } else if (imageFormData.image_url) {
        // URL upload
        response = await fetch('https://astroarupshastri.com/api/images/upload-url', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image_url: imageFormData.image_url,
            alt_text: imageFormData.alt_text,
            caption: imageFormData.caption
          })
        });
      } else {
        setError('Please select a file or enter an image URL');
        setUploadingImage(false);
        return;
      }

      if (response.ok) {
        await fetchImages(token);
        setImageFormData({
          filename: '',
          alt_text: '',
          caption: '',
          file: null,
          image_url: ''
        });
        setShowImageUpload(false);
      } else {
        setError('Failed to upload image');
      }
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async (imageId: number) => {
    if (!token || !confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`https://astroarupshastri.com/api/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchImages(token);
      } else {
        setError('Failed to delete image');
      }
    } catch (error) {
      setError('Failed to delete image');
    }
  };

  const insertImageIntoContent = (imageUrl: string, altText: string = '') => {
    const imageHtml = `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
    const currentContent = formData.content;
    const newContent = currentContent + '\n\n' + imageHtml;
    setFormData({ ...formData, content: newContent });
    setShowImageGallery(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const url = editingPage 
        ? `https://astroarupshastri.com/api/pages/${editingPage.id}`
        : 'https://astroarupshastri.com/api/pages';
      
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
      const response = await fetch(`https://astroarupshastri.com/api/pages/${pageId}`, {
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
      const response = await fetch(`https://astroarupshastri.com/api/pages/${pageId}`, {
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Pages Management</h1>
              <p className="text-gray-600">Manage website pages, static pages, and images</p>
            </div>
            <div className="flex space-x-3">
              {activeTab === 'dynamic' && (
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
              )}
              {activeTab === 'images' && (
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  Upload Image
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dynamic')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dynamic'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dynamic Pages ({pages.length})
              </button>
              <button
                onClick={() => setActiveTab('static')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'static'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Static Pages ({staticPages.length})
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'images'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Images ({images.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dynamic' && (
          <>
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

            {/* Help Guide */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-green-800 mb-3">🚀 Dynamic Pages Guide</h3>
              <div className="text-sm text-green-700 space-y-2">
                <p><strong>✅ What are Dynamic Pages?</strong> Pages created through this admin panel that are stored in your database.</p>
                <p><strong>📍 How to Access:</strong> Your dynamic pages will be available at <code className="bg-green-100 px-1 rounded">yourdomain.com/view?type=page&slug=your-page-slug</code></p>
                <p><strong>🖼️ Adding Images:</strong> Use the "Insert Image from Gallery" button when creating content.</p>
                <p><strong>📝 Content Format:</strong> You can use HTML tags in the content field for rich formatting.</p>
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Page Content</label>
                  <button
                    type="button"
                    onClick={() => setShowImageGallery(true)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    📷 Insert Image from Gallery
                  </button>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter page content (HTML supported)"
                />
                <p className="text-xs text-gray-500 mt-1">Tip: Use the "Insert Image from Gallery" button to add images to your content</p>
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
                        <a
                          href={`/view?type=page&slug=${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md hover:bg-green-100 transition-colors"
                        >
                          View
                        </a>
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

        {pages.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No dynamic pages found</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first dynamic page to get started.</p>
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">💡 <strong>Tip:</strong> Dynamic pages will be accessible at:</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">yourdomain.com/view?type=page&slug=your-page-slug</code>
            </div>
          </div>
        )}
          </>
        )}

        {/* Static Pages Tab */}
        {activeTab === 'static' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Static Pages Overview</h2>
              <p className="text-gray-600 mb-3">These are your existing Next.js pages. You can view their SEO metadata and edit them directly in the codebase.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📝 How to Edit Static Pages:</h3>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Click "View" to see the page</li>
                  <li>Edit the corresponding file in your codebase (e.g., <code>src/app/about/page.tsx</code>)</li>
                  <li>Use the SEO Panel to manage meta tags for these pages</li>
                </ol>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staticPages.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{page.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.route}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Static
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <a
                            href={page.route}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            View
                          </a>
                          <span className="text-gray-400 bg-gray-50 px-3 py-1 rounded-md text-xs">
                            Edit in Code
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <>
            {/* Image Upload Form */}
            {showImageUpload && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Image</h2>
                <form onSubmit={handleImageUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Method</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Option 1: Upload File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFormData({...imageFormData, file: e.target.files?.[0] || null, image_url: ''})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="text-center text-gray-500">OR</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Option 2: Image URL</label>
                    <input
                      type="url"
                      value={imageFormData.image_url}
                      onChange={(e) => setImageFormData({...imageFormData, image_url: e.target.value, file: null})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text (for SEO and accessibility)</label>
                    <input
                      type="text"
                      value={imageFormData.alt_text}
                      onChange={(e) => setImageFormData({...imageFormData, alt_text: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Describe the image for screen readers"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Caption (optional)</label>
                    <input
                      type="text"
                      value={imageFormData.caption}
                      onChange={(e) => setImageFormData({...imageFormData, caption: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Image caption"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50"
                    >
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImageUpload(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Image Gallery Modal */}
            {showImageGallery && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Select Image from Gallery</h2>
                    <button
                      onClick={() => setShowImageGallery(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                          <img
                            src={image.url || '/placeholder-image.jpg'}
                            alt={image.alt_text || 'Gallery image'}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-2">
                            <p className="text-sm font-medium text-gray-800 truncate">{image.filename}</p>
                            {image.alt_text && (
                              <p className="text-xs text-gray-500 truncate">{image.alt_text}</p>
                            )}
                            <button
                              onClick={() => insertImageIntoContent(image.url || '', image.alt_text || '')}
                              className="w-full mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                            >
                              Insert
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {images.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No images in gallery. Upload some images first!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={image.url || '/placeholder-image.jpg'}
                      alt={image.alt_text || 'Uploaded image'}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{image.filename}</h3>
                    {image.alt_text && (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Alt:</span> {image.alt_text}
                      </p>
                    )}
                    {image.caption && (
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Caption:</span> {image.caption}
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(image.url || '')}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors text-sm"
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => handleImageDelete(image.id!)}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
                <p className="mt-1 text-sm text-gray-500">Upload your first image to get started.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


