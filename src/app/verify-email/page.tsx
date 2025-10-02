'use client';

import EmailVerification from '../../components/auth/EmailVerification';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <EmailVerification />
    </Suspense>
  );
}
