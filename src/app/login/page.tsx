'use client';

import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Login</h1>
              <p className="text-gray-600 text-sm">Access your account</p>
            </div>
            <LoginForm onSuccess={() => router.push('/')} />
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?
              <a href="/register" className="ml-1 text-orange-600 hover:text-orange-700 font-semibold">Register</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


