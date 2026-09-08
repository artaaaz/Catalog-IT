'use server';

import { prisma } from '@/lib/prisma';
import { slaFormSchema, SLAFormValues } from '@/lib/validations/sla';
import { requireAdmin } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function getSLAList() {
  return await prisma.sLA.findMany({
    include: {
      service: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getServicesWithoutSLA() {
  return await prisma.service.findMany({
    where: {
      sla: null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getSLAByServiceId(serviceId: string) {
  return await prisma.sLA.findUnique({
    where: { serviceId },
    include: {
      service: true,
    },
  });
}

export async function upsertSLA(formData: SLAFormValues) {
  await requireAdmin();
  const validated = slaFormSchema.parse(formData);

  const sla = await prisma.sLA.upsert({
    where: { serviceId: validated.serviceId },
    update: {
      availability: validated.availability?.trim() || null,
      responseTime: validated.responseTime?.trim() || null,
      resolutionTime: validated.resolutionTime?.trim() || null,
      supportHours: validated.supportHours?.trim() || null,
      priority: validated.priority,
      notes: validated.notes?.trim() || null,
    },
    create: {
      serviceId: validated.serviceId,
      availability: validated.availability?.trim() || null,
      responseTime: validated.responseTime?.trim() || null,
      resolutionTime: validated.resolutionTime?.trim() || null,
      supportHours: validated.supportHours?.trim() || null,
      priority: validated.priority,
      notes: validated.notes?.trim() || null,
    },
    include: {
      service: true,
    },
  });

  revalidatePath('/');
  revalidatePath('/services');
  if (sla.service?.slug) {
    revalidatePath(`/services/detail/${sla.service.slug}`);
  }
  revalidatePath('/admin/sla');
  return sla;
}

export async function deleteSLA(id: string) {
  await requireAdmin();
  const deleted = await prisma.sLA.delete({
    where: { id },
    include: {
      service: true,
    },
  });

  revalidatePath('/');
  revalidatePath('/services');
  if (deleted.service?.slug) {
    revalidatePath(`/services/detail/${deleted.service.slug}`);
  }
  revalidatePath('/admin/sla');
  return deleted;
}
