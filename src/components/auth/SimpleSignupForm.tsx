'use client'

import { useMemo, useState } from 'react'
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
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export function SimpleSignupForm() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (e: any) {
      setErrorMsg(e?.message || 'Supabase configuration missing')
      return null
    }
  }, [])

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    setLoading(true)
    setErrorMsg('')
    try {
      if (!supabase) {
        toast.error('Supabase configuration missing')
        return
      }
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Check your email to confirm your account')
      router.push('/auth/login')
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-slate-50 tw-p-12">
      <div className="tw-w-full tw-max-w-3xl tw-bg-white tw-border tw-border-gray-100 tw-rounded-2xl tw-shadow-2xl tw-p-12">
        <div className="tw-flex tw-items-center tw-justify-center tw-mb-10">
          <img src="/images/logo.png" alt="MeatKart" className="tw-h-14 tw-w-auto" />
        </div>
        <h3 className="tw-text-4xl tw-font-bold tw-text-gray-900 tw-mb-4">Create account</h3>
        <p className="tw-text-gray-600 tw-text-lg tw-mb-8">Sign up with your email and password.</p>
        {errorMsg && (
          <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-text-red-600 tw-px-5 tw-py-4 tw-rounded-lg tw-mb-8 tw-text-base">
            {errorMsg}
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="tw-space-y-8">
          <div className="tw-space-y-2">
            <Label htmlFor="email" className="tw-text-lg tw-font-medium tw-text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="tw-h-16 tw-text-lg tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-xl tw-transition-all"
              {...form.register('email')}
              disabled={loading}
            />
            {form.formState.errors.email && (
              <p className="tw-text-sm tw-text-red-500 tw-mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="tw-space-y-2">
            <Label htmlFor="password" className="tw-text-lg tw-font-medium tw-text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="tw-h-16 tw-text-lg tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-xl tw-transition-all"
              {...form.register('password')}
              disabled={loading}
            />
            {form.formState.errors.password && (
              <p className="tw-text-sm tw-text-red-500 tw-mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="tw-space-y-2">
            <Label htmlFor="confirmPassword" className="tw-text-lg tw-font-medium tw-text-gray-700">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="tw-h-16 tw-text-lg tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-xl tw-transition-all"
              {...form.register('confirmPassword')}
              disabled={loading}
            />
            {form.formState.errors.confirmPassword && (
              <p className="tw-text-sm tw-text-red-500 tw-mt-1">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="tw-w-full tw-h-16 tw-bg-primary tw-hover:bg-red-700 tw-text-white tw-text-xl tw-font-semibold tw-rounded-xl tw-shadow-2xl tw-transition-all" disabled={loading}>
            {loading ? <Loader2 className="tw-mr-2 tw-h-7 tw-w-7 tw-animate-spin" /> : 'Sign Up'}
          </Button>
          <div className="tw-text-center">
            <p className="tw-text-sm tw-text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="tw-font-medium tw-text-primary hover:tw-underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
