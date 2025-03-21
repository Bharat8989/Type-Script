import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Clerk Next.js Quickstart</h1>
      <p className="text-lg mb-6 text-gray-600">
        Sign in or sign up to get started!
      </p>
      <SignedOut>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Sign Up
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <p className="text-lg">
          You’re signed in! Visit your{' '}
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Dashboard
          </Link>
          .
        </p>
      </SignedIn>
    </main>
  );
}