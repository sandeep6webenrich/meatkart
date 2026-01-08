import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Inefficient but works for now without slug in DB
  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      productImages: { where: { isPrimary: true }, take: 1 },
      productWeights: { where: { isActive: true } }
    }
  });

  const product = allProducts.find(p => p.name.toLowerCase().replace(/ /g, '-') === slug.toLowerCase());

  if (!product) {
    notFound();
  }

  // Transform to the shape expected by Client Component
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
    weights: product.productWeights.map(pw => ({
        id: pw.id,
        weight: pw.weight,
        price: Number(pw.price)
    }))
  };

  return <ProductClient product={productData} />;
}
