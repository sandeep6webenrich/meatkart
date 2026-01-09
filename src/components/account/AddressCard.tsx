'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Pencil } from 'lucide-react'
import { deleteAddress } from '@/app/actions/user'
import { toast } from 'sonner'
import { useTransition } from 'react'

interface AddressCardProps {
  address: any // Type this properly if possible
  userName: string
}

export function AddressCard({ address, userName }: AddressCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this address?')) {
        startTransition(async () => {
            const result = await deleteAddress(address.id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Address deleted')
            }
        })
    }
  }

  return (
    <Card className="tw-relative">
      <CardContent className="tw-pt-6">
        {address.isDefault && (
          <Badge className="tw-absolute tw-top-4 tw-right-4">Default</Badge>
        )}
        {address.type && (
            <span className="tw-absolute tw-top-4 tw-left-4 tw-text-xs tw-bg-gray-100 tw-px-2 tw-py-1 tw-rounded tw-uppercase tw-font-medium tw-text-gray-600">
                {address.type}
            </span>
        )}
        <div className="tw-mb-4 tw-mt-6">
          <p className="tw-font-medium tw-text-lg">{userName}</p>
          <p className="tw-text-gray-600">{address.street}</p>
          <p className="tw-text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
          {address.landmark && <p className="tw-text-gray-500 tw-text-sm tw-mt-1">Landmark: {address.landmark}</p>}
        </div>
        <div className="tw-flex tw-gap-2 tw-mt-4">
          <Button variant="outline" size="sm" className="tw-flex-1">
            <Pencil size={14} className="tw-mr-2" /> Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="tw-text-red-600 hover:tw-text-red-700 hover:tw-bg-red-50"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
