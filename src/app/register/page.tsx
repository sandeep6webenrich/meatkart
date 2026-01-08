'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, User, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Suspense } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      await login();

      if (returnUrl) {
        router.push(returnUrl);
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

  const loginUrl = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login';

  return (
    <div className="flex items-center justify-center p-8 lg:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Create an account</h1>
          <p className="mt-2 text-stone-600">
            Enter your details to get started
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
              <input
                type="text"
                {...register('name')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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
            <label className="text-sm font-medium text-stone-700">Password</label>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
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
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link href={loginUrl} className="font-medium text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Right: Image (flipped for register) */}
      <div className="hidden lg:block relative bg-stone-900 order-last">
        <Image
          src="https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=fresh%20green%20herbs%20and%20oils%20in%20glass%20bottles%20sunlight%20nature%20wellness&image_size=portrait_16_9"
          alt="Register background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              &ldquo;Join our community of wellness enthusiasts and discover the power of ancient Ayurvedic wisdom.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      <Suspense fallback={<div className="flex items-center justify-center p-8 lg:p-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
