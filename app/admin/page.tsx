import React from 'react';
import Link from 'next/link';
import {
  Layers,
  CheckCircle2,
  HelpCircle,
  XCircle,
  FolderTree,
  ShieldAlert,
  Plus,
  ArrowRight,
  ExternalLink,
  Edit,
} from 'lucide-react';
import { getStats, getServices } from '@/lib/actions/service-actions';
import { getCategories } from '@/lib/actions/category-actions';
import { prisma } from '@/lib/prisma';
import { StatusBadge } from '@/components/ui/Badge';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [stats, categories, services, slaCount] = await Promise.all([
    getStats(),
    getCategories(),
    getServices(),
    prisma.sLA.count(),
  ]);

  const slaCoverage = stats.total > 0 ? Math.round((slaCount / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview and governance of Nusantara Regas enterprise IT services and infrastructure directory.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0068A5] hover:bg-[#005487] rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Service</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Services */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-medium text-slate-500">Total Services</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[10px] text-[#0068A5] font-semibold mt-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Live in Catalog
          </div>
        </div>

        {/* Active Services */}
        <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-medium text-emerald-600">Active (OK)</div>
          <div className="text-2xl font-bold text-emerald-900 mt-1">{stats.active}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Production
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-medium text-amber-600">Under Review (?)</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">{stats.underReview}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-1 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> In Evaluation
          </div>
        </div>

        {/* Inactive */}
        <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-medium text-rose-600">Inactive (X)</div>
          <div className="text-2xl font-bold text-rose-900 mt-1">{stats.inactive}</div>
          <div className="text-[10px] text-rose-600 font-medium mt-1 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Deprecated/Down
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-medium text-slate-500">Categories</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{categories.length}</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <FolderTree className="w-3 h-3" /> IT Domains
          </div>
        </div>

        {/* SLA Coverage */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-medium text-slate-500">SLA Defined</div>
          <div className="text-2xl font-bold text-[#0068A5] mt-1">
            {slaCount} <span className="text-xs font-normal text-slate-400">({slaCoverage}%)</span>
          </div>
          <div className="text-[10px] text-[#0068A5] font-semibold mt-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Agreements
          </div>
        </div>
      </div>

      {/* Quick Access Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/services"
          className="group bg-white border border-slate-200 hover:border-[#0068A5]/50 rounded-xl p-5 shadow-subtle hover:shadow-elevated transition-all flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-[#0068A5]/[0.08] text-[#0068A5] flex items-center justify-center shrink-0 group-hover:bg-[#0068A5] group-hover:text-white transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0068A5] transition-colors">
              Manage Services CRUD
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add, edit, inspect, and remove registered application services.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="group bg-white border border-slate-200 hover:border-[#0068A5]/50 rounded-xl p-5 shadow-subtle hover:shadow-elevated transition-all flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#0068A5] group-hover:text-white transition-colors">
            <FolderTree className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0068A5] transition-colors">
              Manage Categories CRUD
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Organize domains, taxonomy, and relational service categories safely.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/sla"
          className="group bg-white border border-slate-200 hover:border-[#0068A5]/50 rounded-xl p-5 shadow-subtle hover:shadow-elevated transition-all flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0068A5] transition-colors">
              Manage SLAs
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Define service level agreements, uptime availability, and support hours.
            </p>
          </div>
        </Link>
      </div>

      {/* All Registered Services Overview Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">Registered Services Index</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {services.length} services currently registered in the database.
            </p>
          </div>
          <Link
            href="/admin/services"
            className="text-xs font-semibold text-[#0068A5] hover:text-[#005487] flex items-center gap-1"
          >
            <span>Open Services Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Service Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Developer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.slice(0, 10).map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    <Link
                      href={`/services/detail/${service.slug}`}
                      className="hover:text-[#0068A5] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{service.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">
                    {service.category.name}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {service.owner || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {service.developer || '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/admin/services?edit=${service.id}`}
                      className="text-xs font-semibold text-[#0068A5] hover:text-[#005487] hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
