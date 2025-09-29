'use client';

import { useState } from 'react';
import { seoImagesAPI, type ImageData, type ImageOptimizationSettings } from '@/lib/api/seo-images';

interface ImageOptimizationManagerProps {
  data: ImageData[];
  token: string | null;
  onRefresh: () => void;
}

export default function ImageOptimizationManager({ data, token, onRefresh }: ImageOptimizationManagerProps) {
  const [activeTab, setActiveTab] = useState<'images' | 'settings'>('images');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ImageData | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    alt_text: '',
    title_attribute: '',
    caption: '',
    page_url: ''
  });

  const [optimizationSettings, setOptimizationSettings] = useState<ImageOptimizationSettings>({
    quality: 85,
    max_width: 1920,
    max_height: 1080,
    format: 'webp',
    enable_lazy_loading: true,
    enable_compression: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingItem) {
        await seoImagesAPI.update(token, editingItem.id!, formData);
      } else {
        await seoImagesAPI.add(token, {
          ...formData,
          file_size: 0,
          dimensions: { width: 0, height: 0 },
          is_optimized: false
        });
      }
      onRefresh();
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save image data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      image_url: '',
      alt_text: '',
      title_attribute: '',
      caption: '',
      page_url: ''
    });
  };

  const handleEdit = (item: ImageData) => {
    setEditingItem(item);
    setFormData({
      image_url: item.image_url,
      alt_text: item.alt_text,
      title_attribute: item.title_attribute || '',
      caption: item.caption || '',
      page_url: item.page_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Are you sure you want to delete this image data?')) return;
    try {
      await seoImagesAPI.delete(token, id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete image data:', error);
    }
  };

  const optimizeImage = async (id: number) => {
    if (!token) return;
    try {
      const result = await seoImagesAPI.optimize(token, id, optimizationSettings);
      alert(`Image optimized! Size reduced by ${result.compression_ratio}%`);
      onRefresh();
    } catch (error) {
      console.error('Failed to optimize image:', error);
      alert('Failed to optimize image');
    }
  };

  const bulkOptimize = async () => {
    if (!token) return;
    const unoptimizedImages = data.filter(img => !img.is_optimized);
    if (unoptimizedImages.length === 0) {
      alert('All images are already optimized!');
      return;
    }

    try {
      const result = await seoImagesAPI.bulkOptimize(token, unoptimizedImages.map(img => img.id!), optimizationSettings);
      alert(`Bulk optimization complete! ${result.success_count} images optimized, ${result.failed_count} failed.`);
      onRefresh();
    } catch (error) {
      console.error('Failed to bulk optimize images:', error);
      alert('Failed to bulk optimize images');
    }
  };

  const generateAltText = async (imageUrl: string) => {
    if (!token) return;
    try {
      const result = await seoImagesAPI.generateAltText(token, imageUrl);
      setFormData(prev => ({ ...prev, alt_text: result.alt_text }));
    } catch (error) {
      console.error('Failed to generate alt text:', error);
      alert('Failed to generate alt text');
    }
  };

  const scanPageImages = async () => {
    if (!token || !formData.page_url) return;
    try {
      const result = await seoImagesAPI.scanPageImages(token, formData.page_url);
      alert(`Found ${result.length} images on the page`);
      onRefresh();
    } catch (error) {
      console.error('Failed to scan page images:', error);
      alert('Failed to scan page images');
    }
  };

  const updateOptimizationSettings = async () => {
    if (!token) return;
    try {
      await seoImagesAPI.updateOptimizationSettings(token, optimizationSettings);
      alert('Optimization settings updated successfully!');
    } catch (error) {
      console.error('Failed to update optimization settings:', error);
      alert('Failed to update optimization settings');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Image Optimization</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'images' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'settings' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Image Management</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingItem(null);
                  resetForm();
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Image
              </button>
              <button
                onClick={bulkOptimize}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Bulk Optimize
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Image Data' : 'Add New Image'}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page URL</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.page_url}
                        onChange={(e) => setFormData({...formData, page_url: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="/about"
                      />
                      <button
                        type="button"
                        onClick={scanPageImages}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Scan
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.alt_text}
                        onChange={(e) => setFormData({...formData, alt_text: e.target.value})}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Descriptive alt text for accessibility"
                      />
                      <button
                        type="button"
                        onClick={() => generateAltText(formData.image_url)}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title Attribute</label>
                    <input
                      type="text"
                      value={formData.title_attribute}
                      onChange={(e) => setFormData({...formData, title_attribute: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Image title"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                  <textarea
                    value={formData.caption}
                    onChange={(e) => setFormData({...formData, caption: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Image caption"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Add'} Image
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alt Text</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image_url}
                          alt={item.alt_text}
                          className="h-12 w-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div className="text-sm text-gray-900 max-w-xs truncate">{item.image_url}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.alt_text}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(item.file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.is_optimized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.is_optimized ? 'Optimized' : 'Needs Optimization'}
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
                        {!item.is_optimized && (
                          <button
                            onClick={() => optimizeImage(item.id!)}
                            className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md hover:bg-green-100 transition-colors"
                          >
                            Optimize
                          </button>
                        )}
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

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Optimization Settings</h3>
            <form onSubmit={(e) => { e.preventDefault(); updateOptimizationSettings(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quality (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={optimizationSettings.quality}
                    onChange={(e) => setOptimizationSettings({...optimizationSettings, quality: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Width (px)</label>
                  <input
                    type="number"
                    value={optimizationSettings.max_width}
                    onChange={(e) => setOptimizationSettings({...optimizationSettings, max_width: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Height (px)</label>
                  <input
                    type="number"
                    value={optimizationSettings.max_height}
                    onChange={(e) => setOptimizationSettings({...optimizationSettings, max_height: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select
                    value={optimizationSettings.format}
                    onChange={(e) => setOptimizationSettings({...optimizationSettings, format: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="webp">WebP</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable_lazy_loading"
                    checked={optimizationSettings.enable_lazy_loading}
                    onChange={(e) => setOptimizationSettings({...optimizationSettings, enable_lazy_loading: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_lazy_loading" className="ml-2 block text-sm text-gray-900">
                    Enable Lazy Loading
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable_compression"
                    checked={optimizationSettings.enable_compression}
                    onChange={(e) => setOptimizationSettings({...optimizationSettings, enable_compression: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_compression" className="ml-2 block text-sm text-gray-900">
                    Enable Compression
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Update Settings
              </button>
            </form>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">Image Optimization Tips</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Use WebP format for better compression and quality</li>
              <li>• Set appropriate max dimensions to reduce file size</li>
              <li>• Quality 85-90 provides good balance between size and quality</li>
              <li>• Enable lazy loading to improve page load speed</li>
              <li>• Always provide descriptive alt text for accessibility</li>
              <li>• Use title attributes for additional context</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
