'use client';

import { useState } from 'react';
import { seoPerformanceAPI, type PerformanceSettings } from '@/lib/api/seo-performance';

interface PerformanceManagerProps {
  settings: PerformanceSettings | null;
  token: string | null;
  onRefresh: () => void;
}

export default function PerformanceManager({ settings, token, onRefresh }: PerformanceManagerProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'audit' | 'mobile'>('settings');
  const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettings>({
    minify_css: settings?.minify_css || false,
    minify_js: settings?.minify_js || false,
    enable_browser_caching: settings?.enable_browser_caching || false,
    cache_duration: settings?.cache_duration || 86400,
    enable_lazy_loading: settings?.enable_lazy_loading || false,
    enable_gzip_compression: settings?.enable_gzip_compression || false,
    enable_cdn: settings?.enable_cdn || false,
    cdn_url: settings?.cdn_url || '',
    enable_preload: settings?.enable_preload || false,
    preload_resources: settings?.preload_resources || []
  });

  const [auditUrl, setAuditUrl] = useState('');
  const [auditResults, setAuditResults] = useState<any>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const updateSettings = async () => {
    if (!token) return;
    try {
      await seoPerformanceAPI.updateSettings(token, performanceSettings);
      alert('Performance settings updated successfully!');
      onRefresh();
    } catch (error) {
      console.error('Failed to update performance settings:', error);
      alert('Failed to update performance settings');
    }
  };

  const runAudit = async () => {
    if (!token || !auditUrl) return;
    setAuditLoading(true);
    try {
      const result = await seoPerformanceAPI.runAudit(token, auditUrl);
      setAuditResults(result);
    } catch (error) {
      console.error('Failed to run audit:', error);
      alert('Failed to run performance audit');
    } finally {
      setAuditLoading(false);
    }
  };

  const testMobileResponsiveness = async () => {
    if (!token || !auditUrl) return;
    try {
      const result = await seoPerformanceAPI.testMobileResponsiveness(token, auditUrl);
      alert(`Mobile friendly: ${result.is_mobile_friendly ? 'Yes' : 'No'}`);
    } catch (error) {
      console.error('Failed to test mobile responsiveness:', error);
      alert('Failed to test mobile responsiveness');
    }
  };

  const addPreloadResource = () => {
    setPerformanceSettings(prev => ({
      ...prev,
      preload_resources: [...prev.preload_resources, '']
    }));
  };

  const updatePreloadResource = (index: number, value: string) => {
    setPerformanceSettings(prev => ({
      ...prev,
      preload_resources: prev.preload_resources.map((resource, idx) => idx === index ? value : resource)
    }));
  };

  const removePreloadResource = (index: number) => {
    setPerformanceSettings(prev => ({
      ...prev,
      preload_resources: prev.preload_resources.filter((_, idx) => idx !== index)
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Performance Optimization</h2>
        <div className="flex space-x-2">
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
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'audit' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Audit
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'mobile' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mobile Test
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Settings</h3>
            <form onSubmit={(e) => { e.preventDefault(); updateSettings(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="minify_css"
                    checked={performanceSettings.minify_css}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, minify_css: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="minify_css" className="ml-2 block text-sm text-gray-900">
                    Minify CSS
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="minify_js"
                    checked={performanceSettings.minify_js}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, minify_js: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="minify_js" className="ml-2 block text-sm text-gray-900">
                    Minify JavaScript
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable_browser_caching"
                    checked={performanceSettings.enable_browser_caching}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, enable_browser_caching: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_browser_caching" className="ml-2 block text-sm text-gray-900">
                    Enable Browser Caching
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable_lazy_loading"
                    checked={performanceSettings.enable_lazy_loading}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, enable_lazy_loading: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_lazy_loading" className="ml-2 block text-sm text-gray-900">
                    Enable Lazy Loading
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable_gzip_compression"
                    checked={performanceSettings.enable_gzip_compression}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, enable_gzip_compression: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_gzip_compression" className="ml-2 block text-sm text-gray-900">
                    Enable Gzip Compression
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable_cdn"
                    checked={performanceSettings.enable_cdn}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, enable_cdn: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_cdn" className="ml-2 block text-sm text-gray-900">
                    Enable CDN
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable_preload"
                    checked={performanceSettings.enable_preload}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, enable_preload: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_preload" className="ml-2 block text-sm text-gray-900">
                    Enable Resource Preloading
                  </label>
                </div>
              </div>

              {performanceSettings.enable_browser_caching && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cache Duration (seconds)</label>
                  <input
                    type="number"
                    value={performanceSettings.cache_duration}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, cache_duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="86400 (24 hours)"
                  />
                </div>
              )}

              {performanceSettings.enable_cdn && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CDN URL</label>
                  <input
                    type="url"
                    value={performanceSettings.cdn_url}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, cdn_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://cdn.example.com"
                  />
                </div>
              )}

              {performanceSettings.enable_preload && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preload Resources</label>
                  <div className="space-y-2">
                    {performanceSettings.preload_resources.map((resource, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="url"
                          value={resource}
                          onChange={(e) => updatePreloadResource(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="https://example.com/resource.css"
                        />
                        <button
                          type="button"
                          onClick={() => removePreloadResource(index)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPreloadResource}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add Resource
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Update Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Audit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page URL to Audit</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/page"
                  />
                  <button
                    onClick={runAudit}
                    disabled={auditLoading}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {auditLoading ? 'Running...' : 'Run Audit'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {auditResults && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold mb-4">Audit Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${getScoreBgColor(auditResults.performance_score)}`}>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(auditResults.performance_score)}`}>
                      {auditResults.performance_score}
                    </div>
                    <div className="text-sm text-gray-600">Performance</div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${getScoreBgColor(auditResults.accessibility_score)}`}>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(auditResults.accessibility_score)}`}>
                      {auditResults.accessibility_score}
                    </div>
                    <div className="text-sm text-gray-600">Accessibility</div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${getScoreBgColor(auditResults.best_practices_score)}`}>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(auditResults.best_practices_score)}`}>
                      {auditResults.best_practices_score}
                    </div>
                    <div className="text-sm text-gray-600">Best Practices</div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${getScoreBgColor(auditResults.seo_score)}`}>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(auditResults.seo_score)}`}>
                      {auditResults.seo_score}
                    </div>
                    <div className="text-sm text-gray-600">SEO</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2">Core Web Vitals</h5>
                  <div className="space-y-2 text-sm">
                    <div>Load Time: {auditResults.load_time}ms</div>
                    <div>First Contentful Paint: {auditResults.first_contentful_paint}ms</div>
                    <div>Largest Contentful Paint: {auditResults.largest_contentful_paint}ms</div>
                    <div>Cumulative Layout Shift: {auditResults.cumulative_layout_shift}</div>
                    <div>First Input Delay: {auditResults.first_input_delay}ms</div>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Recommendations</h5>
                  <div className="space-y-2">
                    {auditResults.recommendations.slice(0, 5).map((rec: any, index: number) => (
                      <div key={index} className={`p-2 rounded text-sm ${
                        rec.type === 'error' ? 'bg-red-100 text-red-800' :
                        rec.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'mobile' && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Mobile Responsiveness Test</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page URL to Test</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/page"
                  />
                  <button
                    onClick={testMobileResponsiveness}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Test Mobile
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">Mobile Optimization Tips</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Use responsive design with flexible layouts</li>
              <li>• Optimize images for mobile devices</li>
              <li>• Minimize text input requirements</li>
              <li>• Use touch-friendly button sizes (44px minimum)</li>
              <li>• Avoid Flash and other non-mobile technologies</li>
              <li>• Test on real devices, not just browser dev tools</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
