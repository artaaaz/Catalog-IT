'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, X, Search, RotateCcw } from 'lucide-react';

interface ServiceFilterProps {
  categories?: { id: string; name: string; slug: string }[];
  owners?: string[];
  selectedCategory?: string;
  selectedStatus?: string;
  selectedOwner?: string;
  showCategorySelect?: boolean;
}

export function ServiceFilter({
  categories = [],
  owners = [],
  selectedCategory = 'all',
  selectedStatus = 'all',
  selectedOwner = 'all',
  showCategorySelect = true,
}: ServiceFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const hasActiveFilters =
    (selectedStatus && selectedStatus !== 'all') ||
    (selectedOwner && selectedOwner !== 'all') ||
    (showCategorySelect && selectedCategory && selectedCategory !== 'all');

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-subtle mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
          <Filter className="w-3.5 h-3.5 text-[#0068A5]" />
          <span>Filter Services</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-[#E52131] hover:text-red-700 flex items-center gap-1 hover:underline transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Category Select (if enabled) */}
        {showCategorySelect && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden transition-all font-sans"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden transition-all font-sans"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active (OK)</option>
            <option value="UNDER_REVIEW">Under Review (?)</option>
            <option value="INACTIVE">Inactive (X)</option>
          </select>
        </div>

        {/* Owner Select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Owner / Department
          </label>
          <select
            value={selectedOwner}
            onChange={(e) => handleFilterChange('owner', e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden transition-all font-sans"
          >
            <option value="all">All Owners</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
