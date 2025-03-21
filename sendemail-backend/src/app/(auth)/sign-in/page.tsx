'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { MdEmail, MdLock } from 'react-icons/md';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: 'Login Failed',
        description:
          result.error === 'CredentialsSignin'
            ? 'Incorrect username or password'
            : result.error,
        variant: 'destructive',
      });
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-center mb-4">Sign In</h2>

          {/* Email Field */}
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="flex items-center border rounded-lg p-2">
                  <MdEmail className="text-gray-500 mr-2" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="flex items-center border rounded-lg p-2">
                  <MdLock className="text-gray-500 mr-2" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4">
            Sign In
          </Button>

          {/* Social Sign In */}
          <p className="text-center text-sm mt-4">
            Or sign in with social platforms
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <div
              className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <FaGoogle className="text-red-500 text-xl" />
            </div>
            <div
              className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            >
              <FaGithub className="text-gray-700 text-xl" />
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm mt-4">
            Don’t have an account?{' '}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
