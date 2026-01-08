import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productCreateSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0),
  categoryId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).default([]),
  videos: z.array(z.object({
    videoUrl: z.string().url(),
    thumbnailUrl: z.string().optional().or(z.literal('')),
    title: z.string().optional(),
  })).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Clean up empty strings for optional fields
    if (body.categoryId === '') body.categoryId = null;
    
    const validatedData = productCreateSchema.parse(body);

    // Check if slug exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Transaction to create product, images, and videos
    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          description: validatedData.description,
          price: validatedData.price,
          stockQuantity: validatedData.stockQuantity,
          isActive: validatedData.isActive,
          categoryId: validatedData.categoryId || null,
        },
      });

      // Create Images
      if (validatedData.images.length > 0) {
        await tx.productImage.createMany({
          data: validatedData.images.map((img, index) => ({
            productId: newProduct.id,
            imageUrl: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary,
            sortOrder: index,
          })),
        });
      }

      // Create Videos
      if (validatedData.videos.length > 0) {
        await tx.productVideo.createMany({
          data: validatedData.videos.map((vid, index) => ({
            productId: newProduct.id,
            videoUrl: vid.videoUrl,
            thumbnailUrl: vid.thumbnailUrl || null,
            title: vid.title,
            sortOrder: index,
          })),
        });
      }

      return newProduct;
    });

    return NextResponse.json({ success: true, product }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
