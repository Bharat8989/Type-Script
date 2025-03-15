'use client';

import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          afterSignInUrl="/dashboard"
        />
      </div>
    </main>
  );
}