import React from 'react';
import { prisma } from '@/lib/prisma';
import { SLAManager } from '@/components/admin/SLAManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'SLA Management | Admin Console',
  description: 'Manage Service Level Agreements (SLA) for enterprise IT applications.',
};

export default async function AdminSLAPage() {
  const services = await prisma.service.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
      sla: {
        select: {
          id: true,
          availability: true,
          responseTime: true,
          resolutionTime: true,
          supportHours: true,
          priority: true,
          notes: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return <SLAManager services={services as any} />;
}
