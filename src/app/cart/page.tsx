'use client'

import Link from 'next/link';
import { useState } from 'react';

// Mock data for cart items
const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: "Mutton Curry Pieces Halal Cut",
    image: "/images/mutton.png",
    weight: "500grms",
    price: 380,
    quantity: 2,
    total: 760
  },
  {
    id: 2,
    name: "Chicken Drumsticks Halal Cut",
    image: "/images/chicken-or.png",
    weight: "450grms",
    price: 380,
    quantity: 1,
    total: 380
  },
  {
    id: 3,
    name: "Mutton Mince Halal Cut",
    image: "/images/halal.png",
    weight: "250grms",
    price: 380,
    quantity: 3,
    total: 760 // Note: This calculation in HTML seems odd (380*3 != 760), but keeping structure
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  const incrementQty = (id: number) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQty = (id: number) => {
    setCartItems(items => items.map(item => 
      item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">Cart</li>
          </ol>
        </div>
      </div>
      <section className="mutton-section ">
        <div className="container">
          <div className="col-md-3 mutton-list no-gutter">
            <p>SHOPING CART</p>
          </div>
          <div className="col-md-8 no-gutter strip">
          </div>
        </div>
        <div className="container">
          <div className="col-md-12 mutton-content">
            {cartItems.map((item) => (
              <div className=" mutton-curry-cut halal-cut col-md-12" key={item.id}>
                <ul className="mutton-list">
                  <li><a href=""><img src={item.image} alt="image" /></a></li>
                  <li className="details"><h2>{item.name}</h2></li>
                  <li className="halal-drop-down">
                    <div className="dropdown mutton-curry-content-drop-down">
                      <button id={`dLabel-${item.id}`} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="btn btn-default dropdown-toggle">
                        {item.weight}
                        <span className="caret"></span>
                      </button>
                      <ul className="dropdown-menu" aria-labelledby={`dLabel-${item.id}`}>
                        <li><a href="#">500grms</a></li>
                        <li><a href="#">200grms</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div className=" mutton-curry-content halal-cut">
                      <a href="#" onClick={(e) => { e.preventDefault(); decrementQty(item.id); }}><img src="/images/minus.png" alt="minus" /></a>
                      <input type="text" className="form-control form-control-width form-line" value={item.quantity} readOnly />
                      <a href="#" onClick={(e) => { e.preventDefault(); incrementQty(item.id); }}><img src="/images/plus.png" alt="plus" /></a>
                    </div>
                  </li>
                  <li className=" mutton-curry-content halal-cut"><em> &#8377; {item.price}</em></li>
                  <li className=" mutton-curry-content halal-cut"><em> &#8377; {item.price * item.quantity}</em></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); removeItem(item.id); }}><img src="/images/delete-img.png" alt="delete-img" /></a></li>
                </ul>
              </div>
            ))}
          </div>
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
        </div>
      </section>
    </>
  );
}
