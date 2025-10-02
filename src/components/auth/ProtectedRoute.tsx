'use client';

import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  fallback 
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Required</h2>
            <p className="text-lg text-gray-600 mb-8">
              You need to be logged in to access this feature. Please sign in or create an account to continue.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="block w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-black transition-all duration-300"
            >
              Create Account
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-lg text-gray-600 mb-8">
              You don't have permission to access this area. Admin privileges are required.
            </p>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};
