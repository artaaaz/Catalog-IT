'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  ArrowRight,
  Shield,
  LogIn,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { useSession } from '@/lib/auth/SessionContext';

interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  owner: string | null;
  category: {
    name: string;
    slug: string;
  };
}

interface TopbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function Topbar({ onMenuToggle, isSidebarOpen }: TopbarProps) {
  const router = useRouter();
  const { user, logout } = useSession();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.slice(0, 6));
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const roleLabel = user?.role === 'ADMIN' ? 'Administrator' : 'User';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* 
        Main Header Row:
        Uses the exact same `max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8` grid container
        as the main content page so that the LEFT EDGE of the Search Bar aligns 100% pixel-perfect
        with the LEFT EDGE of the Welcome Card and Section content below it.
      */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4 lg:gap-8">
        
        {/* ===================================================
            DESKTOP SEARCH BAR (PRIMARY HEADER ELEMENT)
            - Starts at the left grid alignment line
            - Extends 800–950px across the header
            - Height: 50px, Font: 15px Poppins, Placeholder: "Search IT Services..."
            - Subtle border, subtle shadow, rounded-xl (11-12px)
            =================================================== */}
        <div
          className="hidden md:flex flex-1 max-w-[800px] lg:max-w-[880px] xl:max-w-[950px] relative"
          ref={dropdownRef}
        >
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[19px] h-[19px] text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (query.trim() && results.length > 0) setIsOpen(true);
                }}
                placeholder="Search IT Services..."
                className="w-full h-[50px] pl-12 pr-11 text-[15px] font-normal bg-white text-[#172033] border border-[#E2E8F0] hover:border-slate-300 focus:border-[#0068A5]/50 focus:ring-2 focus:ring-[#0068A5]/8 rounded-xl outline-hidden transition-all duration-150 placeholder:text-slate-400 shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus:shadow-[0_4px_16px_rgba(0,104,165,0.06)] font-sans"
              />
              {isLoading ? (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#0068A5] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setIsOpen(false);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-98 duration-150 font-sans">
              {results.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-slate-100">
                    Services ({results.length})
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {results.map((item) => (
                      <Link
                        key={item.id}
                        href={`/services/detail/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-[#EAF5FA]/60 transition-colors group"
                      >
                        <div className="space-y-0.5 min-w-0 pr-3">
                          <div className="text-[14px] font-semibold text-[#172033] group-hover:text-[#0068A5] transition-colors truncate font-sans">
                            {item.name}
                          </div>
                          <div className="text-[12px] text-[#64748B] truncate flex items-center gap-2">
                            <span>{item.category?.name || 'General'}</span>
                            <span>•</span>
                            <span>{item.owner || 'PT Nusantara Regas'}</span>
                          </div>
                        </div>
                        <StatusBadge status={item.status} className="shrink-0 text-[10px]" />
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-[#E2E8F0] px-4 py-2.5 bg-slate-50/80">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-xs font-semibold text-[#0068A5] hover:text-[#005487] flex items-center justify-center gap-1.5 py-0.5 transition-colors"
                    >
                      View all results for &quot;{query}&quot; <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : query.trim() ? (
                <div className="p-6 text-center text-xs text-[#64748B]">
                  No services found for &quot;<span className="font-semibold text-[#172033]">{query}</span>&quot;
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* ===================================================
            MOBILE LEFT: Drawer Menu Toggle & Mobile Brand Logo
            =================================================== */}
        <div className="md:hidden flex items-center gap-2.5 shrink-0">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isSidebarOpen ? (
                <X className="w-[19px] h-[19px]" />
              ) : (
                <Menu className="w-[19px] h-[19px]" />
              )}
            </button>
          )}

          {/* Logo on Mobile Header (Proportional ~170-190px) */}
          <Link href="/" className="flex items-center">
            <div className="relative w-[170px] sm:w-[190px] h-[36px] flex items-center">
              <Image
                src="/images/pertamina-nusantara-regas.png"
                alt="Pertamina Nusantara Regas"
                width={190}
                height={36}
                priority
                className="object-contain w-auto h-full max-h-[36px]"
              />
            </div>
          </Link>
        </div>

        {/* ===================================================
            RIGHT: Compact User Profile & Tertiary Actions
            - [Avatar 32px] [Nama User] [Chevron 16px]
            - Administrator link if ADMIN
            =================================================== */}
        <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
          {/* Admin Console Link (ONLY FOR ADMIN ROLE) */}
          {user && user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:text-[#0068A5] bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-[#0068A5]/30 rounded-xl shadow-2xs transition-all font-sans"
            >
              <Shield className="w-[18px] h-[18px] text-[#0068A5]" />
              <span>Admin Console</span>
            </Link>
          )}

          {/* Compact User Profile: [Avatar] [Nama User] [Chevron] */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-[#E2E8F0] cursor-pointer"
                aria-label="User Profile Menu"
              >
                {/* 30-34px Circular Avatar */}
                <div className="w-[32px] h-[32px] rounded-full bg-[#0068A5] text-white flex items-center justify-center text-[12.5px] font-semibold tracking-wide shadow-xs shrink-0 select-none font-sans">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Nama User (Poppins 13-14px Medium) */}
                <span className="hidden sm:inline-block text-[13.5px] font-medium text-slate-800 tracking-normal truncate max-w-[130px] font-sans">
                  {user.name}
                </span>

                {/* Chevron 16px */}
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Compact Profile Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-54 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in-50 zoom-in-98 duration-150 font-sans">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="text-[13.5px] font-semibold text-[#172033] truncate">
                      {user.name}
                    </div>
                    <div className="text-[11.5px] text-[#64748B] truncate mt-0.5">
                      {user.email}
                    </div>
                    <div className="mt-1.5">
                      <span className="inline-block text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-[#0068A5]/10 text-[#0068A5]">
                        {roleLabel}
                      </span>
                    </div>
                  </div>

                  {user.role === 'ADMIN' && (
                    <div className="py-1 border-b border-slate-100 xl:hidden">
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[12.5px] font-medium text-slate-700 hover:text-[#0068A5] hover:bg-[#EAF5FA]"
                      >
                        <Shield className="w-4 h-4 text-[#0068A5]" />
                        <span>Admin Console</span>
                      </Link>
                    </div>
                  )}

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[12.5px] font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated Visitor: Compact Sign In Button */
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#0068A5] hover:bg-[#005487] rounded-xl shadow-xs transition-all font-sans cursor-pointer"
            >
              <LogIn className="w-[18px] h-[18px]" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* ===================================================
          MOBILE SEARCH ROW (Search on bottom row with 100% width)
          =================================================== */}
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search IT Services..."
              className="w-full h-[46px] pl-10 pr-9 text-[14px] bg-white text-[#172033] border border-[#E2E8F0] focus:border-[#0068A5]/50 focus:ring-2 focus:ring-[#0068A5]/8 rounded-xl outline-hidden shadow-2xs font-sans placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  );
}
