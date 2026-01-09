'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ShoppingBag, MapPin, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const links = [
    { href: '/account', label: 'Overview', icon: User },
    { href: '/account/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  ]

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged out successfully')
      router.push('/auth/login')
      router.refresh()
    }
  }

  return (
    <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-p-4 tw-h-fit">
      <div className="tw-space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`tw-flex tw-items-center tw-gap-3 tw-px-4 tw-py-3 tw-rounded-lg tw-transition-colors ${
                isActive 
                  ? 'tw-bg-red-50 tw-text-primary tw-font-medium' 
                  : 'tw-text-gray-600 hover:tw-bg-gray-50 hover:tw-text-gray-900'
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          )
        })}
        
        <button
          onClick={handleLogout}
          className="tw-w-full tw-flex tw-items-center tw-gap-3 tw-px-4 tw-py-3 tw-rounded-lg tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-red-600 tw-transition-colors tw-mt-4 tw-border-t"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
