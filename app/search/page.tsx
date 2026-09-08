import React from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { getServices, getUniqueOwners } from '@/lib/actions/service-actions';
import { getCategories } from '@/lib/actions/category-actions';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceFilter } from '@/components/services/ServiceFilter';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    status?: string;
    owner?: string;
  };
}

export const metadata = {
  title: 'Search Services | NR IT CATALOG',
  description: 'Search across Nusantara Regas IT services, owners, developers, and categories.',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const [services, categories, owners] = await Promise.all([
    getServices({
      search: query,
      categorySlug: searchParams.category !== 'all' ? searchParams.category : undefined,
      status: searchParams.status,
      owner: searchParams.owner,
    }),
    getCategories(),
    getUniqueOwners(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-[#0068A5] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">Search Results</span>
      </nav>

      {/* Search Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0068A5] text-white flex items-center justify-center shrink-0 shadow-md">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {query ? `Search: "${query}"` : 'All Services Search'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Found {services.length} matching IT {services.length === 1 ? 'service' : 'services'} across Nusantara Regas systems.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <ServiceFilter
        categories={categories}
        owners={owners}
        selectedCategory={searchParams.category || 'all'}
        selectedStatus={searchParams.status || 'all'}
        selectedOwner={searchParams.owner || 'all'}
        showCategorySelect={true}
      />

      {/* Search Result List */}
      {services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-subtle space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 font-sans">No services found.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t find any IT services matching your search query &quot;{query}&quot;. Try adjusting your keywords or filters.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0068A5] bg-[#0068A5]/[0.08] hover:bg-[#0068A5]/15 rounded-lg transition-colors mt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home Catalog</span>
          </Link>
        </div>
      )}
    </div>
  );
}
