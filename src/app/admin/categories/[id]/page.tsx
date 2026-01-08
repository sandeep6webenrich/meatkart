import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';
import { notFound } from 'next/navigation';

async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) return null;
  return category;
}

export default async function EditCategoryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <CategoryForm 
        initialData={category} 
        isEditing={true} 
      />
    </div>
  );
}
