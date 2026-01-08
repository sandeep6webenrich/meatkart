import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getCategoryWithProducts(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return category;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryWithProducts(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | United Healthcare`,
    description: category.description || `Browse our selection of ${category.name} products.`,
  };
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const category = await getCategoryWithProducts(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* Product Grid */}
        {category.products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-stone-900 mb-2">No products found</h3>
            <p className="text-stone-500">
              Check back later for new additions to this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
