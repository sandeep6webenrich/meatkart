import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, totalAmount, customer } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // 1. Create or Find User (Simple implementation: find by phone or create new "guest" user)
    // In a real app with Auth, we would use the session user ID.
    // For now, we'll create a user record for this guest checkout if phone doesn't exist.
    
    let user = await prisma.user.findUnique({
      where: { phone: customer.phone }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: customer.phone,
          name: customer.name,
          email: customer.email || null,
          role: 'customer'
        }
      })
    }

    // 2. Create Order
    // Generate a simple order number (timestamp + random)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        totalAmount,
        status: 'pending',
        paymentMethod: 'COD', // Defaulting to COD for this flow
        deliveryAddress: {
            street: customer.address,
            city: customer.city,
            pincode: customer.pincode,
            phone: customer.phone,
            name: customer.name
        },
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            weightId: item.weightId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            cutType: item.cutType
          }))
        }
      }
    })

    return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
