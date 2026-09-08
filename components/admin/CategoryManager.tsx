'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Layers,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/actions/category-actions';
import { CategoryFormValues } from '@/lib/validations/category';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  _count: {
    services: number;
  };
}

interface CategoryManagerProps {
  initialCategories: CategoryItem[];
}

const AVAILABLE_ICONS = [
  'Briefcase',
  'CircleDollarSign',
  'Users',
  'Package',
  'Cog',
  'ShieldCheck',
  'AlertTriangle',
  'Headphones',
  'Globe',
  'Database',
  'Server',
  'Layers',
  'FileText',
  'Activity',
];

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [blockedDeleteCategory, setBlockedDeleteCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [formData, setFormData] = useState<CategoryFormValues>({
    name: '',
    slug: '',
    description: '',
    icon: 'Briefcase',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'Briefcase',
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: CategoryItem) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || 'Briefcase',
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    startTransition(async () => {
      try {
        if (editingCategory) {
          await updateCategory(editingCategory.id, formData);
        } else {
          await createCategory(formData);
        }
        setIsFormOpen(false);
        router.refresh();
      } catch (err: any) {
        setFormError(err.message || 'Failed to save category.');
      }
    });
  };

  const handleDeleteClick = (category: CategoryItem) => {
    if (category._count.services > 0) {
      setBlockedDeleteCategory(category);
      return;
    }
    setDeleteTarget(category);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteCategory(deleteTarget.id);
        setDeleteTarget(null);
        router.refresh();
      } catch (err: any) {
        alert(`Failed to delete: ${err.message}`);
      }
    });
  };

  const handleReassignRedirect = (category: CategoryItem) => {
    setBlockedDeleteCategory(null);
    router.push(`/admin/services?category=${category.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Categories & Domains Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize service directory taxonomy, IT business units, and navigation icons.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0068A5] hover:bg-[#005487] active:bg-[#034770] rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Icon</th>
                <th className="px-4 py-3.5">Category Name</th>
                <th className="px-4 py-3.5">Slug / Route</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5 text-center">Linked Services</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialCategories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0068A5]/[0.08] text-[#0068A5] flex items-center justify-center border border-[#0068A5]/20">
                      <CategoryIcon name={category.icon || category.slug} className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900 text-sm">
                    {category.name}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-500">
                    /services/{category.slug}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 max-w-md truncate">
                    {category.description || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0068A5]/[0.08] text-[#0068A5] border border-[#0068A5]/20">
                      <Layers className="w-3 h-3" />
                      <span>{category._count.services}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(category)}
                        className="p-1.5 text-slate-600 hover:text-[#0068A5] hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="p-1.5 text-slate-400 hover:text-[#E52131] hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Category Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create IT Category'}
        description="Configure domain taxonomy and sidebar icons."
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#E52131] text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category Name <span className="text-[#E52131]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. HSSE, Business, Operations"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Icon Symbol
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVAILABLE_ICONS.map((iconName) => {
                const isSelected = formData.icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-[#0068A5] text-white border-[#0068A5] shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <CategoryIcon name={iconName} className="w-4 h-4" />
                    <span className="text-[9px] truncate max-w-full font-medium">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short summary of IT services categorized under this domain..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden"
            />
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
              {isPending ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Linked Services Warning Modal (Cannot delete until reassigned) */}
      <Modal
        isOpen={Boolean(blockedDeleteCategory)}
        onClose={() => setBlockedDeleteCategory(null)}
        title="Hapus Kategori?"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2 pt-0.5">
              <p className="text-sm font-semibold text-[#172033]">
                Category masih digunakan oleh beberapa service ({blockedDeleteCategory?._count.services} service terhubung pada <span className="text-[#0068A5] font-bold">{blockedDeleteCategory?.name}</span>).
              </p>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Silakan pindahkan atau hapus relasi service terkait terlebih dahulu sebelum menghapus kategori ini.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setBlockedDeleteCategory(null)}
              className="px-4 py-2 text-xs font-semibold text-[#172033] bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            {blockedDeleteCategory && (
              <button
                type="button"
                onClick={() => handleReassignRedirect(blockedDeleteCategory)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0068A5] hover:bg-[#005487] rounded-lg shadow-xs transition-colors"
              >
                <span>Lihat Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog (for empty categories) */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to permanently delete category "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Category"
        isLoading={isPending}
      />
    </div>
  );
}
