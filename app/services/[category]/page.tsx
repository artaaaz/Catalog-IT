import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, FolderOpen, Layers } from 'lucide-react';
import { getCategoryBySlug, getCategories } from '@/lib/actions/category-actions';
import { getServices, getUniqueOwners } from '@/lib/actions/service-actions';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceFilter } from '@/components/services/ServiceFilter';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    status?: string;
    owner?: string;
    search?: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.category);
  if (!category) return { title: 'Category Not Found | NR IT CATALOG' };

  return {
    title: `${category.name} Services | NR IT CATALOG`,
    description: category.description || `IT Services in ${category.name} category.`,
  };
}

export default async function CategoryServicePage({
  params,
  searchParams,
}: CategoryPageProps) {
  const categorySlug = params.category;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const [services, owners, allCategories] = await Promise.all([
    getServices({
      categorySlug,
      status: searchParams.status,
      owner: searchParams.owner,
      search: searchParams.search,
    }),
    getUniqueOwners(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-[#0068A5] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400">Services</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">{category.name}</span>
      </nav>

      {/* Category Header Banner with #EAF5FA light-blue area and solid #0068A5 corporate accent on the right */}
      <div className="relative overflow-hidden bg-[#EAF5FA] border border-[#0068A5]/20 rounded-2xl p-6 sm:p-7 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Solid Dark Blue Layered Corporate Right Edge Accent (No Gradient) */}
        <div className="absolute top-0 right-0 bottom-0 w-2 sm:w-2.5 bg-[#0068A5] rounded-r-2xl" />

        <div className="flex items-start gap-4 pr-3">
          <div className="w-12 h-12 rounded-xl bg-[#0068A5] text-white flex items-center justify-center shrink-0 shadow-xs">
            <CategoryIcon name={category.icon || category.slug} className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {category.name} Services
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {category.description ||
                `Applications and IT services supporting ${category.name} operations at Nusantara Regas.`}
            </p>
          </div>
        </div>

        <div className="shrink-0 sm:text-right pr-4">
          <div className="inline-flex sm:flex-col items-baseline sm:items-end gap-1.5 sm:gap-0 bg-white/90 px-3.5 py-2 rounded-xl border border-[#0068A5]/20 shadow-xs">
            <span className="text-xl font-bold text-[#0068A5]">
              {services.length}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {services.length === 1 ? 'Service' : 'Services'} Available
            </span>
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <ServiceFilter
        categories={allCategories}
        owners={owners}
        selectedStatus={searchParams.status || 'all'}
        selectedOwner={searchParams.owner || 'all'}
        showCategorySelect={false}
      />

      {/* Service List (Vertical Stack of Horizontal Cards) */}
      {services.length > 0 ? (
        <div className="space-y-3.5">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-subtle space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No services available in this category.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no registered IT services matching your selected filters in this section.
          </p>
          <Link
            href={`/services/${category.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0068A5] bg-[#0068A5]/[0.08] hover:bg-[#0068A5]/15 rounded-lg transition-colors mt-2"
          >
            <span>Clear Filters</span>
          </Link>
        </div>
      )}
    </div>
  );
}
