import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  ExternalLink,
  Building,
  Wrench,
  Server,
  Network,
  Calendar,
  Clock,
  ShieldAlert,
  Info,
  Layers,
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { getServiceBySlug } from '@/lib/actions/service-actions';
import { getCurrentUser } from '@/lib/auth/session';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

export const dynamic = 'force-dynamic';

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: 'Service Not Found | NR IT CATALOG' };

  return {
    title: `${service.name} | NR IT CATALOG`,
    description: service.description || `IT Service detail for ${service.name} at Nusantara Regas.`,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const [service, user] = await Promise.all([
    getServiceBySlug(params.slug),
    getCurrentUser(),
  ]);

  if (!service) {
    notFound();
  }

  const hasUrl = Boolean(
    service.url && (service.url.startsWith('http://') || service.url.startsWith('https://'))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href={`/services/${service.category.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0068A5] hover:text-[#005487] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {service.category.name}</span>
        </Link>

        {/* Navigation Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#64748B]">
          <Link href="/" className="hover:text-[#0068A5] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href={`/services/${service.category.slug}`}
            className="hover:text-[#0068A5] transition-colors"
          >
            {service.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033] font-semibold truncate max-w-xs">{service.name}</span>
        </nav>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#0068A5] text-white flex items-center justify-center shrink-0 shadow-sm">
            <CategoryIcon
              name={service.category.icon || service.category.slug}
              className="w-7 h-7"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#EAF5FA] text-[#0068A5] border border-[#0068A5]/20">
                {service.category.name}
              </span>
              <StatusBadge status={service.status} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight font-sans">
              {service.name}
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-3xl pt-1">
              {service.description || 'No detailed description provided for this application.'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 self-start md:self-auto">
          {hasUrl ? (
            <a
              href={service.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0068A5] hover:bg-[#005487] active:bg-[#034770] rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Open Service</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="px-4 py-2 text-xs font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-lg text-center">
              Service URL unavailable
            </div>
          )}
        </div>
      </div>

      {/* Main Details Grid: Information + SLA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Information (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8F0]">
              <div className="p-2 rounded-lg bg-[#EAF5FA] text-[#0068A5]">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-[#172033] font-sans">Service Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {/* Category */}
              <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0]">
                <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Category</span>
                </div>
                <div className="font-semibold text-[#172033]">{service.category.name}</div>
              </div>

              {/* Owner */}
              <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0]">
                <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5 mb-1">
                  <Building className="w-3.5 h-3.5" />
                  <span>Owner Apps / Department</span>
                </div>
                <div className="font-semibold text-[#172033]">
                  {service.owner || 'Not Defined'}
                </div>
              </div>

              {/* Developer */}
              <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0]">
                <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5 mb-1">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Developer / Maintainer</span>
                </div>
                <div className="font-semibold text-[#172033]">
                  {service.developer || 'Not Defined'}
                </div>
              </div>

              {/* Server / Host */}
              <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0]">
                <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5 mb-1">
                  <Server className="w-3.5 h-3.5" />
                  <span>Server / VM Infrastructure</span>
                </div>
                <div className="font-semibold text-[#172033]">
                  {service.server || 'Not Defined'}
                </div>
              </div>

              {/* Status */}
              <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0] sm:col-span-2">
                <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Operational Status</span>
                </div>
                <div className="pt-0.5">
                  <StatusBadge status={service.status} />
                </div>
              </div>

              {/* Integration & Notes */}
              <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0] sm:col-span-2">
                <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5 mb-1">
                  <Network className="w-3.5 h-3.5" />
                  <span>Integration & Notes</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#172033] whitespace-pre-line leading-relaxed">
                  {service.integration || 'Belum ada Integrasi / Standalone'}
                </div>
              </div>

              {/* Direct URL */}
              {hasUrl && (
                <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0] sm:col-span-2">
                  <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5 mb-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Application URL</span>
                  </div>
                  <a
                    href={service.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#0068A5] hover:text-[#005487] hover:underline break-all"
                  >
                    {service.url}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SLA Section (1 Column) */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#EAF5FA] text-[#0068A5]">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-[#172033] font-sans">Service Level Agreement</h2>
              </div>
            </div>

            {service.sla ? (
              <div className="space-y-3 text-xs">
                {/* Priority */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Priority</span>
                  <PriorityBadge priority={service.sla.priority} />
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Availability</span>
                  <span className="font-semibold text-slate-800">
                    {service.sla.availability || 'Not Defined'}
                  </span>
                </div>

                {/* Response Time */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Response Time</span>
                  <span className="font-semibold text-slate-800">
                    {service.sla.responseTime || 'Not Defined'}
                  </span>
                </div>

                {/* Resolution Time */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Resolution Time</span>
                  <span className="font-semibold text-slate-800">
                    {service.sla.resolutionTime || 'Not Defined'}
                  </span>
                </div>

                {/* Support Hours */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Support Hours</span>
                  <span className="font-semibold text-slate-800">
                    {service.sla.supportHours || 'Not Defined'}
                  </span>
                </div>

                {/* SLA Notes */}
                {service.sla.notes && (
                  <div className="pt-2">
                    <span className="text-slate-500 font-medium block mb-1">Notes</span>
                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      {service.sla.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* If SLA is not defined yet, display accurate message as requested */
              <div className="py-6 px-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-xs font-bold text-slate-700 font-sans">
                  SLA information is not available yet.
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Service level targets and uptime commitments have not been configured for this service yet.
                </p>
                {user && user.role === 'ADMIN' ? (
                  <div className="pt-2">
                    <Link
                      href={`/admin/sla`}
                      className="text-[11px] font-semibold text-[#0068A5] hover:text-[#005487] hover:underline"
                    >
                      Configure SLA in Admin Console →
                    </Link>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 pt-1">
                    Hubungi IT Service Desk untuk informasi SLA lebih lanjut.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
