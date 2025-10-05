'use client';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { YouTubePlayer } from './YouTubePlayer';

interface PodcastData {
  id: number;
  title: string;
  description: string;
  video_url: string;
  youtube_video_id?: string;
  embed_url?: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  tags?: string;
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

export function Podcasts() {
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const result = await apiClient.getFeaturedPodcasts(6);
      if (result.success && Array.isArray(result.data)) {
        setPodcasts(result.data as PodcastData[]);
      } else {
        setError('Failed to fetch podcasts');
      }
    } catch (error) {
      setError('Failed to fetch podcasts');
    } finally {
      setLoading(false);
    }
  };

  const displayPodcasts = podcasts;

  return (
    <section id="podcasts" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Astrology Podcasts & Videos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from Dr. Arup Shastri's expert insights through our educational podcasts and videos. 
            Discover the ancient wisdom of Vedic astrology in modern, easy-to-understand formats.
          </p>
        </div>

        {loading ? (
          <div className="mb-12">
            <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <Swiper 
              spaceBetween={24} 
              slidesPerView={1} 
              breakpoints={{ 
                640: { slidesPerView: 2 }, 
                1024: { slidesPerView: 3 } 
              }}
              className="pb-8"
            >
              {displayPodcasts.map((podcast, index) => (
                <SwiperSlide key={`podcast-${podcast.id}-${index}`}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                    <div className="relative aspect-video overflow-hidden">
                      <YouTubePlayer
                        videoId={podcast.youtube_video_id}
                        embedUrl={podcast.embed_url}
                        title={podcast.title}
                        thumbnailUrl={podcast.thumbnail_url}
                        className="aspect-video"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-3 right-3 bg-black/75 text-white text-sm px-2 py-1 rounded-full">
                        {podcast.duration}
                      </div>
                      <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {podcast.category}
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
                        href={podcast.embed_url || podcast.video_url}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Watch Now
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
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
              <Link 
                href="/podcasts"
                className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                View All Episodes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
