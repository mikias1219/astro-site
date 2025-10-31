'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    if (token) {
      fetchFAQs();
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, [token]);

  const [categories, setCategories] = useState<string[]>([]);

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faqs/', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      if (response.ok) {
        const data = await response.json();
        setFaqs(Array.isArray(data) ? data : []);
        setError(null);
      } else {
        setError('Failed to fetch FAQs');
        setFaqs([]);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError('Failed to fetch FAQs');
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/faqs/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const url = editingFAQ
        ? `/api/faqs/${editingFAQ.id}`
        : '/api/faqs/';

      const method = editingFAQ ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchFAQs();
        setShowAddForm(false);
        setEditingFAQ(null);
        resetForm();
        alert('✅ FAQ saved successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`❌ Failed to save FAQ: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('❌ Failed to save FAQ. Please check your connection.');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      order: 0,
      is_active: true
    });
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
      order: faq.order,
      is_active: faq.is_active
    });
    setShowAddForm(true);
  };

  const handleDelete = async (faqId: number) => {
    if (!token || !confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/faqs/${faqId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchFAQs();
        alert('✅ FAQ deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`❌ Failed to delete FAQ: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('❌ Failed to delete FAQ. Please check your connection.');
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">❓ FAQs Management</h1>
              <p className="text-gray-600">Create and manage frequently asked questions</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                ➕ Add New FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-blue-600">{faqs.length}</span>
            </div>
            <h3 className="font-semibold text-blue-900 mb-1">Total FAQs</h3>
            <p className="text-sm text-blue-700">All FAQ entries</p>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500 text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-green-600">{faqs.filter(f => f.is_active).length}</span>
            </div>
            <h3 className="font-semibold text-green-900 mb-1">Active FAQs</h3>
            <p className="text-sm text-green-700">Visible on website</p>
          </div>

          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500 text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-purple-600">{categories.length}</span>
            </div>
            <h3 className="font-semibold text-purple-900 mb-1">Categories</h3>
            <p className="text-sm text-purple-700">FAQ categories</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search FAQs by question or answer..."
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
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredFAQs.length} of {faqs.length} FAQs
            </div>
          </div>
        </div>

        {/* Add/Edit FAQ Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {editingFAQ ? '✏️ Edit FAQ' : '✨ Create New FAQ'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingFAQ(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Question *</label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter the question..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Answer *</label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={6}
                      placeholder="Enter the answer..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., General, Services, Booking"
                        list="categories"
                      />
                      <datalist id="categories">
                        {categories.map(cat => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>
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
                        {formData.is_active ? '✅ FAQ is active' : '🚫 FAQ is inactive'}
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingFAQ(null);
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
                      {editingFAQ ? '💾 Update FAQ' : '🚀 Create FAQ'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* FAQs List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first FAQ.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs
                  .sort((a, b) => a.order - b.order)
                  .map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                            {faq.category && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {faq.category}
                              </span>
                            )}
                            {faq.is_active ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                Active
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-2">{faq.answer}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(faq)}
                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                            title="Edit FAQ"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete FAQ"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

