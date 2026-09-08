import React from 'react';
import { getCategories } from '@/lib/actions/category-actions';
import { CategoryManager } from '@/components/admin/CategoryManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Categories Management | Admin Console',
  description: 'Manage IT categories, domain groupings, and sidebar navigation.',
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoryManager initialCategories={categories as any} />;
}
