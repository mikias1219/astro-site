'use client';

import { useState } from 'react';
import { seoRedirectsAPI, type RedirectData } from '@/lib/api/seo-redirects';

interface RedirectManagerProps {
  data: RedirectData[];
  token: string | null;
  onRefresh: () => void;
}

export default function RedirectManager({ data, token, onRefresh }: RedirectManagerProps) {
  const [activeTab, setActiveTab] = useState<'redirects' | 'bulk' | 'test'>('redirects');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<RedirectData | null>(null);
  const [formData, setFormData] = useState({
    from_url: '',
    to_url: '',
    redirect_type: 301 as 301 | 302 | 303 | 307 | 308,
    is_active: true,
    description: ''
  });

  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingItem) {
        await seoRedirectsAPI.update(token, editingItem.id!, formData);
      } else {
        await seoRedirectsAPI.add(token, formData);
      }
      onRefresh();
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save redirect data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      from_url: '',
      to_url: '',
      redirect_type: 301,
      is_active: true,
      description: ''
    });
  };

  const handleEdit = (item: RedirectData) => {
    setEditingItem(item);
    setFormData({
      from_url: item.from_url,
      to_url: item.to_url,
      redirect_type: item.redirect_type,
      is_active: item.is_active,
      description: item.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Are you sure you want to delete this redirect?')) return;
    try {
      await seoRedirectsAPI.delete(token, id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete redirect:', error);
    }
  };

  const testRedirect = async () => {
    if (!token || !testUrl) return;
    try {
      const result = await seoRedirectsAPI.testRedirect(token, testUrl);
      setTestResult(result);
    } catch (error) {
      console.error('Failed to test redirect:', error);
      alert('Failed to test redirect');
    }
  };

  const bulkImport = async (redirectsText: string) => {
    if (!token) return;
    try {
      const lines = redirectsText.split('\n').filter(line => line.trim());
      const redirects = lines.map(line => {
        const [from, to, type = '301'] = line.split(',').map(s => s.trim());
        return {
          from_url: from,
          to_url: to,
          redirect_type: parseInt(type) as 301 | 302 | 303 | 307 | 308,
          description: `Bulk imported: ${from} -> ${to}`
        };
      });

      const result = await seoRedirectsAPI.bulkImport(token, redirects);
      alert(`Bulk import complete! ${result.success_count} redirects added, ${result.failed_count} failed.`);
      onRefresh();
    } catch (error) {
      console.error('Failed to bulk import redirects:', error);
      alert('Failed to bulk import redirects');
    }
  };

  const exportRedirects = async (format: 'csv' | 'json' = 'csv') => {
    if (!token) return;
    try {
      const result = await seoRedirectsAPI.export(token, format);
      // Create download link
      const link = document.createElement('a');
      link.href = result.download_url;
      link.download = `redirects.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export redirects:', error);
      alert('Failed to export redirects');
    }
  };

  const getRedirectTypeName = (type: number) => {
    switch (type) {
      case 301: return '301 - Permanent';
      case 302: return '302 - Temporary';
      case 303: return '303 - See Other';
      case 307: return '307 - Temporary Redirect';
      case 308: return '308 - Permanent Redirect';
      default: return `${type} - Unknown`;
    }
  };

  const getRedirectTypeColor = (type: number) => {
    switch (type) {
      case 301:
      case 308: return 'bg-green-100 text-green-800';
      case 302:
      case 303:
      case 307: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Redirect Manager</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('redirects')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'redirects' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Redirects
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'bulk' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bulk Import
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'test' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Test
          </button>
        </div>
      </div>

      {activeTab === 'redirects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Redirect Management</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingItem(null);
                  resetForm();
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Redirect
              </button>
              <button
                onClick={() => exportRedirects('csv')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportRedirects('json')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Export JSON
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Redirect' : 'Add New Redirect'}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From URL</label>
                    <input
                      type="url"
                      value={formData.from_url}
                      onChange={(e) => setFormData({...formData, from_url: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/old-page"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To URL</label>
                    <input
                      type="url"
                      value={formData.to_url}
                      onChange={(e) => setFormData({...formData, to_url: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/new-page"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Redirect Type</label>
                    <select
                      value={formData.redirect_type}
                      onChange={(e) => setFormData({...formData, redirect_type: parseInt(e.target.value) as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value={301}>301 - Permanent Redirect</option>
                      <option value={302}>302 - Temporary Redirect</option>
                      <option value={303}>303 - See Other</option>
                      <option value={307}>307 - Temporary Redirect</option>
                      <option value={308}>308 - Permanent Redirect</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Optional description"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Add'} Redirect
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.from_url}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.to_url}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRedirectTypeColor(item.redirect_type)}`}>
                        {getRedirectTypeName(item.redirect_type)}
                      </span>
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
      )}

      {activeTab === 'bulk' && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Bulk Import Redirects</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CSV Format</label>
                <textarea
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                  placeholder="from_url,to_url,redirect_type
https://example.com/old1,https://example.com/new1,301
https://example.com/old2,https://example.com/new2,302
https://example.com/old3,https://example.com/new3,301"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.trim()) {
                      bulkImport(value);
                    }
                  }}
                />
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">CSV Format Instructions</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Each line should contain: from_url,to_url,redirect_type</li>
                  <li>• Redirect types: 301 (permanent), 302 (temporary), 303, 307, 308</li>
                  <li>• URLs should be complete with protocol (http:// or https://)</li>
                  <li>• One redirect per line</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'test' && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Test Redirect</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL to Test</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/old-page"
                  />
                  <button
                    onClick={testRedirect}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Test
                  </button>
                </div>
              </div>

              {testResult && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold mb-4">Test Result</h4>
                  {testResult.found ? (
                    <div className="space-y-2">
                      <div className="text-green-600 font-semibold">✓ Redirect Found</div>
                      <div><strong>To URL:</strong> {testResult.redirect?.to_url}</div>
                      <div><strong>Type:</strong> {getRedirectTypeName(testResult.redirect?.redirect_type)}</div>
                      <div><strong>Status:</strong> {testResult.redirect?.status}</div>
                    </div>
                  ) : (
                    <div className="text-red-600 font-semibold">✗ No Redirect Found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-800 mb-4">Redirect Best Practices</h4>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• Use 301 redirects for permanent URL changes</li>
              <li>• Use 302 redirects for temporary changes</li>
              <li>• Avoid redirect chains (A → B → C)</li>
              <li>• Test redirects after implementation</li>
              <li>• Update internal links to point to new URLs</li>
              <li>• Monitor redirect performance in analytics</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
