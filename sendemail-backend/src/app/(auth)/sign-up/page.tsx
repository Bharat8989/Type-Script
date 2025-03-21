'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

export default function SignUpForm() {
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const debouncedUsername = useDebounce(form.watch('username'), 300);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        'There was a problem with your sign-up. Please try again.';

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>

          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <div className="flex items-center border rounded-lg p-2">
                  <FaUser className="text-gray-500 mr-2" />
                  <Input type="text" placeholder="Enter your username" {...field} />
                </div>
                {isCheckingUsername ? (
                  <p className="text-sm text-blue-500">Checking username...</p>
                ) : (
                  usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage.includes('available')
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="flex items-center border rounded-lg p-2">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <Input type="email" placeholder="Enter your email" {...field} />
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
                  <FaLock className="text-gray-500 mr-2" />
                  <Input type="password" placeholder="Enter your password" {...field} />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Signing Up...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>

          {/* Social Sign-In */}
          <p className="text-center text-sm mt-4">
            Or sign up with social platforms
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

          {/* Login Link */}
          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
