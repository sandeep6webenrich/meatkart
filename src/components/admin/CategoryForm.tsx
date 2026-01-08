'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues: Partial<CategoryFormData> = initialData ? {
    ...initialData,
    // Ensure types are correct for form
    sortOrder: Number(initialData.sortOrder || 0),
    isActive: Boolean(initialData.isActive),
  } : {
    isActive: true,
    sortOrder: 0,
    name: '',
    slug: '',
    description: '',
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) {
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEditing 
        ? `/api/admin/categories/${initialData.id}` 
        : '/api/admin/categories';
      
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
        throw new Error(result.error || 'Failed to save category');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">
            {isEditing ? 'Edit Category' : 'Add New Category'}
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
          Save Category
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm border border-stone-100 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">Category Name</label>
          <input
            type="text"
            {...register('name')}
            onChange={(e) => {
              register('name').onChange(e);
              handleNameChange(e);
            }}
            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g. Wellness"
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">Description</label>
          <textarea
            rows={3}
            {...register('description')}
            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Optional description..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Sort Order</label>
            <input
              type="number"
              {...register('sortOrder')}
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
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
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}
