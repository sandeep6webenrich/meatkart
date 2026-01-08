'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  User,
  MapPin,
  CreditCard,
  LogOut,
  LayoutDashboard,
  Edit2,
  Save,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

// --- Types ---
interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  images: ProductImage[];
}

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product: Product | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: any;
}

interface SavedAddress {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

// --- Main Component ---
export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Loading States
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch Data based on active tab
  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin');
      return;
    }

    if (activeTab === 'overview' || activeTab === 'orders') fetchOrders();
    if (activeTab === 'overview' || activeTab === 'addresses') fetchAddresses();
    if (activeTab === 'overview' || activeTab === 'profile') fetchProfile();
  }, [activeTab, user, router]);

  const fetchOrders = async () => {
    if (orders.length > 0) return; // specific cache
    setLoadingOrders(true);
    try {
      const response = await fetch('/api/orders/user');
      if (response.status === 401) {
        router.push('/login?returnUrl=/account');
        return;
      }
      const result = await response.json();
      if (result.success) setOrders(result.orders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    if (addresses.length > 0) return;
    setLoadingAddresses(true);
    try {
      const response = await fetch('/api/user/addresses');
      const result = await response.json();
      if (result.success) setAddresses(result.addresses);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await fetch('/api/user/profile');
      const result = await response.json();
      if (result.success) setProfile(result.user);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                    {profile?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="font-bold text-gray-900 truncate">{profile?.name || user?.name || 'User'}</h2>
                    <p className="text-xs text-gray-500 truncate">{profile?.email || user?.email}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                <div className="my-2 border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <OverviewTab 
                profile={profile} 
                orders={orders} 
                addresses={addresses} 
                loading={loadingOrders || loadingProfile} 
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} loading={loadingOrders} />
            )}
            {activeTab === 'addresses' && (
              <AddressesTab addresses={addresses} loading={loadingAddresses} />
            )}
            {activeTab === 'profile' && (
              <ProfileTab profile={profile} loading={loadingProfile} refreshProfile={fetchProfile} />
            )}
            {activeTab === 'payments' && (
              <PaymentsTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function OverviewTab({ profile, orders, addresses, loading, setActiveTab }: any) {
  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome back, {profile?.name?.split(' ')[0]}!</h2>
        <p className="text-gray-500">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              {orders.filter((o: any) => o.status === 'delivered').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Saved Addresses</p>
            <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <button onClick={() => setActiveTab('orders')} className="text-sm text-green-600 font-medium hover:underline">View All</button>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No recent orders</div>
        ) : (
          <div>
            {orders.slice(0, 2).map((order: any) => (
               <div key={order.id} className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                 <div className="flex justify-between items-center">
                   <div>
                     <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                     <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-medium text-gray-900">₹{order.totalAmount}</p>
                     <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">{order.status}</span>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Download } from 'lucide-react';
import { generateInvoice } from '@/lib/invoice';

function OrdersTab({ orders, loading }: { orders: Order[], loading: boolean }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mt-2">Looks like you haven't placed any orders yet.</p>
          <Link href="/shop" className="inline-block mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-gray-900">#{order.orderNumber}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-lg text-gray-900">₹{Number(order.totalAmount).toFixed(2)}</p>
                    </div>
                    {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Order Items</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateInvoice(order as any);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium shadow-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download Invoice
                    </button>
                  </div>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          {item.product?.images[0]?.imageUrl ? (
                            <Image
                              src={item.product.images[0].imageUrl}
                              alt={item.product.images[0].altText || item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 truncate">{item.product?.name || 'Unknown Product'}</h5>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right font-medium text-gray-900">₹{Number(item.totalPrice).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-900">{order.shippingAddress?.street}</p>
                    <p className="text-sm text-gray-900">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesTab({ addresses, loading }: { addresses: SavedAddress[], loading: boolean }) {
  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
        {/* Future: Add 'New Address' button logic here if we build a management UI */}
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No addresses saved</h3>
          <p className="text-gray-500 mt-2">Addresses used in checkout will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group hover:border-green-200 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{addr.firstName} {addr.lastName}</h3>
              <p className="text-gray-600 text-sm mb-1">{addr.address}</p>
              <p className="text-gray-600 text-sm mb-3">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <span className="font-medium">Phone:</span> {addr.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileTab({ profile, loading, refreshProfile }: { profile: UserProfile | null, loading: boolean, refreshProfile: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsEditing(false);
        refreshProfile();
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-2xl font-bold">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{profile?.name}</h3>
              <p className="text-gray-500">{profile?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                {profile?.role} Account
              </span>
            </div>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
                placeholder="Not set"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-gray-900 font-medium">{profile?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-gray-900 font-medium">{profile?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              <p className="text-gray-900 font-medium">{profile?.phone || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
              <p className="text-gray-900 font-medium">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Saved Payment Methods</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <CreditCard className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No saved cards</h3>
        <p className="text-gray-500 mt-2">
          We currently do not store credit card details for security reasons.<br/>
          You can save payment methods during your next checkout with our payment partners.
        </p>
      </div>
    </div>
  );
}
