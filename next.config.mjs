/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.youtube.com', 'images.unsplash.com', 'astroarupshastri.com', 'localhost'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
  },
  trailingSlash: true,
  // API rewrites for development and production
  async rewrites() {
    // On server: proxy to local backend (127.0.0.1:8002)
    // For local dev: proxy to localhost:8002 (set NEXT_PUBLIC_API_URL=http://localhost:8002)
    // Default: use production backend URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'http://127.0.0.1:8002' 
        : 'http://localhost:8002');
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  // Production optimizations - only apply in production
  ...(process.env.NODE_ENV === 'production' && {
    swcMinify: true,
    compiler: {
      removeConsole: true
    },
    poweredByHeader: false,
    compress: true,
    generateBuildId: async () => {
      return 'build-' + Date.now()
    },
    // Headers for security and performance - only in production
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin'
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
            },
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            }
          ]
        },
        {
          source: '/api/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate'
            }
          ]
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable'
            }
          ]
        }
      ];
    },
    // Webpack optimization for SEO - only in production
    webpack: (config, { dev, isServer }) => {
      if (!dev && !isServer) {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            priority: 30,
            chunks: 'all',
          },
        };
      }
      return config;
    },
  }),
};

export default nextConfig;
