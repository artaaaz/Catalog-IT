'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { createService, updateService, deleteService } from '@/lib/actions/service-actions';
import { ServiceFormValues } from '@/lib/validations/service';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string | null;
  url: string | null;
  owner: string | null;
  developer: string | null;
  server: string | null;
  integration: string | null;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'INACTIVE';
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface ServiceManagerProps {
  initialServices: ServiceItem[];
  categories: CategoryItem[];
}

export function ServiceManager({ initialServices, categories }: ServiceManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<ServiceFormValues>({
    name: '',
    categoryId: categories[0]?.id || '',
    description: '',
    url: '',
    owner: '',
    developer: '',
    server: '',
    integration: '',
    status: 'ACTIVE',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      url: '',
      owner: '',
      developer: '',
      server: '',
      integration: '',
      status: 'ACTIVE',
    });
    setFormError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      categoryId: service.categoryId,
      description: service.description || '',
      url: service.url || '',
      owner: service.owner || '',
      developer: service.developer || '',
      server: service.server || '',
      integration: service.integration || '',
      status: service.status,
    });
    setFormError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    // Client-side quick check
    if (!formData.name.trim()) {
      setFieldErrors({ name: 'Service name is required' });
      return;
    }
    if (!formData.categoryId) {
      setFieldErrors({ categoryId: 'Please select a category' });
      return;
    }

    startTransition(async () => {
      try {
        if (editingService) {
          await updateService(editingService.id, formData);
        } else {
          await createService(formData);
        }
        setIsFormOpen(false);
        router.refresh();
      } catch (err: any) {
        setFormError(err.message || 'Failed to save service.');
      }
    });
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteService(deleteTarget.id);
        setDeleteTarget(null);
        router.refresh();
      } catch (err: any) {
        alert(`Failed to delete: ${err.message}`);
      }
    });
  };

  // Filtered Services list
  const filteredServices = initialServices.filter((s) => {
    const matchesSearch =
      search.trim() === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase())) ||
      (s.owner && s.owner.toLowerCase().includes(search.toLowerCase())) ||
      (s.developer && s.developer.toLowerCase().includes(search.toLowerCase())) ||
      s.category.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || s.categoryId === categoryFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Services Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Register, edit metadata, update infrastructure specs, and maintain enterprise catalog items.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0068A5] hover:bg-[#005487] active:bg-[#034770] rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services, owners, developers..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden transition-colors font-sans"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden font-sans"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden font-sans"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active (OK)</option>
            <option value="UNDER_REVIEW">Under Review (?)</option>
            <option value="INACTIVE">Inactive (X)</option>
          </select>

          <span className="text-xs font-medium text-slate-400 self-center pl-1">
            {filteredServices.length} {filteredServices.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Service Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Owner Apps</th>
                <th className="px-4 py-3.5">Developer</th>
                <th className="px-4 py-3.5">Server / Host</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      <div>
                        <span>{service.name}</span>
                        {service.url && (
                          <a
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[11px] font-mono font-normal text-[#0068A5] hover:underline truncate max-w-xs"
                          >
                            {service.url}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {service.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{service.owner || '—'}</td>
                    <td className="px-4 py-3.5 text-slate-600">{service.developer || '—'}</td>
                    <td className="px-4 py-3.5 text-slate-600">{service.server || '—'}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={service.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(service)}
                          className="p-1.5 text-slate-600 hover:text-[#0068A5] hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(service)}
                          className="p-1.5 text-slate-400 hover:text-[#E52131] hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No services found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Service Modal Form */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingService ? `Edit Service: ${editingService.name}` : 'Register New IT Service'}
        description="Fill in the service specifications and operational metadata."
        maxWidth="xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#E52131] text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Service Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service / Application Name <span className="text-[#E52131]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Nusantara Regas Web Portal"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
              {fieldErrors.name && (
                <p className="text-[11px] text-[#E52131] mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category / Domain <span className="text-[#E52131]">*</span>
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operational Status <span className="text-[#E52131]">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              >
                <option value="ACTIVE">Active (OK)</option>
                <option value="UNDER_REVIEW">Under Review (?)</option>
                <option value="INACTIVE">Inactive (X)</option>
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Overview and purpose of this IT application..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
            </div>

            {/* URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application URL (Optional, must start with http:// or https://)
              </label>
              <input
                type="text"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://app.nusantararegas.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden font-mono"
              />
            </div>

            {/* Owner Apps */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner Apps / Department
              </label>
              <input
                type="text"
                value={formData.owner || ''}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="e.g. Seksi Sistem Informasi, Procurement"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
            </div>

            {/* Developer */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Developer / Vendor
              </label>
              <input
                type="text"
                value={formData.developer || ''}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                placeholder="e.g. Internal NR, Vendor, Pertamina"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
            </div>

            {/* Server / VM */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Server / VM Environment
              </label>
              <input
                type="text"
                value={formData.server || ''}
                onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                placeholder="e.g. On Premise, Pertamina Cloud"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
              />
            </div>

            {/* Integration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Integration & Notes
              </label>
              <input
                type="text"
                value={formData.integration || ''}
                onChange={(e) => setFormData({ ...formData, integration: e.target.value })}
                placeholder="e.g. LDAP Pertamina, Single Sign On"
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
              {isPending ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to permanently remove "${deleteTarget?.name}" from the IT catalog? This action cannot be undone.`}
        confirmLabel="Delete Service"
        isLoading={isPending}
      />
    </div>
  );
}
