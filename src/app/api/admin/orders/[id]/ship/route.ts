import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { nimbusPostService } from '@/lib/nimbuspost';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true }
        },
        shipment: true
      }
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (order.shipment) {
      return NextResponse.json({ success: false, message: 'Order already shipped' }, { status: 400 });
    }

    const customerInfo = order.customerInfo as any;
    const shippingAddress = order.shippingAddress as any;

    const shipmentResult = await nimbusPostService.createShipment({
        orderNumber: order.orderNumber,
        paymentMethod: order.paymentMethod,
        totalAmount: Number(order.totalAmount),
        weight: 500, // Default weight
        length: 10, breadth: 10, height: 10,
        consignee: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            address: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            phone: customerInfo.phone,
            email: customerInfo.email,
        },
        items: order.items.map(item => ({
            name: item.product?.name || 'Item',
            qty: item.quantity,
            price: Number(item.unitPrice),
            sku: item.product?.slug
        }))
    });

    if (!shipmentResult.success) {
        throw new Error(String(shipmentResult.error) || 'NimbusPost API Error');
    }

    const shipment = await prisma.shipment.create({
        data: {
            orderId: order.id,
            awbNumber: shipmentResult.awb,
            carrier: shipmentResult.courierName,
            status: 'created',
            labelUrl: shipmentResult.labelUrl,
            trackingData: {
                shipment_id: shipmentResult.shipmentId,
                courier_id: shipmentResult.courierId
            }
        }
    });

    // Update Order Status
    await prisma.order.update({
        where: { id: order.id },
        data: { status: 'processing' }
    });

    return NextResponse.json({ success: true, shipment });

  } catch (error) {
    console.error('Shipment creation failed:', error);
    return NextResponse.json({ success: false, message: 'Failed to create shipment' }, { status: 500 });
  }
}
