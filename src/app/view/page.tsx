'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';

interface DynamicPage {
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

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  meta_description?: string;
  meta_keywords?: string;
  author?: string;
  published_at?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

type ContentType = 'page' | 'blog-post';

function ContentViewer() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const type = (searchParams.get('type') as ContentType) || 'page';

  const [page, setPage] = useState<DynamicPage | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug && type) {
      if (type === 'page') {
        fetchPage(slug);
      } else if (type === 'blog-post') {
        fetchPost(slug);
      }
    } else {
      setError('Invalid URL parameters');
      setLoading(false);
    }
  }, [slug, type]);

  const fetchPage = async (pageSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pages/${pageSlug}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Page not found');
        } else {
          setError('Failed to load page');
        }
        return;
      }

      const pageData = await response.json();
      if (pageData.is_published) {
        setPage(pageData);
        setError(null);
      } else {
        setError('Page not found');
      }
    } catch (err) {
      console.error('Error fetching page:', err);
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (postSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog-posts/${postSlug}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Blog post not found');
        } else {
          setError('Failed to load blog post');
        }
        return;
      }

      const postData = await response.json();
      if (postData.is_published) {
        setPost(postData);
        setError(null);
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {type === 'page' ? 'Page Not Found' : 'Blog Post Not Found'}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Link
                href="/"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Go Home
              </Link>
              {type === 'blog-post' && (
                <Link
                  href="/blog"
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Back to Blog
                </Link>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render Dynamic Page
  if (page && type === 'page') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-16">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center">
                {page.title}
              </h1>
              {page.meta_description && (
                <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
                  {page.meta_description}
                </p>
              )}
            </div>
          </section>

          {/* Content Section */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />

              {/* Internal Link Section */}
              {page.anchor_text && page.anchor_link && (
                <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Related Content</h3>
                  <a
                    href={page.anchor_link}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    {page.anchor_text}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Meta Information */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: {new Date(page.updated_at).toLocaleDateString()}</span>
                  {page.meta_keywords && (
                    <span>Keywords: {page.meta_keywords}</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Render Blog Post
  if (post && type === 'blog-post') {
    const publishDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Breadcrumb */}
          <section className="bg-gray-50 py-4">
            <div className="max-w-4xl mx-auto px-4">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-orange-600">Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-orange-600">Blog</Link>
                <span>/</span>
                <span className="text-gray-800">{post.title}</span>
              </nav>
            </div>
          </section>

          {/* Article Header */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AS</span>
                  </div>
                  <span className="font-semibold text-gray-800">{post.author || 'Dr. Arup Shastri'}</span>
                </div>
                <span>•</span>
                <span>{publishDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="pb-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <article
                className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Article Footer */}
              <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">AS</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{post.author || 'Dr. Arup Shastri'}</p>
                      <p className="text-sm text-gray-500">Vedic Astrologer</p>
                    </div>
                  </div>

                  <Link
                    href="/blog"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    ← Back to Blog
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Related Articles CTA */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Explore More Articles
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Discover more insights about Vedic astrology and spiritual guidance
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse All Articles
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
}

function ContentViewerWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ContentViewer />
    </Suspense>
  );
}

export default ContentViewerWrapper;
