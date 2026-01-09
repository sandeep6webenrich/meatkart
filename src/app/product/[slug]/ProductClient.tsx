'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store'

type ProductWeight = {
  id: string;
  weight: string;
  price: number;
}

type Product = {
  id: string;
  name: string;
  category: { name: string; slug: string };
  description: string | null;
  freshnessNotes: string | null;
  imageUrl: string;
  weights: ProductWeight[];
}

export default function ProductClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product.weights[0] || { weight: 'N/A', price: 0 });
  const addItem = useCartStore((s) => s.addItem)

  const incrementQty = () => setQuantity(q => q + 1);
  const decrementQty = () => setQuantity(q => q > 0 ? q - 1 : 0);

  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li><Link href={`/category/${product.category.slug}`}>{product.category.name}</Link></li>
            <li className="active">{product.name}</li>
          </ol>
        </div>
      </div>
      
      <section className="mutton-section ">
        <div className="container">
          <div className="col-md-3 mutton-list no-gutter">
            <p>{product.category.name.toUpperCase()}</p>
          </div>
          <div className="col-md-8 no-gutter strip">
          </div>
        </div>
        
        <div className="container">
          <div className="col-md-12 mutton-content">
            <div className="col-md-5">
              <div className="mutton-img col-md-12 ">
                <img src={product.imageUrl} alt={product.name} />
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
                      {product.weights.map((opt) => (
                        <li key={opt.id}><a href="#" onClick={(e) => { e.preventDefault(); setSelectedWeight(opt); }}>{opt.weight}</a></li>
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
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn btn-default add-cart-button"
                  type="button"
                  onClick={() => {
                    const qty = Math.max(1, quantity)
                    addItem({
                      productId: product.id,
                      weightId: selectedWeight.id,
                      name: product.name,
                      price: selectedWeight.price,
                      weight: selectedWeight.weight,
                      quantity: qty,
                      imageUrl: product.imageUrl,
                    })
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
            
            <div className="col-md-7 curry-discription">
              <div className="details">
                <h2>{product.name} Description:</h2>
              </div>
              <p>{product.description}</p>
              {product.freshnessNotes && <p>{product.freshnessNotes}</p>}
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
            {/* Recommended products could be passed as props too, but keeping static for now or fetched in parent */}
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
