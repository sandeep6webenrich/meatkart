export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, MapPin, Mail, Phone, Calendar, CreditCard, User, Truck, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater';
import DownloadInvoiceButton from '@/components/admin/DownloadInvoiceButton';
import ShipOrderButton from '@/components/admin/ShipOrderButton';
import SyncTrackingButton from '@/components/admin/SyncTrackingButton';

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      shipment: true,
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              }
            }
          }
        }
      }
    },
  });

  if (!order) return null;
  return order;
}

export default async function AdminOrderDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddress as any;
  const customerInfo = order.customerInfo as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Order #{order.orderNumber}</h1>
            <p className="text-sm text-stone-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ShipOrderButton orderId={order.id} isShipped={!!order.shipment} />
          <DownloadInvoiceButton order={order} />
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipment Info */}
          {order.shipment && (
            <div className="rounded-xl bg-white shadow-sm border border-stone-100 overflow-hidden">
              <div className="border-b border-stone-100 px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Shipment Details
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full uppercase">
                    {order.shipment.status}
                  </span>
                  <SyncTrackingButton orderId={order.id} />
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-stone-500 mb-1">Carrier</p>
                  <p className="font-medium text-stone-900">{order.shipment.carrier || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 mb-1">AWB Number</p>
                  <p className="font-medium text-stone-900 font-mono">{order.shipment.awbNumber || 'N/A'}</p>
                </div>
                {order.shipment.labelUrl && (
                  <div className="md:col-span-2">
                    <a 
                      href={order.shipment.labelUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Download Shipping Label
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="rounded-xl bg-white shadow-sm border border-stone-100 overflow-hidden">
            <div className="border-b border-stone-100 px-6 py-4">
              <h2 className="text-lg font-bold text-stone-900">Order Items</h2>
            </div>
            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-6">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100 border border-stone-200">
                    {item.product?.images[0] ? (
                      <Image
                        src={item.product.images[0].imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stone-400">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-stone-900 truncate">
                      {item.product?.name || 'Unknown Product'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      Unit Price: ₹{Number(item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-stone-900">
                      ₹{Number(item.totalPrice).toFixed(2)}
                    </p>
                    <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-stone-50 px-6 py-4">
              <div className="flex justify-between text-sm font-medium text-stone-900">
                <span>Total Amount</span>
                <span className="text-lg">₹{Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-stone-400" />
              Customer Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-stone-600">
                <User className="h-4 w-4" />
                <span>{customerInfo?.firstName} {customerInfo?.lastName}</span>
              </div>
              <div className="flex items-center gap-3 text-stone-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${customerInfo?.email}`} className="hover:text-green-600">
                  {customerInfo?.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-stone-600">
                <Phone className="h-4 w-4" />
                <span>{customerInfo?.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-stone-400" />
              Shipping Address
            </h2>
            <address className="not-italic text-sm text-stone-600 space-y-1">
              <p>{shippingAddress?.street}</p>
              <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.pincode}</p>
            </address>
          </div>

          {/* Payment Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-stone-400" />
              Payment Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Method</span>
                <span className="font-medium capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize
                  ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon component
function Package({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}
