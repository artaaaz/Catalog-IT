import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: Role;
  [key: string]: any;
}

const COOKIE_NAME = 'nr_session';
const DEFAULT_SECRET = 'nr-it-catalog-nusantara-regas-enterprise-auth-secret-key-2026';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || DEFAULT_SECRET);

export async function createSessionToken(
  payload: SessionPayload,
  rememberMe: boolean = false
): Promise<string> {
  const duration = rememberMe ? '30d' : '1d';
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(duration)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function setSessionCookie(token: string, rememberMe: boolean = false) {
  try {
    const cookieStore = cookies();
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day

    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
  } catch (error) {
    // If called outside Next.js request context (e.g. testing script)
  }
}

export async function deleteSessionCookie() {
  try {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  } catch (error) {
    // If called outside Next.js request context
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload || !payload.userId || !payload.role) return null;

    return {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role as Role,
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: Authentication required.');
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== Role.ADMIN) {
    throw new Error('Forbidden: Admin role privileges required.');
  }
  return user;
}
