'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldAlert, ArrowLeft, LogOut, Home, Lock } from 'lucide-react';
import { useSession } from '@/lib/auth/SessionContext';

export default function UnauthorizedPage() {
  const { user, logout } = useSession();

  return (
    <div className="min-h-screen bg-[#F4F8FA] flex flex-col justify-between font-sans antialiased text-[#172033]">
      {/* Top 3-Color Brand Accent Line */}
      <div className="w-full h-[2px] flex shrink-0">
        <div className="w-1/3 h-full bg-[#0068A5]" />
        <div className="w-1/3 h-full bg-[#E52131]" />
        <div className="w-1/3 h-full bg-[#ABBC32]" />
      </div>

      {/* Main Content Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-6 sm:p-10 text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative h-16 w-56">
              <Image
                src="/images/pertamina-nusantara-regas.png"
                alt="Pertamina Nusantara Regas"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* 403 Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-[#E52131] flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#E52131] border border-rose-200">
              <Lock className="w-3.5 h-3.5" />
              <span>403 — Unauthorized Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight font-sans">
              Akses Admin Dibatasi
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md mx-auto">
              Halaman Admin Console hanya diperuntukkan bagi peran <strong className="text-slate-800">ADMIN</strong>. Akun Anda saat ini ({user?.email || 'User Biasa'}) terdaftar dengan peran <span className="font-semibold text-[#0068A5]">USER</span>.
            </p>
          </div>

          {/* User Info Capsule */}
          {user && (
            <div className="bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl p-3.5 flex items-center justify-between text-xs text-left">
              <div>
                <div className="font-semibold text-[#172033]">{user.name}</div>
                <div className="text-[#64748B]">{user.email}</div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                ROLE: {user.role}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0068A5] hover:bg-[#005487] rounded-xl shadow-xs transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Home Catalog</span>
            </Link>

            <button
              onClick={() => logout()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#172033] hover:text-[#E52131] bg-white hover:bg-rose-50 border border-[#E2E8F0] hover:border-rose-200 rounded-xl shadow-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Ganti Akun</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-[#64748B] border-t border-[#E2E8F0] bg-white">
        © {new Date().getFullYear()} PT Nusantara Regas — Enterprise IT Service Catalog
      </footer>
    </div>
  );
}
