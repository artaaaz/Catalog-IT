'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Shield, ChevronRight, LogOut, LogIn } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useSession } from '@/lib/auth/SessionContext';
import { cn } from '@/lib/utils';

export interface SidebarCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count?: {
    services: number;
  };
}

interface SidebarProps {
  categories: SidebarCategory[];
  onItemClick?: () => void;
}

export function Sidebar({ categories, onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useSession();

  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <aside className="w-full h-full bg-white text-[#172033] flex flex-col select-none overflow-hidden border-r border-[#E2E8F0] shadow-[4px_0_20px_rgba(15,23,42,0.04)] font-sans">
      {/* Top 3-Color Brand Accent Line: Pertamina Blue, Red, Green (4px Solid Segments) */}
      <div className="w-full h-[4px] flex shrink-0">
        <div className="w-1/3 h-full bg-[#0068A5]" />
        <div className="w-1/3 h-full bg-[#E52131]" />
        <div className="w-1/3 h-full bg-[#ABBC32]" />
      </div>

      {/* Sidebar Header Brand - Logo & Title */}
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-col gap-2 shrink-0 bg-white">
        <Link href="/" onClick={onItemClick} className="flex flex-col items-center group">
          <div className="relative w-full h-[58px] flex items-center justify-center px-1">
            <Image
              src="/images/pertamina-nusantara-regas.png"
              alt="Pertamina Nusantara Regas"
              width={210}
              height={54}
              priority
              className="object-contain max-h-[54px] max-w-[210px] w-auto transition-transform duration-200 group-hover:scale-[1.01]"
            />
          </div>
        </Link>
        <div className="pt-2 px-1 border-t border-[#E2E8F0] flex flex-col">
          <h2 className="text-[17px] font-bold text-[#172033] tracking-wide font-sans leading-tight">
            NR IT CATALOG
          </h2>
          <p className="text-[11.5px] text-[#64748B] font-medium tracking-wider uppercase mt-0.5">
            IT SERVICE DIRECTORY
          </p>
        </div>
      </div>

      {/* Navigation Links - Scrollable vertically with airy spacing */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Main Section */}
        <div className="space-y-1.5">
          <div className="px-3 text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Overview
          </div>

          <Link
            href="/"
            onClick={onItemClick}
            className={cn(
              'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium transition-all group font-sans leading-normal',
              isHome
                ? 'bg-[#0068A5]/[0.08] text-[#0068A5] font-semibold'
                : 'text-slate-700 hover:text-[#0068A5] hover:bg-slate-50/90'
            )}
          >
            {/* Left active indicator line: thin 3.5px, subtle solid blue */}
            {isHome && (
              <span className="absolute left-0 top-2 bottom-2 w-[3.5px] bg-[#0068A5] rounded-r-md" />
            )}
            <div className="flex items-center gap-3 pl-0.5">
              <Home
                className={cn(
                  'w-[18px] h-[18px] transition-colors shrink-0',
                  isHome ? 'text-[#0068A5]' : 'text-slate-400 group-hover:text-[#0068A5]'
                )}
              />
              <span>Home</span>
            </div>
          </Link>
        </div>

        {/* Categories Section */}
        <div className="space-y-1.5">
          <div className="px-3 flex items-center justify-between text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Categories</span>
            <span className="text-[11.5px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded-md">
              {categories.length}
            </span>
          </div>

          <div className="space-y-1.5">
            {categories.map((cat) => {
              const isActive = pathname === `/services/${cat.slug}`;
              const count = cat._count?.services;

              return (
                <Link
                  key={cat.id}
                  href={`/services/${cat.slug}`}
                  onClick={onItemClick}
                  className={cn(
                    'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium transition-all group font-sans leading-normal',
                    isActive
                      ? 'bg-[#0068A5]/[0.08] text-[#0068A5] font-semibold'
                      : 'text-slate-700 hover:text-[#0068A5] hover:bg-slate-50/90'
                  )}
                >
                  {/* Left active indicator line: thin 3.5px */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3.5px] bg-[#0068A5] rounded-r-md" />
                  )}

                  <div className="flex items-center gap-3 min-w-0 pl-0.5">
                    <CategoryIcon
                      name={cat.icon || cat.slug}
                      className={cn(
                        'w-[18px] h-[18px] shrink-0 transition-colors',
                        isActive ? 'text-[#0068A5]' : 'text-slate-400 group-hover:text-[#0068A5]'
                      )}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>

                  {typeof count === 'number' && (
                    <span
                      className={cn(
                        'text-[11.5px] px-2 py-0.5 rounded-md font-medium transition-colors shrink-0',
                        isActive
                          ? 'bg-[#0068A5]/15 text-[#0068A5] font-semibold'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Management / Admin Section — ONLY VISIBLE FOR ADMIN ROLE */}
        {user && user.role === 'ADMIN' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
            <div className="px-3 text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Administration
            </div>

            <Link
              href="/admin"
              onClick={onItemClick}
              className={cn(
                'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium transition-all group font-sans leading-normal',
                isAdmin
                  ? 'bg-[#0068A5]/[0.08] text-[#0068A5] font-semibold'
                  : 'text-slate-700 hover:text-[#0068A5] hover:bg-slate-50/90'
              )}
            >
              {isAdmin && (
                <span className="absolute left-0 top-2 bottom-2 w-[3.5px] bg-[#0068A5] rounded-r-md" />
              )}
              <div className="flex items-center gap-3 pl-0.5">
                <Shield
                  className={cn(
                    'w-[18px] h-[18px] transition-colors shrink-0',
                    isAdmin ? 'text-[#0068A5]' : 'text-slate-400 group-hover:text-[#0068A5]'
                  )}
                />
                <span>Admin Console</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </nav>

      {/* Footer Info & User Session Card */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 shrink-0 space-y-2.5">
        {user ? (
          <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-2.5 rounded-xl shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#0068A5] text-white flex items-center justify-center text-[11px] font-semibold uppercase shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-[#172033] truncate max-w-[130px]">
                  {user.name}
                </div>
                <div className="text-[10px] font-semibold text-[#0068A5] uppercase tracking-wider">
                  {user.role}
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0068A5] hover:bg-[#005487] text-white rounded-xl text-[13px] font-semibold shadow-2xs transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        )}

        <div className="text-[11.5px] text-slate-500 flex items-center justify-between px-1">
          <span>NR IT Services v1.0</span>
          <span className="flex items-center gap-1.5 text-[#ABBC32] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ABBC32] animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}
