import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      wishlist: {
        include: {
          items: {
            include: {
              product: {
                include: {
                  productImages: {
                    where: { isPrimary: true },
                    take: 1
                  },
                  productWeights: {
                    where: { isActive: true },
                    take: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  const wishlistItems = user?.wishlist?.items || []

  return (
    <div className="tw-space-y-6">
      <h2 className="tw-text-2xl tw-font-bold">My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <div className="tw-text-center tw-py-12 tw-bg-white tw-rounded-xl tw-border tw-border-dashed">
            <Heart className="tw-mx-auto tw-h-12 tw-w-12 tw-text-gray-300 tw-mb-3" />
            <h3 className="tw-text-lg tw-font-medium tw-text-gray-900">Your wishlist is empty</h3>
            <p className="tw-text-gray-500 tw-mb-4">Save items you want to buy later.</p>
            <Link href="/">
                <Button>Continue Shopping</Button>
            </Link>
        </div>
      ) : (
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
            {wishlistItems.map((item) => {
                const product = item.product
                const image = product.productImages[0]?.imageUrl || '/images/placeholder.png'
                const price = product.productWeights[0]?.price || 0
                
                return (
                    <Card key={item.id} className="tw-overflow-hidden tw-group">
                        <div className="tw-relative tw-aspect-square tw-bg-gray-100">
                             {/* Use a simple img tag if Image component has domain issues, or configure next.config.js */}
                            <img 
                                src={image} 
                                alt={product.name}
                                className="tw-object-cover tw-w-full tw-h-full"
                            />
                            <button className="tw-absolute tw-top-2 tw-right-2 tw-p-2 tw-bg-white tw-rounded-full tw-shadow-sm tw-text-red-500 hover:tw-bg-red-50">
                                <Heart size={16} fill="currentColor" />
                            </button>
                        </div>
                        <CardContent className="tw-p-4">
                            <Link href={`/product/${product.slug}`}>
                                <h3 className="tw-font-medium tw-text-gray-900 tw-truncate hover:tw-text-primary tw-transition-colors">
                                    {product.name}
                                </h3>
                            </Link>
                            <div className="tw-mt-2 tw-flex tw-items-center tw-justify-between">
                                <span className="tw-font-bold">₹{Number(price).toFixed(2)}</span>
                                <Button size="sm" variant="secondary" className="tw-h-8">
                                    <ShoppingCart size={14} className="tw-mr-1" /> Add
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      )}
    </div>
  )
}
