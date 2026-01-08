import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch orders for the current user to extract addresses
    const orders = await prisma.order.findMany({
      where: {
        userId: session.id,
      },
      select: {
        shippingAddress: true,
        customerInfo: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Extract and deduplicate addresses
    const uniqueAddressesMap = new Map();

    orders.forEach((order) => {
      const shipping = order.shippingAddress as any;
      const customer = order.customerInfo as any;

      if (!shipping || !customer) return;

      // Create a unique key for the address to handle deduplication
      const key = `${customer.firstName}-${customer.lastName}-${customer.phone}-${shipping.street}-${shipping.city}-${shipping.state}-${shipping.pincode}`;

      if (!uniqueAddressesMap.has(key)) {
        uniqueAddressesMap.set(key, {
          id: key, // Use the generated key as a temporary ID
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          address: shipping.street, // Map 'street' back to 'address' for the form
          city: shipping.city,
          state: shipping.state,
          pincode: shipping.pincode,
        });
      }
    });

    const addresses = Array.from(uniqueAddressesMap.values());

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
