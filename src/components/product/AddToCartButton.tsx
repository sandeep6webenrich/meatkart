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

export default function AddToCartButton({
  product,
  variant = 'primary',
  externalWeightId,
  cutType
}: {
  product: Product,
  variant?: 'primary' | 'minimal',
  externalWeightId?: string,
  cutType?: string
}) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <button className="tw-block tw-w-full tw-rounded-lg tw-px-5 tw-py-2.5 tw-font-bold tw-uppercase tw-text-sm tw-bg-gray-100 tw-text-gray-400" disabled>Add to cart</button>

  // Use externalWeightId if provided, otherwise default to first weight
  const activeWeightId = externalWeightId || product.weights[0]?.id
  const activeWeight = product.weights.find(w => w.id === activeWeightId)

  const cartItem = activeWeight
    ? items.find(i => i.productId === product.id && i.weightId === activeWeightId && i.cutType === cutType)
    : null

  const quantity = cartItem ? cartItem.quantity : 0

  const handleAdd = () => {
    if (!activeWeight) {
      toast.error('Product currently unavailable')
      return
    }

    addItem({
      productId: product.id,
      weightId: activeWeight.id,
      name: product.name,
      price: Number(activeWeight.price),
      weight: activeWeight.weight,
      quantity: 1,
      imageUrl: product.imageUrl,
      cutType: cutType
    })
    toast.success('Added to cart!')
  }

  const handleIncrement = () => {
    if (cartItem && activeWeight) {
      updateQuantity(product.id, activeWeight.id, quantity + 1)
    } else {
      handleAdd()
    }
  }

  const handleDecrement = () => {
    if (cartItem && activeWeight) {
      updateQuantity(product.id, activeWeight.id, Math.max(0, quantity - 1))
    }
  }

  if (quantity > 0) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-gap-3 tw-bg-white tw-border tw-border-primary tw-rounded-lg tw-px-2 tw-py-1 tw-w-full tw-max-w-[140px] tw-mx-auto">
        <button
          onClick={handleDecrement}
          className="tw-bg-transparent tw-border-none tw-text-primary tw-text-lg tw-font-bold tw-px-2 hover:tw-bg-red-50 tw-rounded"
        >
          -
        </button>
        <span className="tw-font-bold tw-min-w-[20px] tw-text-center tw-text-gray-900">{quantity}</span>
        <button
          onClick={handleIncrement}
          className="tw-bg-transparent tw-border-none tw-text-primary tw-text-lg tw-font-bold tw-px-2 hover:tw-bg-red-50 tw-rounded"
        >
          +
        </button>
      </div>
    )
  }

  return (
    <button
      className={`tw-block tw-w-full tw-rounded-lg tw-px-5 tw-py-2.5 tw-font-bold tw-uppercase tw-text-sm tw-transition-colors ${variant === 'minimal'
        ? 'tw-bg-white tw-text-primary tw-border tw-border-primary hover:tw-bg-red-50'
        : 'tw-bg-primary tw-text-white tw-border-none hover:tw-bg-red-600'
        }`}
      type="button"
      onClick={handleAdd}
    >
      Add to cart
    </button>
  )
}
