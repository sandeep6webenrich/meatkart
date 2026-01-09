import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, Trash2, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
        <Button>
          <Plus size={16} className="tw-mr-2" />
          Add New Address
        </Button>
      </div>

      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
        {addresses.length === 0 ? (
          <div className="tw-col-span-full tw-text-center tw-py-12 tw-bg-white tw-rounded-xl tw-border tw-border-dashed">
            <MapPin className="tw-mx-auto tw-h-12 tw-w-12 tw-text-gray-300 tw-mb-3" />
            <h3 className="tw-text-lg tw-font-medium tw-text-gray-900">No addresses found</h3>
            <p className="tw-text-gray-500 tw-mb-4">Add a shipping address to speed up checkout.</p>
            <Button>Add Address</Button>
          </div>
        ) : (
          addresses.map((address) => (
            <Card key={address.id} className="tw-relative">
              <CardContent className="tw-pt-6">
                {address.isDefault && (
                  <Badge className="tw-absolute tw-top-4 tw-right-4">Default</Badge>
                )}
                <div className="tw-mb-4">
                  <p className="tw-font-medium tw-text-lg">{user?.name}</p>
                  <p className="tw-text-gray-600">{address.street}</p>
                  <p className="tw-text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                  {address.landmark && <p className="tw-text-gray-500 tw-text-sm tw-mt-1">Landmark: {address.landmark}</p>}
                </div>
                <div className="tw-flex tw-gap-2 tw-mt-4">
                  <Button variant="outline" size="sm" className="tw-flex-1">
                    <Pencil size={14} className="tw-mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="tw-text-red-600 hover:tw-text-red-700 hover:tw-bg-red-50">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
