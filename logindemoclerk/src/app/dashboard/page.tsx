import { redirect } from 'next/navigation';
// import { currentUser } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/login'); // Redirect to login if not signed in
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard, {user.firstName}!</h1>
      <p className="text-lg text-gray-600">You’re successfully signed in.</p>
    </main>
  );
}