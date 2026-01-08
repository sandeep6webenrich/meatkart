import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validations/checkout';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
import { nimbusPostService } from '@/lib/nimbuspost';
import { notificationService } from '@/lib/notification-service';

// Extend schema to include cart items for API validation
const orderApiSchema = checkoutSchema.extend({
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
  })).min(1, 'Order must contain at least one item'),
  totalAmount: z.number().min(0),
});

export async function POST(request: Request) {
  try {
    // 1. Verify Authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = orderApiSchema.parse(body);
    
    const { 
      firstName, lastName, phone, 
      address, city, state, pincode, 
      paymentMethod, items, totalAmount 
    } = validatedData;

    // Generate a simple order number (e.g., ORD-timestamp-random)
    // Shortened to fit VARCHAR(20) limit: ORD-YYYYMMDD-XXXX
    const date = new Date();
    const dateStr = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `ORD-${dateStr}-${random}`;

    // Use a transaction to create User, Order, and OrderItems
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify user exists in database
      const user = await tx.user.findUnique({
        where: { id: session.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // 2. Create the Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          totalAmount,
          status: 'pending',
          paymentMethod,
          paymentStatus: 'pending',
          shippingAddress: {
            street: address,
            city,
            state,
            pincode,
          },
          customerInfo: {
            firstName,
            lastName,
            email: session.email, // Use email from session
            phone,
          },
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
            })),
          },
        },
      });

      return newOrder;
    });

    // --- Automatic NimbusPost Sync ---
    try {
        // Fetch full order details with products for Nimbus
        const fullOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (fullOrder && process.env.NIMBUSPOST_EMAIL && process.env.NIMBUSPOST_PASSWORD) {
            const shipmentResult = await nimbusPostService.createShipment({
                orderNumber: fullOrder.orderNumber,
                paymentMethod: fullOrder.paymentMethod,
                totalAmount: Number(fullOrder.totalAmount),
                weight: 500, // Default weight 500g, ideally should sum from products
                length: 10, breadth: 10, height: 10, // Default dimensions
                consignee: {
                    name: `${firstName} ${lastName}`,
                    address: address,
                    city: city,
                    state: state,
                    pincode: pincode,
                    phone: phone,
                    email: session.email,
                },
                items: fullOrder.items.map(item => ({
                    name: item.product?.name || 'Item',
                    qty: item.quantity,
                    price: Number(item.unitPrice),
                    sku: item.product?.slug
                }))
            });

            if (shipmentResult.success && shipmentResult.awb) {
                await prisma.shipment.create({
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
                
                // Update Order Status to Processing
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: 'processing' }
                });
            }
        }
    } catch (syncError) {
        console.error('Auto-sync to NimbusPost failed:', syncError);
        // Do not fail the request, just log it. Admin can manually sync later.
    }
    // ---------------------------------

    // --- Trigger Notifications ---
    notificationService.notifyOrderCreated(order).catch(err => 
        console.error('Notification trigger failed:', err)
    );
    // -----------------------------

    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      orderNumber: order.orderNumber 
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation failed:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
