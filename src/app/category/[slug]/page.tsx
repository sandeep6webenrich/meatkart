import Link from 'next/link';

// Mock data for categories
const CATEGORY_PRODUCTS = {
  mutton: {
    title: "MUTTON",
    subcategories: [
      { name: "Mutton Curry Cut", slug: "mutton-curry-cut" },
      { name: "Mutton Cubes", slug: "mutton-cubes" },
      { name: "Minced Meat", slug: "minced-meat" },
      { name: "Mutton Boneless", slug: "mutton-boneless" },
      { name: "Mutton Biryani Cut", slug: "mutton-biryani-cut" },
      { name: "Mutton Kidney", slug: "mutton-kidney" },
      { name: "Mutton Liver", slug: "mutton-liver" },
      { name: "Mutton Brain", slug: "mutton-brain" },
      { name: "Mutton Paya", slug: "mutton-paya" },
      { name: "Mutton Legs", slug: "mutton-legs" },
      { name: "Mutton Boti", slug: "mutton-boti" },
      { name: "Mutton SoupPieces", slug: "mutton-soup-pieces" },
    ],
    products: [
      { id: '1', name: "Mutton Curry Cut", image: "/images/free-shipping-mutton.png", link: "/product/mutton-curry-cut" },
      { id: '2', name: "Mutton Cubes", image: "/images/mutton-cubes.jpg", link: "/product/mutton-cubes" },
      { id: '3', name: "Special Lamb Mutton Boneless Halal Cut", image: "/images/sell-3.png", link: "/product/mutton-boneless" },
      { id: '4', name: "Pre-Spiced Frozen Chicken Cutlets,Halal Cut", image: "/images/sell-1.png", link: "/product/chicken-cutlets" },
      { id: '5', name: "Fresh Curry Cut Chicken", image: "/images/sell-2.png", link: "/product/chicken-curry-cut" },
      { id: '6', name: "Special Lamb Mutton Boneless Halal Cut", image: "/images/sell-3.png", link: "/product/mutton-boneless-2" },
    ]
  },
  chicken: {
    title: "CHICKEN",
    subcategories: [
      { name: "Chicken Curry Cut", slug: "chicken-curry-cut" },
      { name: "Chicken Boneless", slug: "chicken-boneless" },
      { name: "Chicken Drumsticks", slug: "chicken-drumsticks" },
    ],
    products: [
        { id: '5', name: "Fresh Curry Cut Chicken", image: "/images/sell-2.png", link: "/product/chicken-curry-cut" },
        { id: '4', name: "Pre-Spiced Frozen Chicken Cutlets,Halal Cut", image: "/images/sell-1.png", link: "/product/chicken-cutlets" },
    ]
  },
  seafood: {
      title: "SEAFOOD",
      subcategories: [
          { name: "Fish", slug: "fish" },
          { name: "Prawns", slug: "prawns" },
          { name: "Crabs", slug: "crabs" },
      ],
      products: [
          { id: '7', name: "Pre-Spiced Andhra Tawa Fish Party Pack", image: "/images/sell-4.png", link: "/product/fish-party-pack" },
      ]
  }
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase();
  const categoryData = CATEGORY_PRODUCTS[slug as keyof typeof CATEGORY_PRODUCTS] || CATEGORY_PRODUCTS.mutton;

  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">{categoryData.title.charAt(0).toUpperCase() + categoryData.title.slice(1).toLowerCase()}</li>
          </ol>
        </div>
      </div>
      <section className="mutton-section ">
        <div className="container">
          <div className="col-md-3 ">
            <div className="col-md-12 product-list no-gutter">
              <h2>{categoryData.title}</h2>
              <ul className="mutton-menu-list">
                {categoryData.subcategories.map((sub, index) => (
                  <li key={index}><span>&#9679;</span><Link href={`/product/${sub.slug}`}>{sub.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          
          {categoryData.products.map((product) => (
            <div className="col-md-3 col-sm-12 col-xs-12 items" key={product.id}>
              <div className="col-md-12  sellars-items ">
                <div className="add-cart ">
                  <a href=""><img src="/images/add-cart-img.png" alt="add-cart" /></a>
                </div>
                <button className="btn btn-default add-cart-button" type="button">Add to cart</button>
                <Link href={product.link}><img src={product.image} alt={product.name} /></Link>
                <h3>{product.name}</h3>
                <p className="more-info "><Link href={product.link}>More Info</Link></p>
              </div>
            </div>
          ))}
        </div>
        <div className="container">
          <div className="recipe-videos col-md-12 no-gutter">
            <a href=""><img src="/images/video-delicious.png" /></a>
          </div>
        </div>

        {/* best seller ends */}
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
