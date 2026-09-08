'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarCategory } from './Sidebar';
import { Topbar } from './Topbar';

interface AppLayoutProps {
  categories: SidebarCategory[];
  children: React.ReactNode;
}

export function AppLayout({ categories, children }: AppLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dedicated full-screen standalone layout for Login, Register, and Unauthorized pages
  const isAuthOrErrorPage =
    pathname === '/login' ||
    pathname === '/unauthorized' ||
    pathname.startsWith('/register');

  if (isAuthOrErrorPage) {
    return <div className="min-h-screen font-sans antialiased">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] font-sans antialiased text-[#172033]">
      {/* Desktop Fixed Full-Height Sidebar (top: 0 to bottom: 0, height: 100vh, width: 340px) */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-[340px] z-40 bg-white border-r border-[#E2E8F0] shadow-[4px_0_20px_rgba(15,23,42,0.06)]">
        <Sidebar categories={categories} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative z-10 w-[320px] max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200 bg-white">
            <Sidebar
              categories={categories}
              onItemClick={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area (Offset by 340px on Desktop) */}
      <div className="md:ml-[340px] flex flex-col min-h-screen">
        {/* Topbar sticky at top of right area */}
        <Topbar
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Main Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
