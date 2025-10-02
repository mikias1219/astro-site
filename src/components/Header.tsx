'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-md border-b border-orange-100 sticky top-0 z-50">
      {/* Top Bar - Contact Info */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:+919147327266" className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-semibold">+91 91473 27266</span>
              </a>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600">Welcome, <span className="font-semibold text-gray-800">{user?.full_name}</span></span>
                  {user?.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-purple-600 transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-orange-600 px-3 py-1 text-xs font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              DA
            </div>
            <div className="leading-tight">
              <div className="font-bold text-xl text-gray-800">Dr. Arup Shastri</div>
              <div className="text-xs text-orange-600 font-medium">Doctorate of Astrology</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link href="/" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            
            <div className="relative">
              <button 
                className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isServicesOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-white shadow-xl rounded-lg border border-gray-100 py-2 z-50"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <Link href="/services/consultation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    Personal Consultation
                  </Link>
                  <Link href="/services/online-reports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    Online Reports
                  </Link>
                  <Link href="/services/voice-report" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    Voice Reports
                  </Link>
                </div>
              )}
            </div>

            <Link href="/horoscope" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Horoscope
            </Link>
            <Link href="/calculators" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Calculators
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Blog
            </Link>
            <Link href="/podcasts" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Podcasts
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Book Consultation Button */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link 
              href="/book-appointment" 
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md"
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
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-1">
              <Link href="/" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/services/consultation" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Personal Consultation
              </Link>
              <Link href="/services/online-reports" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Online Reports
              </Link>
              <Link href="/services/voice-report" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Voice Reports
              </Link>
              <Link href="/horoscope" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>
                Horoscope
              </Link>
              <Link href="/calculators" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>
                Free Calculators
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
              <Link href="/podcasts" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>
                Podcasts
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              
              <div className="pt-4 mt-4 border-t border-gray-200">
                <Link 
                  href="/book-appointment" 
                  className="block bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg text-center font-semibold hover:from-green-600 hover:to-green-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Consultation
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}