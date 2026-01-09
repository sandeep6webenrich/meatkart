import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/ProductForm";

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Add New Product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
