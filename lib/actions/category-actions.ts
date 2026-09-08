'use server';

import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
import { categoryFormSchema, CategoryFormValues } from '@/lib/validations/category';
import { requireAdmin } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { services: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { services: true },
      },
    },
  });
}

export async function createCategory(formData: CategoryFormValues) {
  await requireAdmin();
  const validated = categoryFormSchema.parse(formData);

  let baseSlug = validated.slug ? generateSlug(validated.slug) : generateSlug(validated.name);
  if (!baseSlug) baseSlug = 'category';

  let slug = baseSlug;
  let counter = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const category = await prisma.category.create({
    data: {
      name: validated.name.trim(),
      slug,
      description: validated.description?.trim() || null,
      icon: validated.icon?.trim() || 'Folder',
    },
  });

  revalidatePath('/');
  revalidatePath('/services');
  revalidatePath('/admin/categories');
  return category;
}

export async function updateCategory(id: string, formData: CategoryFormValues) {
  await requireAdmin();
  const validated = categoryFormSchema.parse(formData);

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Category not found');
  }

  let slug = existing.slug;
  if (validated.slug && validated.slug !== existing.slug) {
    slug = generateSlug(validated.slug);
  } else if (existing.name !== validated.name.trim()) {
    slug = generateSlug(validated.name);
  }

  // Ensure unique slug
  let counter = 1;
  const originalSlug = slug;
  while (
    await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    })
  ) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: validated.name.trim(),
      slug,
      description: validated.description?.trim() || null,
      icon: validated.icon?.trim() || existing.icon,
    },
  });

  revalidatePath('/');
  revalidatePath('/services');
  revalidatePath(`/services/${updated.slug}`);
  revalidatePath('/admin/categories');
  return updated;
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  // Check if services exist under this category
  const serviceCount = await prisma.service.count({
    where: { categoryId: id },
  });

  if (serviceCount > 0) {
    throw new Error(
      `Category masih digunakan oleh beberapa service (${serviceCount} service terhubung). Silakan pindahkan atau hapus relasi service terlebih dahulu.`
    );
  }

  const deleted = await prisma.category.delete({
    where: { id },
  });

  revalidatePath('/');
  revalidatePath('/services');
  revalidatePath('/admin/categories');
  return deleted;
}
