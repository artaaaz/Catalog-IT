import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowLeft, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Registration Pending Approval | NR IT CATALOG',
  description: 'Your account registration has been submitted for administrator approval.',
};

export default function RegisterPendingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased text-[#172033] selection:bg-[#0068A5]/15">
      {/* Top 3-Color Brand Accent Line */}
      <div className="fixed top-0 left-0 right-0 h-[4px] flex shrink-0 z-50">
        <div className="w-1/3 h-full bg-[#0068A5]" />
        <div className="w-1/3 h-full bg-[#E52131]" />
        <div className="w-1/3 h-full bg-[#ABBC32]" />
      </div>

      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-md text-center space-y-6 animate-in fade-in-50 zoom-in-98 duration-200">
          {/* Company Logo */}
          <div className="flex justify-center">
            <Link href="/" className="inline-block">
              <div className="relative w-[240px] sm:w-[280px] h-[75px] flex items-center justify-center">
                <Image
                  src="/images/pertamina-nusantara-regas.png"
                  alt="Pertamina Nusantara Regas"
                  width={280}
                  height={75}
                  priority
                  className="object-contain w-auto h-full max-h-[70px]"
                />
              </div>
            </Link>
          </div>

          {/* Pending Status Badge & Icon */}
          <div className="pt-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <Clock className="w-8 h-8" />
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                PENDING APPROVAL
              </span>
            </div>
          </div>

          {/* Title and Descriptions */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight font-sans">
              Registration Submitted
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Your account has been submitted for administrator approval.
            </p>
          </div>

          {/* Information Notice Box */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-xs text-slate-700 space-y-2 text-left">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#0068A5] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Please wait for an administrator to approve your account before signing in.
              </p>
            </div>
            <div className="flex items-start gap-2.5 pt-1 border-t border-slate-200/70 text-slate-500">
              <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Once approved, you will be able to access all IT catalog systems and service details using your registered email and password.
              </p>
            </div>
          </div>

          {/* Action Button: Back to Sign In */}
          <div className="pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#0068A5] hover:bg-[#005487] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 pt-6">
          © {new Date().getFullYear()} PT Nusantara Regas — IT Service Portal
        </div>
      </div>
    </div>
  );
}
