import React from 'react';
import { getServices } from '@/lib/actions/service-actions';
import { getCategories } from '@/lib/actions/category-actions';
import { ServiceManager } from '@/components/admin/ServiceManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Services Management | Admin Console',
  description: 'Manage registered enterprise IT applications and services for Nusantara Regas.',
};

export default async function AdminServicesPage() {
  const [services, categories] = await Promise.all([
    getServices(),
    getCategories(),
  ]);

  return <ServiceManager initialServices={services as any} categories={categories} />;
}
