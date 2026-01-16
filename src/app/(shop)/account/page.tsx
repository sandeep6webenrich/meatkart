import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Package, MapPin, User, Heart, Wallet, Bell } from 'lucide-react'

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
      },
      wallet: true,
      wishlist: {
        include: {
          _count: {
            select: { items: true }
          }
        }
      }
    }
  })

  const wishlistCount = user?.wishlist?._count?.items || 0

  return (
    <div className="tw-space-y-6">
      <div className="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-sm tw-border">
        <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-justify-between tw-gap-4">
          <div>
            <h2 className="tw-text-xl tw-font-semibold tw-mb-2">Hello, {user?.name || authUser.email}</h2>
            <div className="tw-text-gray-500 tw-space-y-1">
              <p className="tw-flex tw-items-center tw-gap-2">
                <span className="tw-font-medium">Email:</span> {user?.email}
              </p>
              <p className="tw-flex tw-items-center tw-gap-2">
                <span className="tw-font-medium">Mobile:</span> {user?.phone}
              </p>
              <p className="tw-flex tw-items-center tw-gap-2">
                <span className="tw-font-medium">Status:</span>
                <span className="tw-bg-green-100 tw-text-green-800 tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium">Active</span>
              </p>
            </div>
          </div>
          {user?.wallet && (
            <div className="tw-bg-gray-50 tw-p-4 tw-rounded-lg tw-border tw-min-w-[200px]">
              <p className="tw-text-sm tw-text-gray-500 tw-mb-1">Wallet Balance</p>
              <p className="tw-text-2xl tw-font-bold tw-text-primary">₹{Number(user.wallet.balance).toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
        <Link href="/account/orders" className="tw-group">
          <Card className="tw-h-full hover:tw-shadow-md tw-transition-shadow tw-cursor-pointer">
            <CardContent className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-6 tw-text-center">
              <div className="tw-bg-blue-50 tw-p-3 tw-rounded-full tw-mb-3 group-hover:tw-bg-blue-100 tw-transition-colors">
                <Package className="tw-h-6 tw-w-6 tw-text-blue-600" />
              </div>
              <h3 className="tw-font-medium tw-text-gray-900">Orders</h3>
              <p className="tw-text-xs tw-text-gray-500 tw-mt-1">Check status</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/addresses" className="tw-group">
          <Card className="tw-h-full hover:tw-shadow-md tw-transition-shadow tw-cursor-pointer">
            <CardContent className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-6 tw-text-center">
              <div className="tw-bg-orange-50 tw-p-3 tw-rounded-full tw-mb-3 group-hover:tw-bg-orange-100 tw-transition-colors">
                <MapPin className="tw-h-6 tw-w-6 tw-text-orange-600" />
              </div>
              <h3 className="tw-font-medium tw-text-gray-900">Addresses</h3>
              <p className="tw-text-xs tw-text-gray-500 tw-mt-1">Manage delivery</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/wishlist" className="tw-group">
          <Card className="tw-h-full hover:tw-shadow-md tw-transition-shadow tw-cursor-pointer">
            <CardContent className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-6 tw-text-center">
              <div className="tw-bg-pink-50 tw-p-3 tw-rounded-full tw-mb-3 group-hover:tw-bg-pink-100 tw-transition-colors">
                <Heart className="tw-h-6 tw-w-6 tw-text-pink-600" />
              </div>
              <h3 className="tw-font-medium tw-text-gray-900">Wishlist</h3>
              <p className="tw-text-xs tw-text-gray-500 tw-mt-1">{wishlistCount} Saved items</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/profile" className="tw-group">
          <Card className="tw-h-full hover:tw-shadow-md tw-transition-shadow tw-cursor-pointer">
            <CardContent className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-6 tw-text-center">
              <div className="tw-bg-purple-50 tw-p-3 tw-rounded-full tw-mb-3 group-hover:tw-bg-purple-100 tw-transition-colors">
                <User className="tw-h-6 tw-w-6 tw-text-purple-600" />
              </div>
              <h3 className="tw-font-medium tw-text-gray-900">Profile</h3>
              <p className="tw-text-xs tw-text-gray-500 tw-mt-1">Edit details</p>
            </CardContent>
          </Card>
        </Link>
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
                      <span className={`tw-inline-block tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-capitalize ${order.status === 'delivered' ? 'tw-bg-green-100 tw-text-green-800' :
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
