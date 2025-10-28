'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  content?: string;
  featured_image?: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  author_id: number;
  view_count: number;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/slug/${slug}`);
        if (!response.ok) {
          throw new Error('Blog not found');
        }
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Article</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/blog" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Featured Image */}
        <section className="relative h-96 overflow-hidden">
          {blog.featured_image ? (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <div className="text-6xl">📚</div>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-4xl mx-auto px-4 pb-12 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Astrology
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">{blog.title}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
                    DA
                  </div>
                  <div>
                    <p className="font-semibold">Dr. Arup Shastri</p>
                    <p className="text-sm text-gray-200">
                      {new Date(blog.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-200">
                  {blog.view_count} views
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            {/* Summary */}
            <div className="mb-12 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <p className="text-lg text-gray-700 leading-relaxed">{blog.description}</p>
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none mb-12">
              {blog.content ? (
                <div
                  className="text-gray-700 leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <p className="text-gray-600 text-lg">{blog.description}</p>
              )}
            </article>

            {/* Author Info */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-lg my-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  DA
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Dr. Arup Shastri</h3>
                  <p className="text-gray-600 mb-3">
                    Doctorate of Astrology | Renowned Vedic Astrologer with 20+ years of experience
                  </p>
                  <p className="text-gray-700">
                    Expert in marriage astrology, career guidance, health predictions, and spiritual growth. 
                    Providing accurate astrological predictions to help you navigate life's journey.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-12 rounded-lg text-center my-12">
              <h3 className="text-3xl font-bold mb-4">Get Personalized Guidance</h3>
              <p className="text-lg mb-6 text-orange-100">
                Book a consultation with Dr. Arup Shastri to get insights tailored to your life
              </p>
              <Link 
                href="/book-appointment" 
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Book Consultation
              </Link>
            </div>

            {/* Back Link */}
            <div className="text-center">
              <Link 
                href="/blog" 
                className="text-orange-600 hover:text-orange-700 font-semibold text-lg flex items-center justify-center gap-2"
              >
                ← Back to All Articles
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
