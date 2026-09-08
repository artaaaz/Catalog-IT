'use server';

import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import {
  createSessionToken,
  setSessionCookie,
  deleteSessionCookie,
  getCurrentUser,
  SessionUser,
} from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { Role, UserStatus } from '@prisma/client';

export interface LoginParams {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
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

  // Check Account Status (PENDING, REJECTED, APPROVED)
  if (user.status === UserStatus.PENDING) {
    return {
      success: false,
      error: 'Your account is waiting for administrator approval.',
    };
  }

  if (user.status === UserStatus.REJECTED) {
    return {
      success: false,
      error: 'Your account has been rejected. Please contact administrator.',
    };
  }

  // Create JWT session token for APPROVED user
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

export async function registerAction(params: RegisterParams): Promise<AuthResponse> {
  const { name, email, password, confirmPassword } = params;

  if (!name || !name.trim()) {
    return { success: false, error: 'Full Name is required.' };
  }

  if (!email || !email.trim()) {
    return { success: false, error: 'Email address is required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return { success: false, error: 'Confirm Password does not match.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check if email already registered
  const existing = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (existing) {
    return {
      success: false,
      error: 'This email address is already registered. Please sign in instead.',
    };
  }

  // Hash password with bcrypt
  const hashedPassword = await hashPassword(password);

  // Create User with role USER and status PENDING (strictly no role selection)
  await prisma.user.create({
    data: {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: Role.USER,
      status: UserStatus.PENDING,
    },
  });

  return {
    success: true,
    redirectTo: '/register/pending',
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
