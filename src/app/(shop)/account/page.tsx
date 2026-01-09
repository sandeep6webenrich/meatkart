import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Package, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  // Find prisma user by email
  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      orders: {
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { orderItems: true } }
        }
      },
      addresses: {
        where: { isDefault: true },
        take: 1
      }
    }
  })

  return (
    <div className="tw-space-y-6">
      <div className="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-sm tw-border">
        <h2 className="tw-text-xl tw-font-semibold tw-mb-2">Hello, {user?.name || authUser.email}</h2>
        <p className="tw-text-gray-500">
          From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
        </p>
      </div>

      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
        <Card>
          <CardHeader className="tw-flex tw-flex-row tw-items-center tw-justify-between">
            <CardTitle className="tw-text-lg">Recent Orders</CardTitle>
            <Link href="/account/orders">
              <Button variant="link" className="tw-text-primary">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {user?.orders && user.orders.length > 0 ? (
              <div className="tw-space-y-4">
                {user.orders.map(order => (
                  <div key={order.id} className="tw-flex tw-items-center tw-justify-between tw-border-b tw-pb-3 last:tw-border-0 last:tw-pb-0">
                    <div>
                      <p className="tw-font-medium">#{order.orderNumber}</p>
                      <p className="tw-text-sm tw-text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="tw-text-right">
                      <span className={`tw-inline-block tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-capitalize ${
                        order.status === 'delivered' ? 'tw-bg-green-100 tw-text-green-800' :
                        order.status === 'cancelled' ? 'tw-bg-red-100 tw-text-red-800' :
                        'tw-bg-yellow-100 tw-text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tw-text-center tw-py-6 tw-text-gray-500">
                <Package className="tw-mx-auto tw-h-10 tw-w-10 tw-text-gray-300 tw-mb-2" />
                <p>No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="tw-flex tw-flex-row tw-items-center tw-justify-between">
            <CardTitle className="tw-text-lg">Default Address</CardTitle>
            <Link href="/account/addresses">
              <Button variant="link" className="tw-text-primary">Manage</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {user?.addresses && user.addresses.length > 0 ? (
              <div className="tw-text-sm tw-text-gray-600">
                <p className="tw-font-medium tw-text-gray-900 tw-mb-1">{user.name}</p>
                <p>{user.addresses[0].street}</p>
                <p>{user.addresses[0].city}, {user.addresses[0].state}</p>
                <p>{user.addresses[0].pincode}</p>
                <p className="tw-mt-2">Phone: {user.phone}</p>
              </div>
            ) : (
              <div className="tw-text-center tw-py-6 tw-text-gray-500">
                <MapPin className="tw-mx-auto tw-h-10 tw-w-10 tw-text-gray-300 tw-mb-2" />
                <p>No default address set</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
