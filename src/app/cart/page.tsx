"use client"

import Link from 'next/link'
import { useCartStore } from '@/store/cart-store'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const getTotal = useCartStore((s) => s.getTotal)

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
            {items.map((item) => (
              <div className=" mutton-curry-cut halal-cut col-md-12" key={`${item.productId}-${item.weightId}`}>
                <ul className="mutton-list">
                  <li><a href=""><img src={item.imageUrl || '/images/no-image.png'} alt="image" /></a></li>
                  <li className="details"><h2>{item.name}</h2></li>
                  <li className="halal-drop-down">
                    <div className="dropdown mutton-curry-content-drop-down">
                      <button type="button" className="btn btn-default dropdown-toggle">
                        {item.weight}
                        <span className="caret"></span>
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className=" mutton-curry-content halal-cut">
                      <a href="#" onClick={(e) => { e.preventDefault(); updateQuantity(item.productId, item.weightId, Math.max(0, item.quantity - 1)); }}><img src="/images/minus.png" alt="minus" /></a>
                      <input type="text" className="form-control form-control-width form-line" value={item.quantity} readOnly />
                      <a href="#" onClick={(e) => { e.preventDefault(); updateQuantity(item.productId, item.weightId, item.quantity + 1); }}><img src="/images/plus.png" alt="plus" /></a>
                    </div>
                  </li>
                  <li className=" mutton-curry-content halal-cut"><em> &#8377; {item.price}</em></li>
                  <li className=" mutton-curry-content halal-cut"><em> &#8377; {item.price * item.quantity}</em></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); removeItem(item.productId, item.weightId); }}><img src="/images/delete-img.png" alt="delete-img" /></a></li>
                </ul>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-md-12 text-center">
                <p>Your cart is empty</p>
              </div>
            )}
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
                  <div style={{ marginTop: 12 }}>
                    <strong>Total: &#8377; {getTotal()}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
