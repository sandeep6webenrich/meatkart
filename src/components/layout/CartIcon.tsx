'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link href="/cart">
        <button className="p-2 hover:bg-stone-100 rounded-full relative transition-colors">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Shopping Cart</span>
        </button>
      </Link>
    );
  }

  return (
    <Link href="/cart">
      <button className="p-2 hover:bg-stone-100 rounded-full relative transition-colors">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-medium text-white">
            {totalItems}
          </span>
        )}
        <span className="sr-only">Shopping Cart</span>
      </button>
    </Link>
  );
}
