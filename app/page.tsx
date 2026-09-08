import React from 'react';
import Link from 'next/link';
import {
  Layers,
  CheckCircle2,
  HelpCircle,
  XCircle,
  ArrowRight,
  Shield,
  ExternalLink,
  Sparkles,
  Server,
  Building,
} from 'lucide-react';
import { getStats, getServices } from '@/lib/actions/service-actions';
import { getCategories } from '@/lib/actions/category-actions';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { ServiceCard } from '@/components/services/ServiceCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [stats, categories, recentServices] = await Promise.all([
    getStats(),
    getCategories(),
    getServices(),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Overview Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5FA] text-[#0068A5] border border-[#0068A5]/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#0068A5]" />
            <span>Nusantara Regas IT Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#172033] tracking-tight font-sans leading-tight">
            Welcome to NR IT Catalog
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#64748B] leading-relaxed font-normal">
            Centralized directory of PT Nusantara Regas IT services, business applications, and infrastructure systems.
          </p>
        </div>

        {/* Database Live Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-[#E2E8F0]">
          {/* Total Services */}
          <div className="bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#0068A5] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#172033] font-sans">{stats.total}</div>
              <div className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">
                Total Services
              </div>
            </div>
          </div>

          {/* Active Services */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#ABBC32] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-950 font-sans">{stats.active}</div>
              <div className="text-[12px] font-medium text-emerald-700 uppercase tracking-wider">
                Active Services
              </div>
            </div>
          </div>

          {/* Under Review */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-amber-950 font-sans">{stats.underReview}</div>
              <div className="text-[12px] font-medium text-amber-700 uppercase tracking-wider">
                Under Review
              </div>
            </div>
          </div>

          {/* Inactive */}
          <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#E52131] text-white flex items-center justify-center shrink-0 shadow-xs">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-rose-950 font-sans">{stats.inactive}</div>
              <div className="text-[12px] font-medium text-rose-700 uppercase tracking-wider">
                Inactive
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Browse Categories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-[22px] font-bold text-[#172033] tracking-tight font-sans">
              Browse by IT Domain
            </h2>
            <p className="text-[13.5px] sm:text-sm text-[#64748B]">
              Select an IT domain or department category to explore registered applications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/services/${cat.slug}`}
              className="group bg-white border border-[#E2E8F0] hover:border-[#0068A5]/60 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#EAF5FA] border border-[#0068A5]/20 text-[#0068A5] flex items-center justify-center group-hover:bg-[#0068A5] group-hover:text-white transition-all duration-200 mb-3">
                  <CategoryIcon name={cat.icon || cat.slug} className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] sm:text-base font-semibold text-[#172033] group-hover:text-[#0068A5] transition-colors font-sans">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                  {cat.description || 'Enterprise services under this category.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#0068A5] group-hover:text-[#005487]">
                <span>{cat._count.services} Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Enterprise All Services Directory List */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-[22px] font-bold text-[#172033] tracking-tight font-sans">
              All IT Services Directory
            </h2>
            <p className="text-[13.5px] sm:text-sm text-[#64748B]">
              Complete index of {recentServices.length} operational systems across Nusantara Regas.
            </p>
          </div>
        </div>

        {/* Vertical Stack of Horizontal Cards */}
        <div className="space-y-3">
          {recentServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}
