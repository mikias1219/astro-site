'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

interface PodcastData {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchPodcasts();
  }, [selectedCategory]);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? 'https://astroarupshastri.com/api/podcasts/' 
        : `https://astroarupshastri.com/api/podcasts/?category=${selectedCategory}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPodcasts(data);
      } else {
        setError('Failed to fetch podcasts');
      }
    } catch (error) {
      setError('Failed to fetch podcasts');
    } finally {
      setLoading(false);
    }
  };

  // Fallback data if API fails
  const fallbackPodcasts = [
    {
      id: 0,
      title: 'करोड़ों की सेना, अरबों का बजट… फिर भी असुरक्षित',
      description: 'जानिए पर्दे के पीछे की साजिश और ज्योतिष की दृष्टि से क्या कहता है भविष्य।',
      duration: '10:00',
      category: 'Politics',
      thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      video_url: 'https://www.youtube.com/watch?v=sample1',
      is_featured: true,
      view_count: 1250,
      created_at: '2024-01-15T10:00:00'
    },
    {
      id: 0,
      title: 'ईरान इज़राइल युद्ध या अमेरिकी स्क्रिप्ट?',
      description: 'जानिए पर्दे के पीछे की साजिश। Israel Iran Ceasefire, Trump Politics या अनीति।',
      duration: '07:12',
      category: 'International',
      thumbnail_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=225&fit=crop',
      video_url: 'https://www.youtube.com/watch?v=sample2',
      is_featured: true,
      view_count: 980,
      created_at: '2024-01-14T15:30:00'
    },
    {
      id: 0,
      title: 'Share Market Astrology। Stock Market Prediction',
      description: 'Dr. Vinay Bajrangi के साथ शेयर मार्केट की ज्योतिषीय भविष्यवाणी।',
      duration: '06:12',
      category: 'Finance',
      thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      video_url: 'https://www.youtube.com/watch?v=sample3',
      is_featured: false,
      view_count: 750,
      created_at: '2024-01-13T12:00:00'
    },
    {
      id: 0,
      title: 'Understanding Your Birth Chart',
      description: 'Learn how to read and interpret your birth chart for better life decisions',
      duration: '15:30',
      category: 'Education',
      thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      is_featured: false,
      view_count: 650,
      created_at: '2024-01-12T09:00:00'
    },
    {
      id: 0,
      title: 'Marriage Compatibility Analysis',
      description: 'Discover the secrets of astrological compatibility in relationships',
      duration: '12:45',
      category: 'Marriage',
      thumbnail_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=225&fit=crop',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      is_featured: false,
      view_count: 580,
      created_at: '2024-01-11T14:30:00'
    },
    {
      id: 0,
      title: 'Career Guidance Through Astrology',
      description: 'Find your ideal career path using Vedic astrology principles',
      duration: '18:20',
      category: 'Career',
      thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      is_featured: false,
      view_count: 720,
      created_at: '2024-01-10T11:15:00'
    }
  ];

  const displayPodcasts = podcasts.length > 0 ? podcasts : fallbackPodcasts;
  const categories = ['all', 'Politics', 'International', 'Finance', 'Education', 'Marriage', 'Career'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Astrology Podcasts & Videos
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Learn from Dr. Arup Shastri's expert insights through our educational podcasts and videos. 
                Discover the ancient wisdom of Vedic astrology in modern, easy-to-understand formats.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Podcasts Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 text-xl mb-4">{error}</div>
                <button
                  onClick={fetchPodcasts}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPodcasts.map((podcast) => (
                  <div key={podcast.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        alt={podcast.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        src={podcast.thumbnail_url}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-3 right-3 bg-black/75 text-white text-sm px-2 py-1 rounded-full">
                        {podcast.duration}
                      </div>
                      <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {podcast.category}
                      </div>
                      {podcast.is_featured && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Featured
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                        {podcast.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {podcast.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500">
                          {podcast.view_count.toLocaleString()} views
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(podcast.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <a 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl" 
                        href={podcast.video_url}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Watch Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl shadow-2xl p-8 md:p-12">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Subscribe to Our Channel
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Get regular updates on astrology insights, predictions, and spiritual guidance. 
                  Join thousands of subscribers who trust our expertise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://www.youtube.com/@drarupshastri"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Subscribe on YouTube
                  </a>
                  <a 
                    href="/book-appointment"
                    className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
                  >
                    Book Consultation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
