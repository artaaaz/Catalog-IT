'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  ShieldAlert,
  ArrowLeft,
  Shield,
  LogOut,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { useSession } from '@/lib/auth/SessionContext';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useSession();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Services',
      href: '/admin/services',
      icon: Layers,
      active: pathname.startsWith('/admin/services'),
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: FolderTree,
      active: pathname.startsWith('/admin/categories'),
    },
    {
      label: 'SLA Management',
      href: '/admin/sla',
      icon: ShieldAlert,
      active: pathname.startsWith('/admin/sla'),
    },
    {
      label: 'User Approvals',
      href: '/admin/user-approvals',
      icon: Users,
      active: pathname.startsWith('/admin/user-approvals') || pathname.startsWith('/admin/users'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans antialiased text-slate-800">
      {/* Top 3-Color Brand Accent Line */}
      <div className="w-full h-[3px] flex shrink-0">
        <div className="w-1/3 h-full bg-[#0068A5]" />
        <div className="w-1/3 h-full bg-[#E52131]" />
        <div className="w-1/3 h-full bg-[#ABBC32]" />
      </div>

      {/* Admin Topbar Header - Clean Light Corporate Style */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0068A5]/[0.08] border border-[#0068A5]/20 flex items-center justify-center text-[#0068A5] shrink-0 shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 tracking-tight font-sans">
                    NR IT CATALOG
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-[#0068A5]/[0.08] border border-[#0068A5]/20 text-[#0068A5]">
                    ADMIN CONSOLE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Enterprise Service Management
                </p>
              </div>
            </div>

            {/* Admin Right Actions: User info, Exit, Sign Out */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div className="w-5 h-5 rounded-full bg-[#0068A5] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#0068A5]/10 text-[#0068A5] text-[9px] font-bold rounded">
                    ADMIN
                  </span>
                </div>
              )}

              {/* Back to Portal link */}
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#0068A5] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit to Portal</span>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Lightweight Horizontal Tabs Navigation */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto border-t border-slate-100 -mb-px pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap',
                    item.active
                      ? 'border-[#0068A5] text-[#0068A5] font-semibold bg-[#0068A5]/[0.04] rounded-t-md'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      item.active ? 'text-[#0068A5]' : 'text-slate-400'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Admin Content Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
