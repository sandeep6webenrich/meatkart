'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().uuid(),
  description: z.string().optional(),
  freshnessNotes: z.string().optional(),
  stockQuantity: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true),
  images: z.array(z.object({
    imageUrl: z.string().url(),
    isPrimary: z.boolean().default(false),
  })),
  weights: z.array(z.object({
    id: z.string().optional(),
    weight: z.string().min(1),
    price: z.coerce.number().min(0),
    discountPrice: z.coerce.number().min(0).optional(),
    isActive: z.boolean().default(true),
  }))
})

export type ProductFormState = {
  errors?: {
    [key: string]: string[]
  }
  message?: string
}

export async function createProduct(prevState: ProductFormState, formData: FormData) {
  // Parse complex data from JSON strings in hidden fields
  const images = JSON.parse(formData.get('images') as string || '[]')
  const weights = JSON.parse(formData.get('weights') as string || '[]')
  
  const validatedFields = productSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    categoryId: formData.get('categoryId'),
    description: formData.get('description'),
    freshnessNotes: formData.get('freshnessNotes'),
    stockQuantity: formData.get('stockQuantity'),
    isActive: formData.get('isActive') === 'on',
    images,
    weights,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    }
  }

  const { data } = validatedFields

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        description: data.description,
        freshnessNotes: data.freshnessNotes,
        stockQuantity: data.stockQuantity,
        isActive: data.isActive,
        productImages: {
          create: data.images.map((img, idx) => ({
            imageUrl: img.imageUrl,
            isPrimary: idx === 0, // Default first to primary if not specified
            displayOrder: idx
          }))
        },
        productWeights: {
          create: data.weights.map(w => ({
            weight: w.weight,
            price: w.price,
            discountPrice: w.discountPrice,
            isActive: w.isActive
          }))
        }
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Database Error: Failed to Create Product.',
    }
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function updateProduct(
  id: string,
  prevState: ProductFormState,
  formData: FormData
) {
  const images = JSON.parse(formData.get('images') as string || '[]')
  const weights = JSON.parse(formData.get('weights') as string || '[]')
  
  const validatedFields = productSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    categoryId: formData.get('categoryId'),
    description: formData.get('description'),
    freshnessNotes: formData.get('freshnessNotes'),
    stockQuantity: formData.get('stockQuantity'),
    isActive: formData.get('isActive') === 'on',
    images,
    weights,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
    }
  }

  const { data } = validatedFields

  try {
    // Transaction to handle updates
    await prisma.$transaction(async (tx) => {
      // Update basic fields
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          categoryId: data.categoryId,
          description: data.description,
          freshnessNotes: data.freshnessNotes,
          stockQuantity: data.stockQuantity,
          isActive: data.isActive,
        },
      })

      // Handle Images: Delete all and recreate (simplest approach for now)
      // Or we could try to diff, but recreating is safer for order preservation
      await tx.productImage.deleteMany({ where: { productId: id } })
      if (data.images.length > 0) {
        await tx.productImage.createMany({
            data: data.images.map((img, idx) => ({
                productId: id,
                imageUrl: img.imageUrl,
                isPrimary: idx === 0,
                displayOrder: idx
            }))
        })
      }

      // Handle Weights
      // For weights, we might want to preserve IDs if possible, but recreating is easier
      // To preserve IDs we'd need to separate create/update/delete logic
      // For this MVP, let's delete and recreate to ensure consistency with the form state
      await tx.productWeight.deleteMany({ where: { productId: id } })
      if (data.weights.length > 0) {
         await tx.productWeight.createMany({
            data: data.weights.map(w => ({
                productId: id,
                weight: w.weight,
                price: w.price,
                discountPrice: w.discountPrice,
                isActive: w.isActive
            }))
         })
      }
    })
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Database Error: Failed to Update Product.',
    }
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    })
    revalidatePath('/admin/products')
    return { success: true, message: 'Product deleted successfully' }
  } catch (error) {
    console.error('Database Error:', error)
    return { success: false, message: 'Failed to delete product' }
  }
}
