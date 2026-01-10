export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  console.log('🔍 Requested slug:', slug);

  let category: any = null;

  try {
    category = await prisma.category.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        products: {
          where: { isActive: true },
          include: {
            productWeights: { where: { isActive: true } },
            productImages: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    });

    console.log('✅ Category result:', category ? `Found: ${category.name}` : 'Not found');

  } catch (e) {
    console.error(`🚨 Error fetching category ${slug}:`, e);
    category = null;
  }

  if (!category) {
    console.log('❌ Returning not found for slug:', slug);
    return (
      <>
        <div className="breadcrumps-bg">
          <div className="container">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li className="active">Category</li>
            </ol>
          </div>
        </div>
        <section className="mutton-section">
          <div className="container">
            <div className="col-md-12 text-center">
              <h2>Category unavailable</h2>
              <p>The category "{slug}" does not exist or has no active products.</p>
              <Link href="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block', padding: '10px 20px', backgroundColor: '#d32f2f', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Go to Homepage
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">{category.name}</li>
          </ol>
        </div>
      </div>
      <section className="mutton-section">
        <div className="container">
          <div className="col-md-3">
            <div className="col-md-12 product-list no-gutter">
              <h2>{category.name.toUpperCase()}</h2>
              <ul className="mutton-menu-list">
                {category.products.map((product: any) => (
                  <li key={product.id}>
                    <span>&#9679;</span>
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-9">
            {category.products.length > 0 ? (
              category.products.map((product: any) => (
                <div className="col-md-4 col-sm-6 col-xs-12" key={product.id} style={{ marginBottom: 30 }}>
                  <ProductCard product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    imageUrl: product.productImages[0]?.imageUrl || "/images/no-image.png",
                    weights: product.productWeights?.map((w: any) => ({
                      ...w,
                      price: Number(w.price),
                      discountPrice: w.discountPrice ? Number(w.discountPrice) : null
                    })) || []
                  }} />
                </div>
              ))
            ) : (
              <div className="col-md-12 text-center">
                <p>No products available in this category.</p>
              </div>
            )}
          </div>
        </div>

        <div className="container">
          <div className="recipe-videos col-md-12 no-gutter">
            <a href=""><img src="/images/video-delicious.png" alt="video" /></a>
          </div>
        </div>

        <div className="container">
          <div className="col-md-6">
            <div className="certificate">
              <img src="/images/guarentee.png" alt="image" />
              <ul>
                <li><span></span> Hand-cut & Trimmed</li>
                <li><span></span> Products are Tested for Purity</li>
                <li><span></span> 100% Guaranteed Fresh</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="transport">
              <img src="/images/transport.png" alt="image" />
              <ul>
                <li><span></span> Free Shipping on orders above ₹400</li>
                <li><span></span> Choose Your Own Delivery Time</li>
                <li><span></span> Cash on Delivery Available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}