'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Dr. Arup Shastri" className="h-12 w-auto" />
            <div>
              <div className="font-bold text-xl text-gray-800">Dr. Arup Shastri</div>
              <div className="text-sm text-orange-600 font-medium">Doctorate of Astrology</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700">
            <Link href="/" className="hover:text-orange-600 transition-colors px-3 py-2 rounded-md hover:bg-orange-50">Home</Link>
            <div className="relative group">
              <button className="hover:text-orange-600 transition-colors flex items-center gap-1 px-3 py-2 rounded-md hover:bg-orange-50">
                Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <Link href="/services/consultation" className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Personal Consultation</Link>
                  <Link href="/services/online-reports" className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Online Reports</Link>
                  <Link href="/services/voice-report" className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Voice Reports</Link>
                </div>
              </div>
            </div>
            <Link href="/horoscope" className="hover:text-orange-600 transition-colors px-3 py-2 rounded-md hover:bg-orange-50">Horoscope</Link>
            <Link href="/calculators" className="hover:text-orange-600 transition-colors px-3 py-2 rounded-md hover:bg-orange-50">Free Calculators</Link>
            <Link href="/blog" className="hover:text-orange-600 transition-colors px-3 py-2 rounded-md hover:bg-orange-50">Blog</Link>
            <Link href="/podcasts" className="hover:text-orange-600 transition-colors px-3 py-2 rounded-md hover:bg-orange-50">Podcasts</Link>
            <Link href="/about" className="hover:text-orange-600 transition-colors px-3 py-2 rounded-md hover:bg-orange-50">About</Link>
            <Link href="/contact" className="hover:text-orange-600 transition-colors px-3 py-2 rounded-md hover:bg-orange-50">Contact</Link>
          </nav>

          {/* CTA Button and Phone */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-600">Call Now</div>
              <div className="text-sm font-semibold text-orange-600">
                <a href="tel:+919147327266" className="hover:text-orange-700">+91 91473 27266</a>
              </div>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-gray-600">Welcome</div>
                  <div className="text-sm font-semibold text-gray-800">{user?.full_name}</div>
                </div>
                {user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="text-gray-700 hover:text-orange-600 px-4 py-2 text-sm font-semibold transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Register
                </button>
              </div>
            )}
            
            <Link 
              href="/book-appointment" 
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pt-4">
              <Link href="/" className="text-gray-700 hover:text-orange-600 py-2">Home</Link>
              <Link href="/services/consultation" className="text-gray-700 hover:text-orange-600 py-2">Personal Consultation</Link>
              <Link href="/services/online-reports" className="text-gray-700 hover:text-orange-600 py-2">Online Reports</Link>
              <Link href="/services/voice-report" className="text-gray-700 hover:text-orange-600 py-2">Voice Reports</Link>
              <Link href="/horoscope" className="text-gray-700 hover:text-orange-600 py-2">Horoscope</Link>
              <Link href="/calculators" className="text-gray-700 hover:text-orange-600 py-2">Free Calculators</Link>
              <Link href="/blog" className="text-gray-700 hover:text-orange-600 py-2">Blog</Link>
              <Link href="/podcasts" className="text-gray-700 hover:text-orange-600 py-2">Podcasts</Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 py-2">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 py-2">Contact</Link>
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Welcome</div>
                      <div className="font-semibold text-gray-800">{user?.full_name}</div>
                    </div>
                    {user?.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="block bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold text-center"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-gray-700 hover:text-orange-600 py-2 text-sm font-semibold"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('register');
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
              
              <Link 
                href="/book-appointment" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold text-center mt-4"
              >
                Book Consultation
              </Link>
            </nav>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </header>
  );
}
