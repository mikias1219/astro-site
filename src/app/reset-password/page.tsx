'use client';

import PasswordReset from '../../components/auth/PasswordReset';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PasswordReset />
    </Suspense>
  );
}
