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

    const shipment = await prisma.shipment.findUnique({
      where: { orderId: id },
    });

    if (!shipment || !shipment.awbNumber) {
      return NextResponse.json({ success: false, message: 'Shipment not found' }, { status: 404 });
    }

    const trackingInfo = await nimbusPostService.trackShipment(shipment.awbNumber);

    if (trackingInfo) {
      // Update local status based on Nimbus status
      // Mapping logic depends on Nimbus status codes. 
      // Assuming 'delivered', 'shipped', 'cancelled' strings.
      
      let newStatus = shipment.status;
      let orderStatus = undefined;

      if (trackingInfo.status) {
          newStatus = trackingInfo.status.toLowerCase();
          
          if (newStatus === 'delivered') orderStatus = 'delivered';
          else if (newStatus === 'shipped' || newStatus === 'in transit') orderStatus = 'shipped';
          else if (newStatus === 'cancelled') orderStatus = 'cancelled';
          else if (newStatus === 'rto') orderStatus = 'returned';
      }

      await prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          status: newStatus,
          trackingData: trackingInfo // Update full payload
        }
      });

      if (orderStatus) {
        await prisma.order.update({
            where: { id },
            data: { status: orderStatus as any }
        });
      }

      return NextResponse.json({ success: true, trackingInfo });
    }

    return NextResponse.json({ success: false, message: 'No tracking info available' });

  } catch (error) {
    console.error('Tracking sync failed:', error);
    return NextResponse.json({ success: false, message: 'Failed to sync tracking' }, { status: 500 });
  }
}
