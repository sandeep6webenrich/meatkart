import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        productImages: { orderBy: { displayOrder: 'asc' } },
        productWeights: { orderBy: { price: 'asc' } }
      }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    })
  ]);

  if (!product) {
    notFound();
  }

  // Transform Decimal to number for the form
  const transformedProduct = {
    ...product,
    productWeights: product.productWeights.map(w => ({
      ...w,
      price: Number(w.price),
      discountPrice: w.discountPrice ? Number(w.discountPrice) : undefined
    }))
  };

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Edit Product</h1>
      </div>
      <ProductForm categories={categories} product={transformedProduct} />
    </div>
  );
}
