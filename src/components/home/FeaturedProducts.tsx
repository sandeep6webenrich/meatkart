import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';

export default async function FeaturedProducts() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        category: true,
      },
    });
  } catch {}

  return (
    <section className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Our Bestsellers</span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-4">Curated for Wellness</h2>
          <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/shop" 
            className="inline-flex items-center text-stone-900 font-semibold hover:text-green-600 transition-colors border-b-2 border-stone-200 hover:border-green-600 pb-1"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
