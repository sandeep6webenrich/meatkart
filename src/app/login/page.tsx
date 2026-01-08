'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Suspense } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      await login(); // Update global auth state

      // Redirect based on role or returnUrl
      if (returnUrl) {
        router.push(returnUrl);
      } else if (result.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerUrl = returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register';

  return (
    <div className="flex items-center justify-center p-8 lg:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Welcome back</h1>
          <p className="mt-2 text-stone-600">
            Enter your credentials to access your account
          </p>
        </div>

        {returnUrl && returnUrl.includes('checkout') && !error && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 text-sm border border-green-100">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Please sign in to complete your order
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
                placeholder="name@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-stone-700">Password</label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-700 text-white py-2.5 rounded-lg font-bold hover:bg-green-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600">
          Don&apos;t have an account?{' '}
          <Link href={registerUrl} className="font-medium text-green-600 hover:text-green-500">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Suspense fallback={<div className="flex items-center justify-center p-8 lg:p-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>}>
        <LoginForm />
      </Suspense>

      {/* Right: Image */}
      <div className="hidden lg:block relative bg-stone-900">
        <Image
          src="https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=peaceful%20ayurvedic%20ingredients%20setup%20mortar%20pestle%20herbs%20dark%20moody%20lighting&image_size=portrait_16_9"
          alt="Login background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              &ldquo;Ayurveda is not just about nutrition or herbs, it is a way of life that teaches us how to maintain health and improve the quality of our life.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
