import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Active',
        dotColor: 'bg-[#ABBC32]',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      };
    case 'UNDER_REVIEW':
      return {
        label: 'Under Review',
        dotColor: 'bg-amber-500',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      };
    case 'INACTIVE':
      return {
        label: 'Inactive',
        dotColor: 'bg-[#E52131]',
        badgeBg: 'bg-rose-50 text-[#E52131] border-rose-200/80',
      };
    default:
      return {
        label: status,
        dotColor: 'bg-slate-400',
        badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
      };
  }
}

export function getPriorityBadge(priority: string | null | undefined) {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-red-50 text-[#E52131] border-red-200';
    case 'HIGH':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'MEDIUM':
      return 'bg-[#0068A5]/[0.08] text-[#0068A5] border-[#0068A5]/20';
    case 'LOW':
      return 'bg-slate-50 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}
