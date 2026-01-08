import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-5xl mx-auto">
      <ProductForm categories={categories} />
    </div>
  );
}
