import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Star, Check, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from '@/components/product/AddToCartButton';
import ProductGallery from '@/components/product/ProductGallery';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

import ProductDisclaimer from '@/components/product/ProductDisclaimer';

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | United Healthcare`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      videos: {
        orderBy: { sortOrder: 'asc' },
      },
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Combine images and videos into a single media array for the gallery
  const mediaItems = [
    ...product.images.map(img => ({
      id: img.id,
      type: 'image' as const,
      url: img.imageUrl,
      alt: img.altText || product.name,
    })),
    ...product.videos.map(vid => ({
      id: vid.id,
      type: 'video' as const,
      url: vid.videoUrl,
      thumbnailUrl: vid.thumbnailUrl,
      alt: vid.title || 'Product Video',
    }))
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-stone-500 mb-8">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-green-600">Products</Link>
          <span className="mx-2">/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-green-600">
                {product.category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-stone-900 font-medium">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Gallery */}
            <div className="p-8">
              <ProductGallery media={mediaItems} />
            </div>

            {/* Product Details */}
            <div className="p-8 md:p-12 md:pl-0">
              {product.category && (
                <span className="inline-block bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-stone-400 text-sm">(124 Reviews)</span>
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-green-700">
                  ₹{product.discountedPrice?.toString() ?? product.price.toString()}
                </span>
                {product.discountedPrice && (
                  <span className="text-xl text-stone-400 line-through mb-1">
                    ₹{product.price.toString()}
                  </span>
                )}
              </div>

              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.discountedPrice || product.price),
                    image: product.images[0]?.imageUrl
                  }}
                  showQuantity={true}
                />
              </div>

              {/* Benefits & Ingredients */}
              <div className="space-y-6 border-t border-stone-100 pt-8">
                {product.benefits && (
                  <div>
                    <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      Key Benefits
                    </h3>
                    <ul className="space-y-2">
                      {product.benefits.split(',').map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-stone-600 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {benefit.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.ingredients && (
                  <div>
                    <h3 className="font-bold text-stone-900 mb-2">Ingredients</h3>
                    <p className="text-stone-600 text-sm">{product.ingredients}</p>
                  </div>
                )}
                
                <div className="bg-stone-50 p-4 rounded-lg flex items-center gap-3">
                  <Truck className="w-5 h-5 text-stone-500" />
                  <p className="text-stone-500 text-sm">
                    Free shipping on orders over ₹499. Estimated delivery: 3-5 days.
                  </p>
                </div>
                
                <ProductDisclaimer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
