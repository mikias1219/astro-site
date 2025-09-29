import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Vedic Astrology: A Complete Guide',
    excerpt: 'Learn the fundamentals of Vedic astrology and how it differs from Western astrology. Discover the ancient wisdom that has guided millions for centuries.',
    author: 'Dr. Arup Shastri',
    date: 'January 15, 2025',
    category: 'Education',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    slug: 'understanding-vedic-astrology-complete-guide'
  },
  {
    id: 2,
    title: 'Marriage Compatibility: What the Stars Say',
    excerpt: 'Discover how astrological compatibility works in relationships and marriage. Learn about the key factors that determine relationship success.',
    author: 'Dr. Arup Shastri',
    date: 'January 12, 2025',
    category: 'Marriage',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
    slug: 'marriage-compatibility-what-stars-say'
  },
  {
    id: 3,
    title: 'Career Guidance Through Astrology',
    excerpt: 'Find your ideal career path using Vedic astrology. Learn how planetary positions influence your professional life and success.',
    author: 'Dr. Arup Shastri',
    date: 'January 10, 2025',
    category: 'Career',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    slug: 'career-guidance-through-astrology'
  },
  {
    id: 4,
    title: 'Health Predictions and Astrological Remedies',
    excerpt: 'Understand how astrology can help predict health issues and discover effective remedies for better wellness.',
    author: 'Dr. Arup Shastri',
    date: 'January 8, 2025',
    category: 'Health',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    slug: 'health-predictions-astrological-remedies'
  },
  {
    id: 5,
    title: 'Gemstone Therapy: Choosing the Right Gemstone',
    excerpt: 'Learn how to select and use gemstones for astrological benefits. Discover which gemstones are best for your birth chart.',
    author: 'Dr. Arup Shastri',
    date: 'January 5, 2025',
    category: 'Remedies',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop',
    slug: 'gemstone-therapy-choosing-right-gemstone'
  },
  {
    id: 6,
    title: 'Vastu Shastra: Creating Positive Energy at Home',
    excerpt: 'Transform your living space with Vastu Shastra principles. Learn how to create harmony and positive energy in your home.',
    author: 'Dr. Arup Shastri',
    date: 'January 3, 2025',
    category: 'Vastu',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
    slug: 'vastu-shastra-creating-positive-energy-home'
  }
];

const categories = ['All', 'Education', 'Marriage', 'Career', 'Health', 'Remedies', 'Vastu'];

export default function BlogPage() {
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
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    category === 'All'
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
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {blogPosts[0].category}
                    </span>
                    <span className="text-gray-500 text-sm">{blogPosts[0].readTime}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">VB</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{blogPosts[0].author}</p>
                        <p className="text-gray-500 text-sm">{blogPosts[0].date}</p>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${blogPosts[0].slug}`}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
