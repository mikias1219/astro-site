'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../lib/api';

interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  featured_image?: string;
  published_at: string;
  author_id: number;
  is_published?: boolean;
}

export function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await apiClient.getBlogs();
        if (result.success && result.data) {
          const blogsData = Array.isArray(result.data) ? result.data : [];
          // Filter to only show published blogs and take first 3
          const publishedBlogs = blogsData
            .filter((blog: Blog) => blog.is_published !== false)
            .slice(0, 3);
          setBlogs(publishedBlogs);
        } else {
          console.error('Failed to fetch blogs:', result.error);
          setBlogs([]);
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading latest blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-xl text-gray-600">
            Discover insights and wisdom from Dr. Arup Shastri
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`}>
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                <div className="relative overflow-hidden bg-gradient-to-br from-orange-200 to-red-300 h-48">
                  {blog.featured_image ? (
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-orange-600 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p className="text-orange-700 font-semibold mt-2">Astrology Insights</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {blog.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {new Date(blog.published_at).toLocaleDateString()}
                    </span>
                    <span className="text-orange-600 font-semibold text-sm group-hover:text-orange-700 transition-colors">
                      Read More →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Blog Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
