import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

export const metadata = {
  title: 'Shop All | United Healthcare',
  description: 'Browse our complete collection of natural herbal products.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

  const where = categorySlug ? {
    category: {
      slug: categorySlug
    }
  } : {};

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      images: true,
      category: true,
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    where: { isActive: true },
  });

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            {categorySlug 
              ? categories.find(c => c.slug === categorySlug)?.name || 'Category'
              : 'Shop All Products'
            }
          </h1>
          <p className="text-stone-500 max-w-2xl">
            Explore our range of premium herbal supplements, carefully crafted to support your holistic wellness journey.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-stone-100 sticky top-24">
              <h3 className="font-bold text-stone-900 mb-4 text-lg">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/shop" 
                    className={`block font-medium ${!categorySlug ? 'text-green-700' : 'text-stone-500 hover:text-green-600'}`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/shop?category=${category.slug}`}
                      className={`block transition-colors ${
                        categorySlug === category.slug 
                          ? 'text-green-700 font-medium' 
                          : 'text-stone-500 hover:text-green-600'
                      }`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-stone-100">
                <p className="text-stone-500 text-lg">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
