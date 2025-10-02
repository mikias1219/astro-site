'use client';

import { useState } from 'react';
import { seoSchemaAPI, type SchemaData, type ArticleSchema, type ProductSchema, type OrganizationSchema, type BreadcrumbSchema, type FAQSchema } from '@/lib/api/seo-schema';

interface SchemaManagerProps {
  data: SchemaData[];
  token: string | null;
  onRefresh: () => void;
}

export default function SchemaManager({ data, token, onRefresh }: SchemaManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SchemaData | null>(null);
  const [selectedSchemaType, setSelectedSchemaType] = useState<'article' | 'product' | 'organization' | 'breadcrumb' | 'faq'>('article');
  const [formData, setFormData] = useState({
    page_url: '',
    schema_type: 'article' as 'article' | 'product' | 'organization' | 'breadcrumb' | 'faq',
    schema_data: {} as any,
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingItem) {
        await seoSchemaAPI.update(token, editingItem.id!, formData);
      } else {
        await seoSchemaAPI.create(token, formData);
      }
      onRefresh();
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save schema data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      page_url: '',
      schema_type: 'article',
      schema_data: {},
      is_active: true
    });
  };

  const handleEdit = (item: SchemaData) => {
    setEditingItem(item);
    setFormData({
      page_url: item.page_url,
      schema_type: item.schema_type as 'article' | 'product' | 'organization' | 'breadcrumb' | 'faq',
      schema_data: item.schema_data,
      is_active: item.is_active
    });
    setSelectedSchemaType(item.schema_type as any);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Are you sure you want to delete this schema?')) return;
    try {
      await seoSchemaAPI.delete(token, id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete schema:', error);
    }
  };

  const autoGenerateSchema = async () => {
    if (!token || !formData.page_url) return;
    try {
      const result = await seoSchemaAPI.autoGenerate(token, formData.page_url, selectedSchemaType, {});
      setFormData(prev => ({ ...prev, schema_data: result.schema_data }));
    } catch (error) {
      console.error('Failed to auto-generate schema:', error);
    }
  };

  const renderSchemaForm = () => {
    switch (selectedSchemaType) {
      case 'article':
        return <ArticleSchemaForm data={formData.schema_data} onChange={(data) => setFormData(prev => ({ ...prev, schema_data: data }))} />;
      case 'product':
        return <ProductSchemaForm data={formData.schema_data} onChange={(data) => setFormData(prev => ({ ...prev, schema_data: data }))} />;
      case 'organization':
        return <OrganizationSchemaForm data={formData.schema_data} onChange={(data) => setFormData(prev => ({ ...prev, schema_data: data }))} />;
      case 'breadcrumb':
        return <BreadcrumbSchemaForm data={formData.schema_data} onChange={(data) => setFormData(prev => ({ ...prev, schema_data: data }))} />;
      case 'faq':
        return <FAQSchemaForm data={formData.schema_data} onChange={(data) => setFormData(prev => ({ ...prev, schema_data: data }))} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Structured Data (Schema Markup)</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            resetForm();
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Add Schema
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Schema' : 'Add New Schema'}
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
                  placeholder="/blog/post-title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schema Type</label>
                <select
                  value={selectedSchemaType}
                  onChange={(e) => {
                    setSelectedSchemaType(e.target.value as any);
                    setFormData({...formData, schema_type: e.target.value as any});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="article">Article (Blog Posts)</option>
                  <option value="product">Product (E-commerce)</option>
                  <option value="organization">Organization (About Page)</option>
                  <option value="breadcrumb">Breadcrumb</option>
                  <option value="faq">FAQ</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={autoGenerateSchema}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Auto Generate
              </button>
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

            {renderSchemaForm()}

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {editingItem ? 'Update' : 'Add'} Schema
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schema Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.page_url}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{item.schema_type}</td>
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

// Schema Form Components
function ArticleSchemaForm({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const [formData, setFormData] = useState({
    headline: data.headline || '',
    description: data.description || '',
    author: data.author?.name || '',
    publisher: data.publisher?.name || '',
    datePublished: data.datePublished || '',
    dateModified: data.dateModified || '',
    image: data.image || '',
    url: data.url || ''
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: newData.headline,
      description: newData.description,
      author: {
        '@type': 'Person',
        name: newData.author
      },
      publisher: {
        '@type': 'Organization',
        name: newData.publisher,
        logo: {
          '@type': 'ImageObject',
          url: ''
        }
      },
      datePublished: newData.datePublished,
      dateModified: newData.dateModified,
      image: newData.image,
      url: newData.url
    };
    
    onChange(schemaData);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800">Article Schema</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Article headline"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleChange('author', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
          <input
            type="text"
            value={formData.publisher}
            onChange={(e) => handleChange('publisher', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Publisher name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Published Date</label>
          <input
            type="date"
            value={formData.datePublished}
            onChange={(e) => handleChange('datePublished', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modified Date</label>
          <input
            type="date"
            value={formData.dateModified}
            onChange={(e) => handleChange('dateModified', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Article description"
        />
      </div>
    </div>
  );
}

function ProductSchemaForm({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    description: data.description || '',
    image: data.image || '',
    brand: data.brand?.name || '',
    price: data.offers?.price || '',
    currency: data.offers?.priceCurrency || 'USD',
    availability: data.offers?.availability || 'InStock',
    url: data.url || ''
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: newData.name,
      description: newData.description,
      image: newData.image,
      brand: {
        '@type': 'Brand',
        name: newData.brand
      },
      offers: {
        '@type': 'Offer',
        price: newData.price,
        priceCurrency: newData.currency,
        availability: `https://schema.org/${newData.availability}`
      },
      url: newData.url
    };
    
    onChange(schemaData);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800">Product Schema</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Brand name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
          <select
            value={formData.availability}
            onChange={(e) => handleChange('availability', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="InStock">In Stock</option>
            <option value="OutOfStock">Out of Stock</option>
            <option value="PreOrder">Pre Order</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="https://example.com/product.jpg"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Product description"
        />
      </div>
    </div>
  );
}

function OrganizationSchemaForm({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    description: data.description || '',
    url: data.url || '',
    logo: data.logo || '',
    telephone: data.contactPoint?.telephone || '',
    streetAddress: data.address?.streetAddress || '',
    addressLocality: data.address?.addressLocality || '',
    addressRegion: data.address?.addressRegion || '',
    postalCode: data.address?.postalCode || '',
    addressCountry: data.address?.addressCountry || ''
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: newData.name,
      description: newData.description,
      url: newData.url,
      logo: newData.logo,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: newData.telephone,
        contactType: 'customer service'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: newData.streetAddress,
        addressLocality: newData.addressLocality,
        addressRegion: newData.addressRegion,
        postalCode: newData.postalCode,
        addressCountry: newData.addressCountry
      }
    };
    
    onChange(schemaData);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800">Organization Schema</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Organization name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
          <input
            type="url"
            value={formData.logo}
            onChange={(e) => handleChange('logo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="https://example.com/logo.png"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telephone</label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => handleChange('telephone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="+1-555-123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
          <input
            type="text"
            value={formData.streetAddress}
            onChange={(e) => handleChange('streetAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="123 Main St"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={formData.addressLocality}
            onChange={(e) => handleChange('addressLocality', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State/Region</label>
          <input
            type="text"
            value={formData.addressRegion}
            onChange={(e) => handleChange('addressRegion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="State/Region"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="12345"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input
            type="text"
            value={formData.addressCountry}
            onChange={(e) => handleChange('addressCountry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="US"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Organization description"
        />
      </div>
    </div>
  );
}

function BreadcrumbSchemaForm({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const [breadcrumbs, setBreadcrumbs] = useState(
    data.itemListElement || [
      { position: 1, name: '', item: '' },
      { position: 2, name: '', item: '' }
    ]
  );

  const handleBreadcrumbChange = (index: number, field: string, value: string) => {
    const newBreadcrumbs = [...breadcrumbs];
    newBreadcrumbs[index] = { ...newBreadcrumbs[index], [field]: value };
    setBreadcrumbs(newBreadcrumbs);
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: newBreadcrumbs.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        item: item.item
      }))
    };
    
    onChange(schemaData);
  };

  const addBreadcrumb = () => {
    setBreadcrumbs([...breadcrumbs, { position: breadcrumbs.length + 1, name: '', item: '' }]);
  };

  const removeBreadcrumb = (index: number) => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.filter((_, idx) => idx !== index);
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800">Breadcrumb Schema</h4>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position {index + 1}</label>
            <input
              type="text"
              value={breadcrumb.name}
              onChange={(e) => handleBreadcrumbChange(index, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Breadcrumb name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input
              type="url"
              value={breadcrumb.item}
              onChange={(e) => handleBreadcrumbChange(index, 'item', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://example.com/page"
            />
          </div>
          <div className="flex items-end">
            {breadcrumbs.length > 1 && (
              <button
                type="button"
                onClick={() => removeBreadcrumb(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addBreadcrumb}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add Breadcrumb
      </button>
    </div>
  );
}

function FAQSchemaForm({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const [faqs, setFaqs] = useState(
    data.mainEntity || [
      { name: '', acceptedAnswer: { text: '' } },
      { name: '', acceptedAnswer: { text: '' } }
    ]
  );

  const handleFAQChange = (index: number, field: string, value: string) => {
    const newFaqs = [...faqs];
    if (field === 'answer') {
      newFaqs[index] = {
        ...newFaqs[index],
        acceptedAnswer: { ...newFaqs[index].acceptedAnswer, text: value }
      };
    } else {
      newFaqs[index] = { ...newFaqs[index], [field]: value };
    }
    setFaqs(newFaqs);
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: newFaqs.map(faq => ({
        '@type': 'Question',
        name: faq.name,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.acceptedAnswer.text
        }
      }))
    };
    
    onChange(schemaData);
  };

  const addFAQ = () => {
    setFaqs([...faqs, { name: '', acceptedAnswer: { text: '' } }]);
  };

  const removeFAQ = (index: number) => {
    if (faqs.length > 1) {
      const newFaqs = faqs.filter((_, idx) => idx !== index);
      setFaqs(newFaqs);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800">FAQ Schema</h4>
      {faqs.map((faq, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question {index + 1}</label>
            <input
              type="text"
              value={faq.name}
              onChange={(e) => handleFAQChange(index, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="What is your question?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
            <textarea
              value={faq.acceptedAnswer.text}
              onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Provide the answer..."
            />
          </div>
          {faqs.length > 1 && (
            <button
              type="button"
              onClick={() => removeFAQ(index)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Remove FAQ
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addFAQ}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add FAQ
      </button>
    </div>
  );
}
