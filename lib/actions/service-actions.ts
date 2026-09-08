'use server';

import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
import { serviceFormSchema, ServiceFormValues } from '@/lib/validations/service';
import { requireAdmin } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export interface ServiceFilterParams {
  categorySlug?: string;
  categoryId?: string;
  status?: string;
  owner?: string;
  search?: string;
}

export async function getStats() {
  const [total, active, underReview, inactive] = await Promise.all([
    prisma.service.count(),
    prisma.service.count({ where: { status: 'ACTIVE' } }),
    prisma.service.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.service.count({ where: { status: 'INACTIVE' } }),
  ]);

  return {
    total,
    active,
    underReview,
    inactive,
  };
}

export async function getServices(params?: ServiceFilterParams) {
  const where: any = {};

  if (params?.categorySlug) {
    where.category = {
      slug: params.categorySlug,
    };
  }

  if (params?.categoryId && params.categoryId !== 'all') {
    where.categoryId = params.categoryId;
  }

  if (params?.status && params.status !== 'all') {
    where.status = params.status;
  }

  if (params?.owner && params.owner !== 'all') {
    where.owner = params.owner;
  }

  if (params?.search && params.search.trim() !== '') {
    const query = params.search.trim();
    const upperQuery = query.toUpperCase();
    const matchingStatuses: any[] = [];
    if ('ACTIVE'.includes(upperQuery)) matchingStatuses.push('ACTIVE');
    if ('UNDER_REVIEW'.includes(upperQuery) || 'REVIEW'.includes(upperQuery)) matchingStatuses.push('UNDER_REVIEW');
    if ('INACTIVE'.includes(upperQuery)) matchingStatuses.push('INACTIVE');

    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { owner: { contains: query, mode: 'insensitive' } },
      { developer: { contains: query, mode: 'insensitive' } },
      { server: { contains: query, mode: 'insensitive' } },
      { integration: { contains: query, mode: 'insensitive' } },
      { category: { name: { contains: query, mode: 'insensitive' } } },
    ];

    if (matchingStatuses.length > 0) {
      where.OR.push({ status: { in: matchingStatuses } });
    }
  }

  return await prisma.service.findMany({
    where,
    include: {
      category: true,
      sla: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getServiceBySlug(slug: string) {
  return await prisma.service.findUnique({
    where: { slug },
    include: {
      category: true,
      sla: true,
    },
  });
}

export async function getUniqueOwners() {
  const services = await prisma.service.findMany({
    where: {
      owner: { not: null },
    },
    select: {
      owner: true,
    },
    distinct: ['owner'],
    orderBy: {
      owner: 'asc',
    },
  });

  return services.map((s) => s.owner).filter(Boolean) as string[];
}

export async function createService(formData: ServiceFormValues) {
  await requireAdmin();
  const validated = serviceFormSchema.parse(formData);
  
  let baseSlug = generateSlug(validated.name);
  if (!baseSlug) baseSlug = 'service';
  
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.service.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const newService = await prisma.service.create({
    data: {
      name: validated.name.trim(),
      slug,
      categoryId: validated.categoryId,
      description: validated.description?.trim() || null,
      url: validated.url?.trim() || null,
      owner: validated.owner?.trim() || null,
      developer: validated.developer?.trim() || null,
      server: validated.server?.trim() || null,
      integration: validated.integration?.trim() || null,
      status: validated.status,
    },
  });

  revalidatePath('/');
  revalidatePath('/services');
  revalidatePath('/admin/services');
  return newService;
}

export async function updateService(id: string, formData: ServiceFormValues) {
  await requireAdmin();
  const validated = serviceFormSchema.parse(formData);
  
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Service not found');
  }

  let slug = existing.slug;
  if (existing.name !== validated.name.trim()) {
    let baseSlug = generateSlug(validated.name);
    if (!baseSlug) baseSlug = 'service';
    slug = baseSlug;
    let counter = 1;
    while (
      await prisma.service.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const updated = await prisma.service.update({
    where: { id },
    data: {
      name: validated.name.trim(),
      slug,
      categoryId: validated.categoryId,
      description: validated.description?.trim() || null,
      url: validated.url?.trim() || null,
      owner: validated.owner?.trim() || null,
      developer: validated.developer?.trim() || null,
      server: validated.server?.trim() || null,
      integration: validated.integration?.trim() || null,
      status: validated.status,
    },
  });

  revalidatePath('/');
  revalidatePath('/services');
  revalidatePath(`/services/detail/${updated.slug}`);
  revalidatePath('/admin/services');
  return updated;
}

export async function deleteService(id: string) {
  await requireAdmin();
  const deleted = await prisma.service.delete({
    where: { id },
  });

  revalidatePath('/');
  revalidatePath('/services');
  revalidatePath('/admin/services');
  return deleted;
}
