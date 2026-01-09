'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function SignupForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  })

  async function onSignupSubmit(data: z.infer<typeof signupSchema>) {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Check your email to confirm your account')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSocialLogin(provider: 'google' | 'facebook') {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error('Failed to initiate social login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tw-bg-white tw-shadow-2xl tw-rounded-2xl tw-overflow-hidden tw-max-w-4xl tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-border tw-border-gray-100">
      {/* Left Side - Brand/Image Area */}
      <div className="tw-bg-primary tw-p-8 md:tw-p-12 tw-flex tw-flex-col tw-justify-between tw-text-white md:tw-w-5/12 tw-bg-cover tw-bg-center tw-relative">
        <div className="tw-relative tw-z-10">
          <img src="/images/logo.png" alt="MeatKart" className="tw-h-12 tw-w-auto tw-brightness-0 tw-invert tw-mb-8" />
          <h2 className="tw-text-3xl tw-font-bold tw-mb-4">Join MeatKart</h2>
          <p className="tw-text-white/80 tw-text-lg">Create an account to order fresh meat delivered to your doorstep.</p>
        </div>
        <div className="tw-relative tw-z-10 tw-mt-12 tw-hidden md:tw-block">
          <p className="tw-text-sm tw-text-white/60">© 2024 MeatKart</p>
        </div>
        {/* Overlay for better text readability if image is used */}
        <div className="tw-absolute tw-inset-0 tw-bg-primary/90 tw-z-0"></div>
      </div>

      {/* Right Side - Form Area */}
      <div className="tw-p-8 md:tw-p-12 tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        <div className="tw-max-w-sm tw-mx-auto tw-w-full">
          <h3 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2">
            Create Account
          </h3>
          <p className="tw-text-gray-500 tw-mb-8">
            Enter your details to sign up.
          </p>

          <div className="tw-space-y-6">
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="tw-space-y-4">
              <div className="tw-space-y-1.5">
                <Label htmlFor="fullName" className="tw-text-base tw-font-semibold tw-text-gray-800">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  type="text"
                  className="tw-h-12 tw-bg-gray-50 tw-border-gray-300 tw-text-gray-900 tw-font-medium tw-text-base tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all placeholder:tw-text-gray-400"
                  {...signupForm.register('fullName')}
                  disabled={loading}
                />
                {signupForm.formState.errors.fullName && (
                  <p className="tw-text-sm tw-font-medium tw-text-red-600 tw-mt-1">{signupForm.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="tw-space-y-1.5">
                <Label htmlFor="email" className="tw-text-base tw-font-semibold tw-text-gray-800">Email Address</Label>
                <Input
                  id="email"
                  placeholder="john@example.com"
                  type="email"
                  className="tw-h-12 tw-bg-gray-50 tw-border-gray-300 tw-text-gray-900 tw-font-medium tw-text-base tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all placeholder:tw-text-gray-400"
                  {...signupForm.register('email')}
                  disabled={loading}
                />
                {signupForm.formState.errors.email && (
                  <p className="tw-text-sm tw-font-medium tw-text-red-600 tw-mt-1">{signupForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="tw-space-y-1.5">
                <Label htmlFor="password" className="tw-text-base tw-font-semibold tw-text-gray-800">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  className="tw-h-12 tw-bg-gray-50 tw-border-gray-300 tw-text-gray-900 tw-font-medium tw-text-base tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all placeholder:tw-text-gray-400"
                  {...signupForm.register('password')}
                  disabled={loading}
                />
                {signupForm.formState.errors.password && (
                  <p className="tw-text-sm tw-font-medium tw-text-red-600 tw-mt-1">{signupForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="tw-space-y-1.5">
                <Label htmlFor="confirmPassword" className="tw-text-base tw-font-semibold tw-text-gray-800">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  className="tw-h-12 tw-bg-gray-50 tw-border-gray-300 tw-text-gray-900 tw-font-medium tw-text-base tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all placeholder:tw-text-gray-400"
                  {...signupForm.register('confirmPassword')}
                  disabled={loading}
                />
                {signupForm.formState.errors.confirmPassword && (
                  <p className="tw-text-sm tw-font-medium tw-text-red-600 tw-mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="tw-w-full tw-h-12 tw-bg-primary tw-hover:bg-red-700 tw-text-white tw-text-lg tw-font-bold tw-rounded-lg tw-shadow-lg tw-shadow-primary/30 tw-transition-all hover:tw-translate-y-[-1px]" disabled={loading}>
                {loading ? <Loader2 className="tw-mr-2 tw-h-6 tw-w-6 tw-animate-spin" /> : 'Sign Up'}
              </Button>
            </form>

            <div className="tw-text-center tw-mt-4">
              <p className="tw-text-sm tw-text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="tw-font-medium tw-text-primary hover:tw-underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="tw-relative">
              <div className="tw-absolute tw-inset-0 tw-flex tw-items-center">
                <span className="tw-w-full tw-border-t tw-border-gray-100" />
              </div>
              <div className="tw-relative tw-flex tw-justify-center tw-text-xs tw-uppercase">
                <span className="tw-bg-white tw-px-3 tw-text-gray-400 tw-font-medium">Or continue with</span>
              </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-4">
              <button 
                type="button"
                onClick={() => handleSocialLogin('google')} 
                disabled={loading}
                className="tw-flex tw-items-center tw-justify-center tw-h-11 tw-px-4 tw-border tw-border-gray-200 tw-rounded-lg tw-bg-white tw-text-gray-600 tw-font-medium tw-text-sm hover:tw-bg-gray-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
              >
                <svg className="tw-mr-2 tw-h-5 tw-w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('facebook')} 
                disabled={loading}
                className="tw-flex tw-items-center tw-justify-center tw-h-11 tw-px-4 tw-border tw-border-gray-200 tw-rounded-lg tw-bg-white tw-text-gray-600 tw-font-medium tw-text-sm hover:tw-bg-gray-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
              >
                <svg className="tw-mr-2 tw-h-5 tw-w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.747-2.971 2.54e.g.v1.422h3.326l-.342 3.667h-2.984v7.98h-5.843z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
