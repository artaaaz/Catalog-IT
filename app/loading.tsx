import React from 'react';
import { Skeleton, ServiceCardSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner Skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-96 max-w-full" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Service Cards Skeletons */}
      <div className="space-y-3.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
