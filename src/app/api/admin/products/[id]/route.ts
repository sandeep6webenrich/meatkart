import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  categoryId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).optional(),
  videos: z.array(z.object({
    videoUrl: z.string().url(),
    thumbnailUrl: z.string().optional().or(z.literal('')),
    title: z.string().optional(),
  })).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Clean up empty strings for optional fields
    if (body.categoryId === '') body.categoryId = null;

    const validatedData = productUpdateSchema.parse(body);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changed
    if (validatedData.slug && validatedData.slug !== existingProduct.slug) {
      const slugCheck = await prisma.product.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugCheck) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Transaction to update product and related media
    const product = await prisma.$transaction(async (tx) => {
      // 1. Update Product
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          description: validatedData.description,
          price: validatedData.price,
          stockQuantity: validatedData.stockQuantity,
          isActive: validatedData.isActive,
          categoryId: validatedData.categoryId,
        },
      });

      // 2. Handle Images (Replace all if provided)
      if (validatedData.images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (validatedData.images.length > 0) {
           await tx.productImage.createMany({
            data: validatedData.images.map((img, index) => ({
              productId: id,
              imageUrl: img.url,
              altText: img.altText,
              isPrimary: img.isPrimary,
              sortOrder: index,
            })),
          });
        }
      }

      // 3. Handle Videos (Replace all if provided)
      if (validatedData.videos) {
        await tx.productVideo.deleteMany({ where: { productId: id } });
        if (validatedData.videos.length > 0) {
           await tx.productVideo.createMany({
            data: validatedData.videos.map((vid, index) => ({
              productId: id,
              videoUrl: vid.videoUrl,
              thumbnailUrl: vid.thumbnailUrl || null,
              title: vid.title,
              sortOrder: index,
            })),
          });
        }
      }

      return updatedProduct;
    });

    return NextResponse.json({ success: true, product }, { status: 200 });

  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
