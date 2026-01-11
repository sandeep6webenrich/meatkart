'use client'

import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

type Product = {
  id: string
  name: string
  slug: string
  imageUrl: string
  weights: { id: string; weight: string; price: number }[]
}

export default function AddToCartButton({ product, variant = 'primary' }: { product: Product, variant?: 'primary' | 'minimal' }) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <button className="add-cart-button" disabled>Add to cart</button>

  // Check if item is already in cart (using first weight as default)
  const firstWeight = product.weights[0]
  const cartItem = firstWeight
    ? items.find(i => i.productId === product.id && i.weightId === firstWeight.id)
    : null

  const quantity = cartItem ? cartItem.quantity : 0

  const handleAdd = () => {
    if (!firstWeight) {
      toast.error('Product currently unavailable')
      return
    }

    addItem({
      productId: product.id,
      weightId: firstWeight.id,
      name: product.name,
      price: Number(firstWeight.price),
      weight: firstWeight.weight,
      quantity: 1,
      imageUrl: product.imageUrl,
    })
    toast.success('Added to cart!')
  }

  const handleIncrement = () => {
    if (cartItem && firstWeight) {
      updateQuantity(product.id, firstWeight.id, quantity + 1)
    } else {
      handleAdd()
    }
  }

  const handleDecrement = () => {
    if (cartItem && firstWeight) {
      updateQuantity(product.id, firstWeight.id, Math.max(0, quantity - 1))
    }
  }

  if (quantity > 0) {
    return (
      <div className="quantity-toggle" style={{
        display: 'flex !important' as any,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        background: '#fff',
        border: '1px solid #d11243',
        borderRadius: '4px',
        padding: '5px 10px',
        width: '100%',
        maxWidth: '140px',
        margin: '0 auto'
      }}>
        <button
          onClick={handleDecrement}
          style={{ background: 'none', border: 'none', color: '#d11243', fontSize: '18px', fontWeight: 'bold' }}
        >
          -
        </button>
        <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
        <button
          onClick={handleIncrement}
          style={{ background: 'none', border: 'none', color: '#d11243', fontSize: '18px', fontWeight: 'bold' }}
        >
          +
        </button>
      </div>
    )
  }

  const buttonStyle = variant === 'minimal'
    ? {
      display: 'block',
      backgroundColor: '#fff',
      color: '#d11243',
      border: '1px solid #d11243',
      borderRadius: '4px',
      padding: '8px 16px',
      fontWeight: 'bold',
      width: '100%',
      textTransform: 'uppercase' as const,
      fontSize: '12px',
      cursor: 'pointer'
    }
    : {
      display: 'block',
      backgroundColor: '#d11243',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 20px',
      fontWeight: 'bold',
      width: '100%',
      textTransform: 'uppercase' as const,
      cursor: 'pointer'
    }

  return (
    <button
      className="add-cart-button"
      type="button"
      onClick={handleAdd}
      style={buttonStyle}
    >
      Add to cart
    </button>
  )
}
