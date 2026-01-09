'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCartStore } from '@/store/cart-store'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const clearCart = useCartStore((s) => s.clearCart)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="col-md-12 text-center">
          <h2>Your cart is empty</h2>
          <p>Add items to cart before checkout.</p>
          <Link href="/" className="btn btn-default">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount: getTotal(),
          customer: formData
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Checkout failed')
      }

      const data = await res.json()
      clearCart()
      router.push(`/checkout/success?orderId=${data.orderId}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/cart">Cart</Link></li>
            <li className="active">Checkout</li>
          </ol>
        </div>
      </div>

      <section className="mutton-section">
        <div className="container">
          <div className="col-md-12 text-center">
             <h2>Checkout</h2>
          </div>
        </div>

        <div className="container" style={{ marginTop: 20 }}>
          <div className="col-md-7">
            <div className="panel panel-default">
              <div className="panel-heading">Shipping Details</div>
              <div className="panel-body">
                <form onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email (Optional)</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      name="phone" 
                      required 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Address *</label>
                    <textarea 
                      className="form-control" 
                      name="address" 
                      required 
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>City *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="city" 
                          required 
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Pincode *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="pincode" 
                          required 
                          value={formData.pincode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg btn-block" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order (COD)'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="panel panel-default">
              <div className="panel-heading">Order Summary</div>
              <div className="panel-body">
                <ul className="list-group">
                  {items.map((item) => (
                    <li className="list-group-item" key={`${item.productId}-${item.weightId}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong>{item.name}</strong>
                          <br />
                          <small>{item.weight} x {item.quantity}</small>
                        </div>
                        <span>&#8377; {item.price * item.quantity}</span>
                      </div>
                    </li>
                  ))}
                  <li className="list-group-item active">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Total</strong>
                      <strong>&#8377; {getTotal()}</strong>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
