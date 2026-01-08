'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'

interface ProductCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
  weights: {
    id: string
    weight: string
    price: number
    discountPrice?: number | null
  }[]
  freshnessNotes?: string | null
}

export function ProductCard({ id, name, description, imageUrl, weights, freshnessNotes }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  
  // Default to first weight option
  const defaultWeight = weights[0]

  const handleAddToCart = () => {
    if (!defaultWeight) return

    addItem({
      productId: id,
      weightId: defaultWeight.id,
      name,
      price: Number(defaultWeight.discountPrice || defaultWeight.price),
      weight: defaultWeight.weight,
      quantity: 1,
      imageUrl,
    })
    toast.success('Added to cart')
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/product/${id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
        )}
        {freshnessNotes && (
          <div className="absolute top-2 left-2 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">
            {freshnessNotes}
          </div>
        )}
      </Link>
      <div className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-red-600 truncate">{name}</h3>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">{description}</p>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-slate-500">{defaultWeight?.weight}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900">
                ₹{Number(defaultWeight?.discountPrice || defaultWeight?.price).toFixed(2)}
              </span>
              {defaultWeight?.discountPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{Number(defaultWeight.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <Button size="icon" onClick={handleAddToCart} className="rounded-full">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
