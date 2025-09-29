import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Dr. Arup Shastri - Best Astrologer | Vedic Astrology Services',
  description: 'Get accurate astrological predictions from Dr. Arup Shastri. Expert in marriage astrology, career guidance, health predictions, and Vedic astrology. Free horoscope matching and online reports.',
  keywords: 'astrology, vedic astrology, horoscope, marriage astrology, career astrology, health astrology, kundli matching, online reports, Dr. Arup Shastri',
  authors: [{ name: 'Dr. Arup Shastri' }],
  openGraph: {
    title: 'Dr. Arup Shastri - Best Astrologer | Vedic Astrology Services',
    description: 'Get accurate astrological predictions from Dr. Arup Shastri. Expert in marriage astrology, career guidance, health predictions, and Vedic astrology.',
    type: 'website',
    locale: 'en_US',
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
