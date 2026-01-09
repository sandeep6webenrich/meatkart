import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: any = null
  try {
    const allProducts = await prisma.product.findMany({
      include: {
        category: true,
        productImages: { where: { isPrimary: true }, take: 1 },
        productWeights: { where: { isActive: true } }
      }
    })
    product = allProducts.find(p => p.name.toLowerCase().replace(/ /g, '-') === slug.toLowerCase())
  } catch {
    product = null
  }

  if (!product) {
    notFound();
  }

  const productData = {
    id: product.id,
    name: product.name,
    category: {
      name: product.category.name,
      slug: product.category.slug
    },
    description: product.description,
    freshnessNotes: product.freshnessNotes,
    imageUrl: product.productImages[0]?.imageUrl || "/images/no-image.png",
    weights: product.productWeights.map((pw: any) => ({
      id: pw.id,
      weight: pw.weight,
      price: Number(pw.price)
    }))
  }

  return <ProductClient product={productData} />
}
