'use server';

import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import {
  createSessionToken,
  setSessionCookie,
  deleteSessionCookie,
  getCurrentUser,
  SessionUser,
} from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { Role } from '@prisma/client';

export interface LoginParams {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: SessionUser;
  redirectTo?: string;
}

export async function loginAction(params: LoginParams): Promise<AuthResponse> {
  const { identifier, password, rememberMe } = params;

  if (!identifier || !identifier.trim()) {
    return { success: false, error: 'Email atau username wajib diisi.' };
  }

  if (!password || !password.trim()) {
    return { success: false, error: 'Password wajib diisi.' };
  }

  const cleanIdentifier = identifier.trim();

  // Find user in PostgreSQL by exact email or username prefix
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: cleanIdentifier, mode: 'insensitive' } },
        { email: { startsWith: `${cleanIdentifier}@`, mode: 'insensitive' } },
      ],
    },
  });

  if (!user) {
    return {
      success: false,
      error: 'Akun tidak ditemukan atau kredensial salah.',
    };
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      error: 'Password yang Anda masukkan salah.',
    };
  }

  // Create JWT session token
  const token = await createSessionToken(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    Boolean(rememberMe)
  );

  await setSessionCookie(token, Boolean(rememberMe));

  // Role-based target redirect
  const redirectTo = user.role === Role.ADMIN ? '/admin' : '/';

  try {
    revalidatePath('/', 'layout');
  } catch (e) {}

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    redirectTo,
  };
}

export async function logoutAction(): Promise<{ success: boolean }> {
  await deleteSessionCookie();
  try {
    revalidatePath('/', 'layout');
  } catch (e) {}
  return { success: true };
}

export async function getCurrentUserAction(): Promise<SessionUser | null> {
  return await getCurrentUser();
}
