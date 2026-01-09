import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AccountSidebar } from '@/components/account/AccountSidebar'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="tw-bg-gray-50 tw-min-h-screen tw-py-8">
      <div className="tw-container tw-mx-auto tw-px-4">
        <h1 className="tw-text-2xl tw-font-bold tw-mb-8">My Account</h1>
        
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4 tw-gap-8">
          <div className="lg:tw-col-span-1">
            <AccountSidebar />
          </div>
          <div className="lg:tw-col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
