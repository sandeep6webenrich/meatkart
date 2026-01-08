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

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number is too long'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export function LoginForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  })

  async function onPhoneSubmit(data: z.infer<typeof phoneSchema>) {
    setLoading(true)
    try {
      const formattedPhone = data.phone.startsWith('+') ? data.phone : `+91${data.phone}`
      setPhoneNumber(formattedPhone)
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('OTP sent to your mobile number')
      setStep('otp')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function onOtpSubmit(data: z.infer<typeof otpSchema>) {
    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: data.otp,
        type: 'sms',
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Successfully logged in')
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {step === 'phone' ? 'Sign in to MeatKart' : 'Enter OTP'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {step === 'phone' 
            ? 'Enter your mobile number to get started' 
            : `We sent a code to ${phoneNumber}`}
        </p>
      </div>

      {step === 'phone' ? (
        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 border rounded-md bg-slate-50 text-slate-500 text-sm">
                +91
              </div>
              <Input
                id="phone"
                placeholder="9876543210"
                type="tel"
                {...phoneForm.register('phone')}
                disabled={loading}
              />
            </div>
            {phoneForm.formState.errors.phone && (
              <p className="text-sm text-red-500">{phoneForm.formState.errors.phone.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password</Label>
            <Input
              id="otp"
              placeholder="123456"
              type="text"
              maxLength={6}
              className="text-center tracking-widest text-lg"
              {...otpForm.register('otp')}
              disabled={loading}
            />
            {otpForm.formState.errors.otp && (
              <p className="text-sm text-red-500">{otpForm.formState.errors.otp.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify OTP
          </Button>
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-sm text-slate-600"
              onClick={() => setStep('phone')}
              disabled={loading}
            >
              Change phone number
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
