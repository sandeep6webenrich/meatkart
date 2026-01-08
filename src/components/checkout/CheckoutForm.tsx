'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore } from '@/store/useCartStore';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout';
import { useRouter } from 'next/navigation';

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

export default function CheckoutForm() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const totalAmount = getCartTotal();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod',
    },
  });

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await fetch('/api/user/addresses');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.addresses.length > 0) {
            setSavedAddresses(data.addresses);
          }
        }
      } catch (error) {
        console.error('Failed to fetch addresses', error);
      } finally {
        setIsLoadingAddresses(false);
      }
    }
    fetchAddresses();
  }, []);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    
    if (addressId === 'new') {
      reset({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod',
      });
    } else {
      const address = savedAddresses.find(a => a.id === addressId);
      if (address) {
        setValue('firstName', address.firstName);
        setValue('lastName', address.lastName);
        setValue('phone', address.phone);
        setValue('address', address.address);
        setValue('city', address.city);
        setValue('state', address.state);
        setValue('pincode', address.pincode);
      }
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order');
      }
      
      clearCart();
      router.push(`/checkout/success?orderNumber=${result.orderNumber}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-stone-500 mb-4">Your cart is empty.</p>
        <button onClick={() => router.push('/shop')} className="text-green-600 font-medium hover:underline">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Shipping Details */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Saved Addresses Selection */}
        {savedAddresses.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Select Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4">
              {savedAddresses.map((addr) => (
                <div 
                  key={addr.id}
                  onClick={() => handleAddressSelect(addr.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAddressId === addr.id 
                      ? 'border-green-600 bg-green-50 ring-1 ring-green-600' 
                      : 'border-stone-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={selectedAddressId === addr.id}
                      onChange={() => handleAddressSelect(addr.id)}
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300"
                    />
                    <div>
                      <p className="font-medium text-stone-900">{addr.firstName} {addr.lastName}</p>
                      <p className="text-stone-600 text-sm">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-stone-500 text-sm mt-1">Phone: {addr.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div 
                onClick={() => handleAddressSelect('new')}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedAddressId === 'new' 
                    ? 'border-green-600 bg-green-50 ring-1 ring-green-600' 
                    : 'border-stone-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={selectedAddressId === 'new'}
                    onChange={() => handleAddressSelect('new')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300"
                  />
                  <span className="font-medium text-stone-900">Add New Address</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
              <input
                {...register('firstName')}
                className="w-full rounded-md border-stone-200 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="John"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
              <input
                {...register('lastName')}
                className="w-full rounded-md border-stone-200 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Mobile Number</label>
              <input
                {...register('phone')}
                className="w-full rounded-md border-stone-200 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="9876543210"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Shipping Address</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Street Address</label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full rounded-md border-stone-200 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="123, Wellness Street, Green Valley"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
                <input
                  {...register('city')}
                  className="w-full rounded-md border-stone-200 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Mumbai"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">State</label>
                <input
                  {...register('state')}
                  className="w-full rounded-md border-stone-200 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Maharashtra"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Pincode</label>
                <input
                  {...register('pincode')}
                  className="w-full rounded-md border-stone-200 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="400001"
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Payment Method</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                {...register('paymentMethod')}
                type="radio"
                value="cod"
                id="cod"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300"
              />
              <label htmlFor="cod" className="ml-3 block text-sm font-medium text-stone-700">
                Cash on Delivery (COD)
              </label>
            </div>
            <div className="flex items-center">
              <input
                {...register('paymentMethod')}
                type="radio"
                value="online"
                id="online"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300"
              />
              <label htmlFor="online" className="ml-3 block text-sm font-medium text-stone-700">
                Online Payment (Razorpay/UPI)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 sticky top-24">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>
          
          <ul className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 text-sm">
                <div className="w-12 h-12 bg-stone-100 rounded flex-shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-stone-900">{item.name}</p>
                  <p className="text-stone-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-stone-900">₹{item.price * item.quantity}</p>
              </li>
            ))}
          </ul>

          <div className="space-y-3 border-t border-stone-100 pt-4 mb-6">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-stone-900 border-t border-stone-100 pt-3">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stone-900 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
}
