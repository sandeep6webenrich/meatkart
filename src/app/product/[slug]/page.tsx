'use client'

import Link from 'next/link';
import { useState } from 'react';

// Mock data for products
const PRODUCTS = {
  'mutton-curry-cut': {
    name: "Mutton Curry Cut",
    category: "Mutton",
    description: "Mutton Curry Cut are pieces of lamb shoulder which is commonly used to make stew and is great when barbecued, stuffed & in curries.",
    longDescription: "Lamb meat is high in protein, selenium, zinc and iron. The speciality of this meat is that it has all 8 amino acids and more than half of its fat content is healthy unsaturated fat. It also contains vitamin B, and copper and manganese. This meat aids muscle generation and the production of red blood cells, avoiding 'anemia'. It also helps boost the immune system and prevent age related degenerative disease.",
    image: "/images/free-shipping-mutton.png",
    price: 380,
    weightOptions: [
      { weight: '500grms', price: 380 },
      { weight: '1kg', price: 750 }
    ]
  },
  'chicken-curry-cut': {
      name: "Fresh Curry Cut Chicken",
      category: "Chicken",
      description: "Fresh tender chicken curry cut pieces.",
      longDescription: "High quality protein source.",
      image: "/images/sell-2.png",
      price: 220,
      weightOptions: [
          { weight: '500grms', price: 120 },
          { weight: '1kg', price: 220 }
      ]
  }
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const product = PRODUCTS[slug as keyof typeof PRODUCTS] || PRODUCTS['mutton-curry-cut'];
  
  const [quantity, setQuantity] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0]);

  const incrementQty = () => setQuantity(q => q + 1);
  const decrementQty = () => setQuantity(q => q > 0 ? q - 1 : 0);

  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li><Link href={`/category/${product.category.toLowerCase()}`}>{product.category}</Link></li>
            <li className="active">{product.name}</li>
          </ol>
        </div>
      </div>
      
      <section className="mutton-section ">
        <div className="container">
          <div className="col-md-3 mutton-list no-gutter">
            <p>{product.category.toUpperCase()}</p>
          </div>
          <div className="col-md-8 no-gutter strip">
          </div>
        </div>
        
        <div className="container">
          <div className="col-md-12 mutton-content">
            <div className="col-md-5">
              <div className="mutton-img col-md-12 ">
                <a href=""><img src={product.image} alt={product.name} /></a>
              </div>
              <div className="shipping-img col-md-4">
                <img src="/images/free-shipping.png" alt="shippng" />
              </div>
              <div className="col-md-8 no-gutter check-availability">
                <img src="/images/check-img.png" alt="check-img" />
                <form className="form-inline pull-right">
                  <div className="form-group">
                    <label htmlFor="pincode">Check Availability at :</label>
                    <input type="text" className="form-control form-control-width" id="pincode" />
                  </div>
                </form>
                <button type="button" className="btn btn-default submit-mail pull-right check-button">Check</button>
              </div>
            </div>
            
            <div className="col-md-4 mutton-curry-cut">
              <div className="details">
                <h2>{product.name}</h2>
                <div className="col-md-10 mutton-curry-content">
                  <p>Pack Size</p>
                  <img src="/images/arrow-invoice.png" alt="" />
                  <div className="dropdown mutton-curry-content-drop-down">
                    <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="btn btn-default dropdown-toggle">
                      {selectedWeight.weight}
                      <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dLabel">
                      {product.weightOptions.map((opt, idx) => (
                        <li key={idx}><a href="#" onClick={(e) => { e.preventDefault(); setSelectedWeight(opt); }}>{opt.weight}</a></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-10 mutton-curry-content">
                  <p>Price</p>
                  <img src="/images/arrow-invoice.png" alt="" />
                  <em> &#8377; {selectedWeight.price}</em>
                </div>
                <div className="col-md-10 mutton-curry-content qty">
                  <p>Qty</p>
                  <img src="/images/arrow-invoice.png" alt="" />
                  <a href="#" onClick={(e) => { e.preventDefault(); decrementQty(); }}><img src="/images/minus.png" alt="minus" /></a>
                  <input type="text" className="form-control form-control-width form-line" value={quantity} readOnly />
                  <a href="#" onClick={(e) => { e.preventDefault(); incrementQty(); }}><img src="/images/plus.png" alt="plus" /></a>
                </div>
                <div className=" col-md-10 invoices-list Choose-Delivery-Time no-gutter">
                  <p>Choose Delivery Time</p>
                  <span>Delivery Timings: 9.00am to 6.00pm, anyday</span>
                </div>
              </div>
            </div>
            
            <div className="col-md-2 share  text-center">
              <div className="share-images">
                <a href=""><img src="/images/my-platter.png" alt="my-platter" /></a>
                <p>Add to My Platter</p>
              </div>
              <div className="share-images">
                <a href=""><img src="/images/share-icon.png" alt="my-platter" /></a>
                <p>Share with a Friend</p>
              </div>
            </div>
            
            <div className="col-md-7 curry-discription">
              <div className="details">
                <h2>{product.name} Description:</h2>
              </div>
              <p>{product.description}</p>
              <p>{product.longDescription}</p>
            </div>
          </div>
        </div>
        
        <section className="recommended-sell">
          <div className="container">
            <div className="sellars-heading Recommended-Products">
              <div className="col-md-12  col-sm-12 col-xs-12 text-center">
                <span>Recommended Products</span>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="col-md-3 col-sm-12 col-xs-12 items">
              <div className="col-md-12  sellars-items ">
                <div className="add-cart ">
                  <a href=""><img src="/images/add-cart-img.png" alt="add-cart" /></a>
                </div>
                <button className="btn btn-default add-cart-button" type="button">Add to cart</button>
                <Link href="/product/chicken-cutlets"><img src="/images/sell-1.png" /></Link>
                <h3>Pre-Spiced Frozen Chicken Cutlets,Halal Cut </h3>
                <p className="more-info "><Link href="/product/chicken-cutlets">More Info</Link></p>
              </div>
            </div>
            {/* Add more recommended items as needed */}
          </div>
        </section>
        
        <div className="container">
          <div className="certificate-shipping border-top">
            <div className="col-md-6 certificate-content ">
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
        </div>
      </section>
    </>
  );
}
