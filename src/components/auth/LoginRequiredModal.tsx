'use client';

import React from 'react';
import Link from 'next/link';

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginRequiredModal({ open, onClose, message }: LoginRequiredModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
        <p className="text-gray-600 mb-4">
          {message || 'Please login or register to access this detailed report.'}
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Close</button>
          <Link href="/login" className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700">Login</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900">Register</Link>
        </div>
      </div>
    </div>
  );
}


