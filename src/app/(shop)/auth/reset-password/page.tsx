'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({ password })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Password updated successfully')
                router.push('/auth/login?message=Password updated successfully. Please login.')
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

                <h3 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2 tw-text-center">Set New Password</h3>
                <p className="tw-text-gray-600 tw-text-center tw-mb-8">
                    Please enter your new password below.
                </p>

                <form onSubmit={handleSubmit} className="tw-space-y-6">
                    <div className="tw-space-y-2">
                        <Label htmlFor="password" className="tw-font-medium text-gray-700">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="tw-h-12"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="tw-space-y-2">
                        <Label htmlFor="confirmPassword" className="tw-font-medium text-gray-700">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="tw-h-12"
                            required
                            minLength={6}
                        />
                    </div>

                    <Button type="submit" className="tw-w-full tw-h-12 tw-bg-primary hover:bg-red-700 tw-text-lg" disabled={loading}>
                        {loading ? <Loader2 className="tw-mr-2 tw-h-5 tw-w-5 tw-animate-spin" /> : 'Update Password'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
