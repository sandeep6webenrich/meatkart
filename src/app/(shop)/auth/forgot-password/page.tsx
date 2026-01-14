'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (error) {
                toast.error(error.message)
            } else {
                setSuccess(true)
                toast.success('Password reset email sent')
            }
        } catch (error: any) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-slate-50 tw-p-6">
            <div className="tw-w-full tw-max-w-md tw-bg-white tw-border tw-border-gray-100 tw-rounded-2xl tw-shadow-xl tw-p-8">
                <Link href="/auth/login" className="tw-inline-flex tw-items-center tw-text-gray-500 hover:tw-text-primary tw-mb-6 tw-transition-colors">
                    <ArrowLeft size={18} className="tw-mr-2" /> Back to Login
                </Link>

                <div className="tw-flex tw-justify-center tw-mb-6">
                    <img src="/images/logo.png" alt="MeatKart" className="tw-h-10 tw-w-auto" />
                </div>

                <h3 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2 tw-text-center">Reset Password</h3>

                {!success ? (
                    <>
                        <p className="tw-text-gray-600 tw-text-center tw-mb-8">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={handleSubmit} className="tw-space-y-6">
                            <div className="tw-space-y-2">
                                <Label htmlFor="email" className="tw-font-medium text-gray-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="tw-h-12"
                                    required
                                />
                            </div>

                            <Button type="submit" className="tw-w-full tw-h-12 tw-bg-primary hover:bg-red-700 tw-text-lg" disabled={loading}>
                                {loading ? <Loader2 className="tw-mr-2 tw-h-5 tw-w-5 tw-animate-spin" /> : 'Send Reset Link'}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="tw-text-center tw-space-y-6">
                        <div className="tw-bg-green-50 tw-text-green-800 tw-p-4 tw-rounded-lg">
                            Check your email! We've sent you a password reset link.
                        </div>
                        <p className="tw-text-sm tw-text-gray-500">
                            Did not receive the email? Check your spam folder or try again.
                        </p>
                        <Button variant="outline" onClick={() => setSuccess(false)} className="tw-w-full">
                            Try again
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
