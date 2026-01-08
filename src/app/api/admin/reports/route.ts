import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    // Default to 30 days ago if not provided
    const startDate = startDateParam 
      ? new Date(startDateParam) 
      : new Date(new Date().setDate(endDate.getDate() - 30));

    // Ensure dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ success: false, message: 'Invalid date parameters' }, { status: 400 });
    }

    // Set time boundaries
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Fetch Sales and Orders Data (Grouped by Day)
    // Using PostgreSQL to_char for date formatting
    const salesData: any[] = await prisma.$queryRaw`
      SELECT
        to_char(created_at, 'YYYY-MM-DD') as date,
        COUNT(id) as orders,
        SUM(total_amount) as sales
      FROM orders
      WHERE created_at >= ${startDate} AND created_at <= ${endDate} 
      AND status != 'cancelled'
      GROUP BY to_char(created_at, 'YYYY-MM-DD')
      ORDER BY date ASC
    `;

    // Fetch New Customers Data (Grouped by Day)
    const customerData: any[] = await prisma.$queryRaw`
      SELECT
        to_char(created_at, 'YYYY-MM-DD') as date,
        COUNT(id) as count
      FROM users
      WHERE created_at >= ${startDate} AND created_at <= ${endDate} 
      AND role = 'customer'
      GROUP BY to_char(created_at, 'YYYY-MM-DD')
      ORDER BY date ASC
    `;

    // Format data
    const formattedSales = salesData.map(item => ({
      date: item.date,
      orders: Number(item.orders),
      sales: Number(item.sales || 0)
    }));

    const formattedCustomers = customerData.map(item => ({
      date: item.date,
      count: Number(item.count)
    }));

    // Calculate summary stats
    const totalSales = formattedSales.reduce((sum, item) => sum + item.sales, 0);
    const totalOrders = formattedSales.reduce((sum, item) => sum + item.orders, 0);
    const newCustomers = formattedCustomers.reduce((sum, item) => sum + item.count, 0);

    return NextResponse.json({
      success: true,
      data: {
        sales: formattedSales,
        customers: formattedCustomers,
        summary: {
          totalSales,
          totalOrders,
          newCustomers
        }
      }
    });

  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
