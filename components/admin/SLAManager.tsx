'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Layers,
} from 'lucide-react';
import { PriorityBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { upsertSLA, deleteSLA } from '@/lib/actions/sla-actions';
import { SLAFormValues } from '@/lib/validations/sla';

interface ServiceWithSLA {
  id: string;
  name: string;
  slug: string;
  category: {
    name: string;
  };
  sla: {
    id: string;
    availability: string | null;
    responseTime: string | null;
    resolutionTime: string | null;
    supportHours: string | null;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
    notes: string | null;
  } | null;
}

interface SLAManagerProps {
  services: ServiceWithSLA[];
}

export function SLAManager({ services }: SLAManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [filterSlaStatus, setFilterSlaStatus] = useState<'all' | 'configured' | 'undefined'>('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceWithSLA | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState<SLAFormValues>({
    serviceId: '',
    availability: '99.5% Uptime',
    responseTime: '< 30 Minutes',
    resolutionTime: '< 4 Hours',
    supportHours: '08:00 - 17:00 WIB (Mon-Fri)',
    priority: 'MEDIUM',
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenEditSLA = (service: ServiceWithSLA) => {
    setSelectedService(service);
    if (service.sla) {
      setFormData({
        serviceId: service.id,
        availability: service.sla.availability || '',
        responseTime: service.sla.responseTime || '',
        resolutionTime: service.sla.resolutionTime || '',
        supportHours: service.sla.supportHours || '',
        priority: service.sla.priority || 'MEDIUM',
        notes: service.sla.notes || '',
      });
    } else {
      setFormData({
        serviceId: service.id,
        availability: '99.5% Uptime',
        responseTime: '< 30 Minutes',
        resolutionTime: '< 4 Hours',
        supportHours: '08:00 - 17:00 WIB (Mon-Fri)',
        priority: 'MEDIUM',
        notes: '',
      });
    }
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      try {
        await upsertSLA(formData);
        setIsFormOpen(false);
        router.refresh();
      } catch (err: any) {
        setFormError(err.message || 'Failed to save SLA configuration.');
      }
    });
  };

  const handleDeleteSLA = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteSLA(deleteTarget.id);
        setDeleteTarget(null);
        router.refresh();
      } catch (err: any) {
        alert(`Failed to delete SLA: ${err.message}`);
      }
    });
  };

  const filtered = services.filter((s) => {
    const matchesSearch =
      search.trim() === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.name.toLowerCase().includes(search.toLowerCase());

    const hasSLA = Boolean(s.sla);
    const matchesStatus =
      filterSlaStatus === 'all' ||
      (filterSlaStatus === 'configured' && hasSLA) ||
      (filterSlaStatus === 'undefined' && !hasSLA);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Service Level Agreements (SLA)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure uptime targets, response times, resolution thresholds, and support windows for each service.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service SLA..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden transition-colors font-sans"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={filterSlaStatus}
            onChange={(e) => setFilterSlaStatus(e.target.value as any)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden font-sans"
          >
            <option value="all">All Services ({services.length})</option>
            <option value="configured">SLA Configured</option>
            <option value="undefined">SLA Not Defined</option>
          </select>
        </div>
      </div>

      {/* SLA Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Service Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5">Availability</th>
                <th className="px-4 py-3.5">Response Time</th>
                <th className="px-4 py-3.5">Resolution Time</th>
                <th className="px-4 py-3.5">Support Hours</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {service.name}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">
                    {service.category.name}
                  </td>
                  <td className="px-4 py-3.5">
                    {service.sla?.priority ? (
                      <PriorityBadge priority={service.sla.priority} />
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Not Defined</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    {service.sla?.availability || (
                      <span className="text-slate-400 font-normal">Not Defined</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {service.sla?.responseTime || (
                      <span className="text-slate-400 font-normal">Not Defined</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {service.sla?.resolutionTime || (
                      <span className="text-slate-400 font-normal">Not Defined</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">
                    {service.sla?.supportHours || (
                      <span className="text-slate-400 font-normal">Not Defined</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditSLA(service)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0068A5] hover:text-[#005487] hover:bg-[#0068A5]/[0.08] rounded-md transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{service.sla ? 'Edit SLA' : 'Define SLA'}</span>
                      </button>

                      {service.sla && (
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              id: service.sla!.id,
                              name: service.name,
                            })
                          }
                          className="p-1 text-slate-400 hover:text-[#E52131] hover:bg-red-50 rounded-md transition-colors"
                          title="Remove SLA Configuration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Upsert SLA Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={`Configure SLA: ${selectedService?.name}`}
        description="Set formal service level agreements and support parameters."
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#E52131] text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Tier <span className="text-[#E52131]">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as any })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              >
                <option value="CRITICAL">CRITICAL (Tier 1 Core)</option>
                <option value="HIGH">HIGH (High Business Impact)</option>
                <option value="MEDIUM">MEDIUM (Standard Operation)</option>
                <option value="LOW">LOW (Internal Support)</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Availability / Uptime Target
              </label>
              <input
                type="text"
                value={formData.availability || ''}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                placeholder="e.g. 99.5% Uptime, 24/7 Continuous"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
            </div>

            {/* Response Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Response Time Target
              </label>
              <input
                type="text"
                value={formData.responseTime || ''}
                onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
                placeholder="e.g. < 15 Minutes, < 1 Hour"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
            </div>

            {/* Resolution Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resolution Time Target
              </label>
              <input
                type="text"
                value={formData.resolutionTime || ''}
                onChange={(e) =>
                  setFormData({ ...formData, resolutionTime: e.target.value })
                }
                placeholder="e.g. < 4 Hours, Next Business Day"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
            </div>

            {/* Support Hours */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Support Operational Hours
              </label>
              <input
                type="text"
                value={formData.supportHours || ''}
                onChange={(e) => setFormData({ ...formData, supportHours: e.target.value })}
                placeholder="e.g. 08:00 - 17:00 WIB (Mon - Fri) / 24x7 On-call"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SLA Operational Notes / Escalation Path
              </label>
              <textarea
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Escalation contact, maintenance windows, or specific caveats..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              disabled={isPending}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0068A5] hover:bg-[#005487] rounded-lg shadow-xs disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Saving...' : 'Save SLA Settings'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete SLA Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteSLA}
        title="Reset SLA Configuration"
        message={`Are you sure you want to clear the SLA configuration for "${deleteTarget?.name}"? The service will revert to "SLA information is not available yet."`}
        confirmLabel="Clear SLA"
        isLoading={isPending}
      />
    </div>
  );
}
