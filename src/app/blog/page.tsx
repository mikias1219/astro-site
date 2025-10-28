'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import { apiClient } from '../../lib/api';

interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  featured_image?: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  author_id: number;
  view_count: number;
}

const categories = ['All', 'Education', 'Marriage', 'Career', 'Health', 'Remedies', 'Vastu'];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await apiClient.getBlogs();
        if (result.success) {
          setBlogs(result.data as Blog[]);
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = selectedCategory === 'All'
    ? blogs
    : blogs.filter(blog => {
        // Simple category detection based on keywords in title or description
        const content = `${blog.title} ${blog.description}`.toLowerCase();
        return content.includes(selectedCategory.toLowerCase());
      });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Blog Posts</h2>
            <p className="text-gray-600">Please wait while we fetch the latest articles...</p>
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
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Astrology Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the ancient wisdom of Vedic astrology through our comprehensive blog.
                Learn about predictions, remedies, and spiritual guidance from expert insights.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Latest Articles ({blogs.length})
              </h2>
              <p className="text-lg text-gray-600">
                Stay updated with the latest insights and predictions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.slice(0, 6).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full">
                    <div className="relative overflow-hidden">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <div className="text-4xl">📚</div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Astrology
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.view_count} views</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          DA
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Dr. Arup Shastri</span>
                        <span className="ml-auto text-orange-600 font-semibold text-sm group-hover:text-orange-700">Read More →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
