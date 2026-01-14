import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, MapPin, CreditCard, Package, FileText, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) redirect('/auth/login')

  const order = await prisma.order.findFirst({
    where: {
      id,
      user: { email: authUser.email } // Ensure user owns the order
    },
    include: {
      orderItems: {
        include: {
          product: true,
          productWeight: true
        }
      }
    }
  })

  if (!order) notFound()

  const deliveryAddress = order.deliveryAddress as any

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-gap-4">
        <Link href="/account/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="tw-text-2xl tw-font-bold">Order #{order.orderNumber}</h1>
          <p className="tw-text-sm tw-text-gray-500">
            Placed on {format(new Date(order.createdAt), "PPP")}
          </p>
        </div>
      </div>

      <div className="tw-flex tw-gap-3">
        <Link href={`/account/orders/${order.id}/invoice`}>
          <Button variant="outline" className="tw-flex tw-gap-2">
            <FileText size={16} /> Download Invoice
          </Button>
        </Link>
        <Button className="tw-flex tw-gap-2">
          <RefreshCw size={16} /> Reorder
        </Button>
      </div>

      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
        <div className="md:tw-col-span-2 tw-space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="tw-flex tw-items-center tw-justify-between tw-border-b tw-pb-4 last:tw-border-0 last:tw-pb-0">
                  <div className="tw-flex tw-items-center tw-gap-4">
                    <div className="tw-h-16 tw-w-16 tw-bg-gray-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
                      <Package className="tw-text-gray-400" size={24} />
                    </div>
                    <div>
                      <p className="tw-font-medium">{item.product.name}</p>
                      <p className="tw-text-sm tw-text-gray-500">
                        {item.productWeight.weight} • {item.cutType || 'Standard'}
                      </p>
                    </div>
                  </div>
                  <div className="tw-text-right">
                    <p className="tw-font-medium">₹{Number(item.totalPrice).toFixed(2)}</p>
                    <p className="tw-text-sm tw-text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="tw-space-y-2">
                <div className="tw-flex tw-justify-between tw-text-sm">
                  <span className="tw-text-gray-500">Subtotal</span>
                  <span>₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
                <div className="tw-flex tw-justify-between tw-text-sm">
                  <span className="tw-text-gray-500">Delivery</span>
                  <span>₹0.00</span>
                </div>
                <Separator className="tw-my-2" />
                <div className="tw-flex tw-justify-between tw-font-bold">
                  <span>Total</span>
                  <span>₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="tw-space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              <div>
                <p className="tw-text-sm tw-font-medium tw-text-gray-500 tw-mb-1">Address</p>
                <div className="tw-flex tw-items-start tw-gap-2">
                  <MapPin size={16} className="tw-mt-0.5 tw-text-gray-400" />
                  <div className="tw-text-sm">
                    <p className="tw-font-medium">{deliveryAddress?.name}</p>
                    <p>{deliveryAddress?.street}</p>
                    <p>{deliveryAddress?.city}, {deliveryAddress?.pincode}</p>
                    <p className="tw-mt-1">{deliveryAddress?.phone}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="tw-text-sm tw-font-medium tw-text-gray-500 tw-mb-1">Status</p>
                <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="tw-capitalize">
                  {order.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="tw-flex tw-items-center tw-gap-2">
                <CreditCard size={16} className="tw-text-gray-400" />
                <span className="tw-text-sm tw-capitalize">{order.paymentMethod}</span>
              </div>
              <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'} className="tw-mt-2 tw-capitalize">
                {order.paymentStatus}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
