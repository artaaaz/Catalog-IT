import React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight, Building, Server, Wrench, Network } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

export interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    url: string | null;
    owner: string | null;
    developer: string | null;
    server: string | null;
    integration: string | null;
    status: string;
    category?: {
      id: string;
      name: string;
      slug: string;
      icon: string | null;
    } | null;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const hasUrl = Boolean(service.url && (service.url.startsWith('http://') || service.url.startsWith('https://')));

  return (
    <div className="group bg-white border border-[#E2E8F0] hover:border-[#0068A5]/40 rounded-[14px] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left / Main Content */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Category Icon */}
        <div className="w-10 h-10 rounded-lg bg-[#EAF5FA] border border-[#0068A5]/20 flex items-center justify-center text-[#0068A5] shrink-0 mt-0.5 group-hover:bg-[#0068A5] group-hover:text-white transition-all duration-200">
          <CategoryIcon
            name={service.category?.icon || service.category?.slug || 'globe'}
            className="w-5 h-5"
          />
        </div>

        {/* Info & Meta */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/services/detail/${service.slug}`}
              className="text-base font-semibold text-[#172033] group-hover:text-[#0068A5] transition-colors font-sans hover:underline decoration-[#0068A5]/40"
            >
              {service.name}
            </Link>
            {service.category && (
              <span className="text-[11px] font-medium text-[#0068A5] bg-[#EAF5FA] px-2 py-0.5 rounded-md border border-[#0068A5]/15">
                {service.category.name}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed line-clamp-2">
            {service.description || 'No detailed description available for this service.'}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-[#64748B]">
            {service.owner && (
              <div className="flex items-center gap-1 font-medium text-[#172033]">
                <Building className="w-3 h-3 text-[#64748B]" />
                <span>Owner: {service.owner}</span>
              </div>
            )}
            {service.developer && (
              <div className="flex items-center gap-1 text-[#64748B]">
                <Wrench className="w-3 h-3 text-[#64748B]" />
                <span>Dev: {service.developer}</span>
              </div>
            )}
            {service.server && (
              <div className="hidden sm:flex items-center gap-1 text-[#64748B]">
                <Server className="w-3 h-3 text-[#64748B]" />
                <span>Host: {service.server}</span>
              </div>
            )}
            {service.integration && (
              <div className="hidden lg:flex items-center gap-1 text-[#64748B]">
                <Network className="w-3 h-3 text-[#64748B]" />
                <span>Integration: {service.integration}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right / Actions Row */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <StatusBadge status={service.status} className="shrink-0" />

        <div className="flex items-center gap-2">
          <Link
            href={`/services/detail/${service.slug}`}
            className="px-3 py-1.5 text-xs font-semibold text-[#172033] hover:text-[#0068A5] hover:bg-[#EAF5FA] rounded-lg border border-[#E2E8F0] hover:border-[#0068A5]/30 transition-all inline-flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {hasUrl ? (
            <a
              href={service.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0068A5] hover:bg-[#005487] active:bg-[#034770] rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5 group/btn"
            >
              <span>Open Service</span>
              <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          ) : (
            <span className="px-3 py-1.5 text-xs font-medium text-[#64748B]/60 bg-slate-100 border border-slate-200/60 rounded-lg select-none">
              No URL
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

