import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Product, ProductImage, Category } from '@prisma/client';

// Define a type that includes the relations we need
type ProductWithRelations = Product & {
  images: ProductImage[];
  category: Category | null;
};

interface ProductCardProps {
  product: ProductWithRelations;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col h-full">
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        <img 
          src={product.images[0]?.imageUrl || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.category && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm">
            {product.category.name}
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-xs text-stone-400 ml-1">(4.8)</span>
          </div>
        </div>

        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-xl font-bold text-stone-800 mb-2 hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
          <div className="flex flex-col">
            <span className="text-stone-400 text-xs line-through">₹{product.price.toString()}</span>
            <span className="text-green-700 font-bold text-xl">
              ₹{product.discountedPrice?.toString() ?? product.price.toString()}
            </span>
          </div>
          <button className="flex items-center justify-center bg-stone-900 hover:bg-green-600 text-white p-3 rounded-full transition-colors group-hover:shadow-lg">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
