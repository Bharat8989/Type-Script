'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </main>
  );
}