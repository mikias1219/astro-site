'use client';

import { useState } from 'react';

interface YouTubePlayerProps {
  videoId?: string;
  embedUrl?: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
}

export function YouTubePlayer({
  videoId,
  embedUrl,
  title,
  thumbnailUrl,
  className = "aspect-video w-full"
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // If we have a direct embed URL, use it
  if (embedUrl && !embedUrl.includes('youtube.com')) {
    return (
      <div className={className}>
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    );
  }

  // If we have a YouTube video ID, create the embed
  if (videoId || (embedUrl && embedUrl.includes('youtube.com'))) {
    const embedSrc = embedUrl || (videoId ? `https://www.youtube.com/embed/${videoId}` : '');

    return (
      <div className={className}>
        <iframe
          src={embedSrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    );
  }

  // Fallback: show thumbnail with play button
  return (
    <div className={`${className} relative bg-gray-200 rounded-lg flex items-center justify-center`}>
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="text-gray-400 text-6xl">🎬</div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
