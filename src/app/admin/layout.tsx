'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Allow access to login and register pages without authentication
  const publicPages = ['/admin/login', '/admin/register'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (!loading && !isPublicPage) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/admin/login');
      } else if (!isAdmin) {
        // Redirect to main site if not admin
        router.push('/');
      }
    }
  }, [loading, isAuthenticated, isAdmin, router, isPublicPage]);

  // Show loading only for protected pages
  if (loading && !isPublicPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For public pages (login/register), render without admin nav
  if (isPublicPage) {
    return <>{children}</>;
  }

  // For protected pages, check authentication
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-gray-800">
                Admin Dashboard
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/bookings"
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                >
                  Bookings
                </Link>
                <Link
                  href="/admin/services"
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                >
                  Services
                </Link>
                <Link
                  href="/admin/users"
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                >
                  Users
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {user?.full_name} (Admin)
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}