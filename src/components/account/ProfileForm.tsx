'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from "@/app/actions/user"
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
    user: {
        name: string
        email: string | null
        phone: string
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const result = await updateProfile(formData)
            if (result.error) {
                if (typeof result.error === 'string') {
                    toast.error(result.error)
                } else {
                    // Check if it's an object of errors
                    const errors = Object.values(result.error).flat().join(', ')
                    toast.error(errors)
                }
            } else if (result.success) {
                toast.success(result.success)
            }
        } catch (e) {
            toast.error('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="tw-space-y-4">
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                <div className="tw-space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={user.name} placeholder="Enter your name" disabled={loading} />
                </div>
                <div className="tw-space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" defaultValue={user.email || ''} readOnly className="tw-bg-gray-50" />
                    <p className="tw-text-xs tw-text-gray-500">Email cannot be changed directly.</p>
                </div>
                <div className="tw-space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input id="phone" name="phone" defaultValue={user.phone} disabled={loading} />
                </div>
            </div>
            <div className="tw-pt-4">
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
