'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Plus, Trash2, Video } from 'lucide-react';
import Link from 'next/link';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock must be 0 or more'),
  categoryId: z.string().optional(),
  isActive: z.boolean().default(true),
  images: z.array(z.object({
    url: z.string().url('Invalid URL'),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).default([]),
  videos: z.array(z.object({
    videoUrl: z.string().url('Invalid URL'),
    thumbnailUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    title: z.string().optional(),
  })).default([]),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: any;
  categories: Category[];
  isEditing?: boolean;
}

export default function ProductForm({ initialData, categories, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues: Partial<ProductFormData> = initialData ? {
    ...initialData,
    price: Number(initialData.price),
    stockQuantity: Number(initialData.stockQuantity),
    images: initialData.images?.map((img: any) => ({
      url: img.imageUrl,
      altText: img.altText,
      isPrimary: img.isPrimary,
    })) || [],
    videos: initialData.videos?.map((vid: any) => ({
      videoUrl: vid.videoUrl,
      thumbnailUrl: vid.thumbnailUrl,
      title: vid.title,
    })) || [],
  } : {
    isActive: true,
    stockQuantity: 0,
    price: 0,
    images: [],
    videos: [],
    categoryId: '',
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
  });

  const { fields: videoFields, append: addVideo, remove: removeVideo } = useFieldArray({
    control,
    name: 'videos',
  });

  // Auto-generate slug from name if creating new product
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) {
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEditing 
        ? `/api/admin/products/${initialData.id}` 
        : '/api/admin/products';
      
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Save Product
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-stone-100 space-y-6">
            <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Product Name</label>
                <input
                  type="text"
                  {...register('name')}
                  onChange={(e) => {
                    register('name').onChange(e);
                    handleNameChange(e);
                  }}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="e.g. Ashwagandha Powder"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Slug</label>
                <input
                  type="text"
                  {...register('slug')}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 bg-stone-50 font-mono text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Description</label>
              <textarea
                rows={5}
                {...register('description')}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Product description..."
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border border-stone-100 space-y-6">
            <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
              Pricing & Inventory
            </h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price')}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Stock Quantity</label>
                <input
                  type="number"
                  {...register('stockQuantity')}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                {errors.stockQuantity && <p className="text-sm text-red-500">{errors.stockQuantity.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Status</label>
                <select
                  {...register('isActive', { 
                    setValueAs: (value) => value === 'true' || value === true 
                  })}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Draft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-stone-100 space-y-6">
            <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
              Organization
            </h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Category</label>
              <select
                {...register('categoryId')}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border border-stone-100 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900">Images</h2>
              <button
                type="button"
                onClick={() => addImage({ url: '', isPrimary: imageFields.length === 0 })}
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            
            <div className="space-y-4">
              {imageFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-stone-500">Image {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      {...register(`images.${index}.url` as const)}
                      placeholder="Image URL"
                      className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                    {errors.images?.[index]?.url && (
                      <p className="text-xs text-red-500">{errors.images[index]?.url?.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register(`images.${index}.isPrimary` as const)}
                      id={`primary-${index}`}
                      className="rounded border-stone-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor={`primary-${index}`} className="text-sm text-stone-600">Primary Image</label>
                  </div>
                </div>
              ))}
              
              {imageFields.length === 0 && (
                <div className="text-center py-4 text-stone-400 text-sm">
                  No images added yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border border-stone-100 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900">Videos</h2>
              <button
                type="button"
                onClick={() => addVideo({ videoUrl: '' })}
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            
            <div className="space-y-4">
              {videoFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-stone-500">Video {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      {...register(`videos.${index}.videoUrl` as const)}
                      placeholder="Video URL"
                      className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                    {errors.videos?.[index]?.videoUrl && (
                      <p className="text-xs text-red-500">{errors.videos[index]?.videoUrl?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      {...register(`videos.${index}.thumbnailUrl` as const)}
                      placeholder="Thumbnail URL (Optional)"
                      className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}

              {videoFields.length === 0 && (
                <div className="text-center py-4 text-stone-400 text-sm">
                  No videos added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
