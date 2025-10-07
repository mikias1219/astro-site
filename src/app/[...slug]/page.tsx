'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function DynamicPage() {
  const params = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:8000/api/pages/slug'
          : 'https://astroarupshastri.com/api/pages/slug';

        const response = await fetch(`${apiUrl}/${slug}`);
        
        if (response.ok) {
          const data = await response.json();
          setPage(data);
          setError(null);
        } else if (response.status === 404) {
          setError('Page not found');
        } else {
          setError('Failed to load page');
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page not found</p>
          <a 
            href="/" 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{page.title}</h1>
          {page.excerpt && (
            <p className="text-xl text-gray-600">{page.excerpt}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Need Personal Guidance?</h3>
            <p className="text-gray-600 mb-6">
              Get personalized astrological consultation from Dr. Arup Shastri
            </p>
            <a 
              href="/book-appointment"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
