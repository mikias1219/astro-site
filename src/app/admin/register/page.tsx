'use client';

import { useRouter } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

export default function AdminRegisterPage() {
  const router = useRouter();

  // Admin already exists, redirect to login or show message
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Account Already Exists</h2>
          <p className="text-gray-600 mb-6">
            The admin account for this astrology website has already been created. 
            If you're looking to create a regular user account, please use the user registration.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Admin Login
            </button>
            
            <button
              onClick={() => router.push('/register')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300"
            >
              Create User Account
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

}
