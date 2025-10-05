'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
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
        const response = await fetch('https://astroarupshastri.com/api/blogs/?limit=100');
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
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
    : blogs.filter(blog => blog.content.toLowerCase().includes(selectedCategory.toLowerCase()));

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

        {/* Categories Filter */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {filteredBlogs.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    {filteredBlogs[0].featured_image ? (
                      <img
                        src={filteredBlogs[0].featured_image}
                        alt={filteredBlogs[0].title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 md:h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                        <div className="text-6xl">📚</div>
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2 p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                        Astrology
                      </span>
                      <span className="text-gray-500 text-sm">{filteredBlogs[0].view_count} views</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      {filteredBlogs[0].title}
                    </h2>
                    {filteredBlogs[0].excerpt && (
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {filteredBlogs[0].excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          DA
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Dr. Arup Shastri</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(filteredBlogs[0].published_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${filteredBlogs[0].slug}`}
                        className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Latest Articles
              </h2>
              <p className="text-lg text-gray-600">
                Stay updated with the latest insights and predictions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">VB</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Stay Updated with Our Blog
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Subscribe to our newsletter and get the latest astrology insights, predictions, 
                and spiritual guidance delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300">
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
