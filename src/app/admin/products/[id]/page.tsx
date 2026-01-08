export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });

  if (!product) return null;
  return product;
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });
}

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProductForm 
        initialData={product} 
        categories={categories} 
        isEditing={true} 
      />
    </div>
  );
}
