import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { MapPin } from 'lucide-react'
import { AddAddressDialog } from '@/components/account/AddAddressDialog'
import { AddressCard } from '@/components/account/AddressCard'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      addresses: {
        orderBy: { isDefault: 'desc' }
      }
    }
  })

  const addresses = user?.addresses || []

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h2 className="tw-text-2xl tw-font-bold">My Addresses</h2>
        <AddAddressDialog />
      </div>

      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
        {addresses.length === 0 ? (
          <div className="tw-col-span-full tw-text-center tw-py-12 tw-bg-white tw-rounded-xl tw-border tw-border-dashed">
            <MapPin className="tw-mx-auto tw-h-12 tw-w-12 tw-text-gray-300 tw-mb-3" />
            <h3 className="tw-text-lg tw-font-medium tw-text-gray-900">No addresses found</h3>
            <p className="tw-text-gray-500 tw-mb-4">Add a shipping address to speed up checkout.</p>
            <AddAddressDialog />
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard key={address.id} address={address} userName={user?.name || ''} />
          ))
        )}
      </div>
    </div>
  )
}
