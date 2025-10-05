'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  published_at: string;
  author_id: number;
}

export function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://astroarupshastri.com/api/blogs/?limit=3');
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
            <article key={blog.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              {blog.featured_image && (
                <div className="relative overflow-hidden">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(blog.published_at).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
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
