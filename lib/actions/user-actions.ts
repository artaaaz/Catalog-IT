'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { UserStatus, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export interface UserFilter {
  status?: string;
  search?: string;
}

export async function getUsers(filter?: UserFilter) {
  await requireAdmin();

  const where: any = {};

  if (filter?.status && filter.status !== 'all') {
    where.status = filter.status as UserStatus;
  }

  if (filter?.search && filter.search.trim()) {
    const q = filter.search.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }

  return prisma.user.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function approveUserAction(userId: string) {
  await requireAdmin();

  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: UserStatus.APPROVED },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/users');
  revalidatePath('/admin/user-approvals');

  return { success: true, user };
}

export async function rejectUserAction(userId: string) {
  await requireAdmin();

  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: UserStatus.REJECTED },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/users');
  revalidatePath('/admin/user-approvals');

  return { success: true, user };
}

export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin();

  if (admin.id === userId) {
    throw new Error('You cannot delete your own admin account.');
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/users');
  revalidatePath('/admin/user-approvals');

  return { success: true };
}
