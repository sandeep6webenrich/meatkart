import { prisma } from '@/lib/prisma';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  const [orderCount, productCount, revenueResult, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          not: 'cancelled' // Exclude cancelled orders from revenue
        }
      }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        _count: {
          select: { items: true }
        }
      },
    }),
  ]);

  const totalRevenue = revenueResult._sum.totalAmount || 0;

  return {
    orderCount,
    productCount,
    totalRevenue: Number(totalRevenue),
    recentOrders,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      name: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Total Orders',
      value: stats.orderCount,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Products',
      value: stats.productCount,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      name: 'Growth',
      value: '+12.5%', // Placeholder for now
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl bg-white p-6 shadow-sm border border-stone-100 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-stone-900">{stat.value}</p>
              </div>
              <div className={`rounded-full p-3 text-white ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-white shadow-sm border border-stone-100 overflow-hidden">
        <div className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">Recent Orders</h2>
          <Link 
            href="/admin/orders" 
            className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-stone-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {order.user?.email || 'Guest User'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {order._count.items} items
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-stone-900">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
