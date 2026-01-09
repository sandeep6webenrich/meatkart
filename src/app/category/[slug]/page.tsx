import Link from 'next/link';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let category: any = null
  try {
    category = await prisma.category.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        products: {
          where: { isActive: true },
          include: {
            productImages: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    })
  } catch {
    category = null
  }

  if (!category) {
    notFound();
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
      <section className="mutton-section ">
        <div className="container">
          <div className="col-md-3 ">
            <div className="col-md-12 product-list no-gutter">
              <h2>{category.name.toUpperCase()}</h2>
              <ul className="mutton-menu-list">
                {category.products.map((product: any) => (
                  <li key={product.id}>
                    <span>&#9679;</span>
                    {/* Using product name as slug if no specific slug field, but we assume product search/link by ID or name-slug. 
                        For now, let's construct a slug-like link or use ID if slug missing. 
                        Actually the mock used /product/slug. My schema doesn't have a slug for product. 
                        Wait, schema has 'name', but no 'slug' for product. 
                        I should probably use ID or add slug to schema. 
                        For now, I'll generate slug from name for the link, but query by name or ID? 
                        The product page mock uses slug. 
                        I'll use a helper to slugify the name for the link, and in product page I'll search by name (approx) or ID. 
                        Ideally I should have added slug to Product. 
                        Let's check schema again. Product model has: id, name, description... no slug.
                        I'll assume I can find product by name matching the slugified version. 
                    */}
                    <Link href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}>{product.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {category.products.map((product: any) => (
            <div className="col-md-3 col-sm-12 col-xs-12 items" key={product.id}>
              <div className="col-md-12  sellars-items ">
                <div className="add-cart ">
                  <a href=""><img src="/images/add-cart-img.png" alt="add-cart" /></a>
                </div>
                <button className="btn btn-default add-cart-button" type="button">Add to cart</button>
                <Link href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}>
                  <img 
                    src={product.productImages[0]?.imageUrl || "/images/no-image.png"} 
                    alt={product.name} 
                  />
                </Link>
                <h3>{product.name}</h3>
                <p className="more-info ">
                  <Link href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}>More Info</Link>
                </p>
              </div>
            </div>
          ))}
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
                <li><span></span> Free Shipping on orders above `400</li>
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
