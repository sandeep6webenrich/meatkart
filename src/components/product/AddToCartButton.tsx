'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string;
  };
  showQuantity?: boolean;
}

export default function AddToCartButton({ product, showQuantity = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity,
    });
    // Optional: Add toast notification here
    alert('Added to cart!');
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${showQuantity ? 'mb-8' : ''}`}>
      {showQuantity && (
        <div className="flex items-center border border-stone-200 rounded-lg">
          <button 
            onClick={decrement}
            className="px-4 py-3 hover:bg-stone-50 transition-colors"
          >
            -
          </button>
          <span className="px-4 font-medium text-stone-900">{quantity}</span>
          <button 
            onClick={increment}
            className="px-4 py-3 hover:bg-stone-50 transition-colors"
          >
            +
          </button>
        </div>
      )}
      
      <button 
        onClick={handleAddToCart}
        className="flex-1 bg-stone-900 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </div>
  );
}
