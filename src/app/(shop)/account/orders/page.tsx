import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { orderItems: true } }
        }
      }
    }
  })

  const orders = user?.orders || []

  return (
    <div className="tw-space-y-6">
      <h2 className="tw-text-2xl tw-font-bold">My Orders</h2>

      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-overflow-hidden">
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-text-left tw-text-sm">
            <thead className="tw-bg-gray-50 tw-border-b">
              <tr>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Order #</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Date</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Status</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Total</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500 tw-text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="tw-divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="tw-px-6 tw-py-8 tw-text-center tw-text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:tw-bg-gray-50 tw-transition-colors">
                    <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="tw-px-6 tw-py-4">
                      <span className={`tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-capitalize ${
                        order.status === 'delivered' ? 'tw-bg-green-100 tw-text-green-800' :
                        order.status === 'cancelled' ? 'tw-bg-red-100 tw-text-red-800' :
                        'tw-bg-yellow-100 tw-text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-right">
                      <Link href={`/account/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" className="tw-text-primary">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
