import type { Metadata } from 'next';
import './globals.css';
import { getCategories } from '@/lib/actions/category-actions';
import { getCurrentUser } from '@/lib/auth/session';
import { SessionProvider } from '@/lib/auth/SessionContext';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'NR IT CATALOG | Nusantara Regas IT Service Directory',
  description:
    'Centralized Enterprise IT Service Directory and Catalog for PT Nusantara Regas.',
  keywords: [
    'Nusantara Regas',
    'NR IT Catalog',
    'IT Service Directory',
    'Pertamina',
    'Enterprise Applications',
  ],
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, user] = await Promise.all([
    getCategories(),
    getCurrentUser(),
  ]);

  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">
        <SessionProvider initialUser={user}>
          <AppLayout categories={categories}>{children}</AppLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
