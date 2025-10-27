import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://astroarupshastri.com'),
  title: {
    default: 'Dr. Arup Shastri - Best Astrologer | Vedic Astrology Services',
    template: '%s | Dr. Arup Shastri - Vedic Astrologer'
  },
  description: 'Get accurate astrological predictions from Dr. Arup Shastri. Expert in marriage astrology, career guidance, health predictions, and Vedic astrology. Free horoscope matching and online reports.',
  keywords: [
    'astrology', 'vedic astrology', 'horoscope', 'marriage astrology', 'career astrology',
    'health astrology', 'kundli matching', 'online reports', 'Dr. Arup Shastri',
    'birth chart', 'zodiac signs', 'gemstone consultation', 'numerology',
    'panchang', 'marriage compatibility', 'career prediction'
  ],
  authors: [{ name: 'Dr. Arup Shastri' }],
  creator: 'Dr. Arup Shastri',
  publisher: 'AstroArupShastri.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Astrology Services',
  classification: 'Astrology Consultation',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://astroarupshastri.com',
    title: 'Dr. Arup Shastri - Best Astrologer | Vedic Astrology Services',
    description: 'Get accurate astrological predictions from Dr. Arup Shastri. Expert in marriage astrology, career guidance, health predictions, and Vedic astrology.',
    siteName: 'AstroArupShastri.com',
    images: [
      {
        url: '/images/whatsapp/astrologer-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Dr. Arup Shastri - Professional Astrologer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Arup Shastri - Best Astrologer | Vedic Astrology Services',
    description: 'Get accurate astrological predictions from Dr. Arup Shastri. Expert in marriage astrology, career guidance, health predictions.',
    images: ['/images/whatsapp/astrologer-1.jpg'],
    creator: '@astroarupshastri',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://astroarupshastri.com',
    languages: {
      'en-US': 'https://astroarupshastri.com',
      'hi-IN': 'https://astroarupshastri.com/hi',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#ff6b35',
      },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#ff6b35',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Dr. Arup Shastri - Vedic Astrologer",
    "description": "Expert Vedic astrologer providing accurate predictions for marriage, career, health, and life guidance.",
    "url": "https://astroarupshastri.com",
    "logo": "https://astroarupshastri.com/logo.svg",
    "image": "https://astroarupshastri.com/images/whatsapp/astrologer-1.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "22.5726",
      "longitude": "88.3639"
    },
    "telephone": "+91-XXXXXXXXXX",
    "priceRange": "$$",
    "openingHours": "Mo-Su 09:00-21:00",
    "serviceType": ["Astrology Consultation", "Horoscope Reading", "Marriage Compatibility", "Career Guidance"],
    "areaServed": "Worldwide",
    "knowsAbout": [
      "Vedic Astrology",
      "Marriage Astrology",
      "Career Astrology",
      "Health Astrology",
      "Kundli Matching",
      "Birth Chart Analysis",
      "Gemstone Consultation",
      "Numerology"
    ],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "Certified Vedic Astrologer",
      "credentialCategory": "Professional Certification"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [
      "https://www.facebook.com/astroarupshastri",
      "https://www.instagram.com/astroarupshastri",
      "https://www.youtube.com/@astroarupshastri"
    ]
  };

  return (
    <html lang="en" itemScope itemType="https://schema.org/WebSite">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Additional meta tags for better SEO */}
        <meta name="theme-color" content="#ff6b35" />
        <meta name="msapplication-navbutton-color" content="#ff6b35" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />

        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* Analytics and tracking scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
