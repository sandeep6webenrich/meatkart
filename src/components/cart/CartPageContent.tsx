'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartPageContent() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
        <p className="text-stone-500 mb-8 max-w-md">
          Looks like you haven&apos;t added anything to your cart yet. Explore our products to find something you&apos;ll love.
        </p>
        <Link 
          href="/shop" 
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items List */}
      <div className="flex-grow">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-stone-900">Shopping Cart ({items.length} items)</h2>
            <button 
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Clear Cart
            </button>
          </div>
          
          <ul className="divide-y divide-stone-100">
            {items.map((item) => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 bg-stone-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                  <Image 
                    src={item.image || 'https://via.placeholder.com/100'} 
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/product/${item.slug}`} className="hover:text-green-600 transition-colors">
                      <h3 className="font-bold text-stone-900 text-lg">{item.name}</h3>
                    </Link>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-green-700 font-bold mb-4">₹{item.price}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-stone-200 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-stone-50 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 font-medium text-stone-900 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-stone-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-stone-500 text-sm">
                      Total: <span className="font-bold text-stone-900">₹{item.price * item.quantity}</span>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Tax</span>
              <span>₹0.00</span>
            </div>
            <div className="border-t border-stone-100 pt-4 flex justify-between font-bold text-lg text-stone-900">
              <span>Total</span>
              <span>₹{getCartTotal()}</span>
            </div>
          </div>

          <Link 
            href="/checkout"
            className="w-full bg-stone-900 hover:bg-green-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg mb-4"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <div className="text-center">
             <Link href="/shop" className="text-sm text-stone-500 hover:text-green-600 underline">
               Continue Shopping
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
