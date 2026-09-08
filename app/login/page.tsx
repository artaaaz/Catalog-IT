'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { loginAction } from '@/lib/actions/auth-actions';
import { useSession } from '@/lib/auth/SessionContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '';
  const { refreshUser } = useSession();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your email or username.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await loginAction({
          identifier: identifier.trim(),
          password,
          rememberMe,
        });

        if (!res.success) {
          setError(res.error || 'Authentication failed. Please check your credentials.');
          return;
        }

        await refreshUser();

        // Redirect based on role or callbackUrl
        if (callbackUrl && !callbackUrl.startsWith('/login') && !callbackUrl.startsWith('/unauthorized')) {
          if (res.user?.role === 'USER' && callbackUrl.startsWith('/admin')) {
            router.push('/');
          } else {
            router.push(callbackUrl);
          }
        } else {
          router.push(res.redirectTo || '/');
        }
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    });
  };

  const handleFillCredentials = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-[#172033] selection:bg-[#0068A5]/15">
      {/* Top 3-Color Brand Accent Line: Pertamina Blue, Red, Green */}
      <div className="w-full h-[4px] flex shrink-0">
        <div className="w-1/3 h-full bg-[#0068A5]" />
        <div className="w-1/3 h-full bg-[#E52131]" />
        <div className="w-1/3 h-full bg-[#ABBC32]" />
      </div>

      {/* Main Split Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ===================================================
            LEFT SIDE: Enterprise Corporate Branding
            =================================================== */}
        <div className="lg:w-1/2 bg-[#F4F8FA] border-b lg:border-b-0 lg:border-r border-[#E2E8F0] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Geometric Ambient Grid */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(#0068A5 1px, transparent 1px), radial-gradient(#0068A5 1px, #F4F8FA 1px)',
              backgroundSize: '32px 32px',
              backgroundPosition: '0 0, 16px 16px',
            }}
          />

          {/* Top Brand Header */}
          <div className="relative z-10">
            {/* Logo Wrapper - Optimized scale without excessive whitespace */}
            <Link href="/" className="inline-block group">
              <div className="relative w-[280px] sm:w-[340px] h-[90px] flex items-center">
                <Image
                  src="/images/pertamina-nusantara-regas.png"
                  alt="Pertamina Nusantara Regas"
                  width={340}
                  height={90}
                  priority
                  className="object-contain w-auto h-full max-h-[85px] transition-transform duration-200 group-hover:scale-[1.01]"
                />
              </div>
            </Link>

            {/* Corporate Divider Line */}
            <div className="w-16 h-[3px] bg-[#0068A5] rounded-full my-6 sm:my-8" />

            {/* Typography */}
            <div className="space-y-2.5 max-w-lg">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0068A5] block">
                Enterprise Service Directory
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#172033] tracking-tight leading-[1.15] font-sans">
                IT SERVICE CATALOG
              </h1>
              <p className="text-base sm:text-lg text-[#64748B] font-normal leading-relaxed pt-2">
                Information & Service Directory
                <br />
                <span className="font-semibold text-slate-800">PT Nusantara Regas</span>
              </p>
            </div>
          </div>

          {/* Middle Value Props / Badges */}
          <div className="relative z-10 my-8 sm:my-10 space-y-3.5 max-w-md">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 bg-white/80 backdrop-blur-xs border border-[#E2E8F0] p-3.5 rounded-xl shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#EAF5FA] text-[#0068A5] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Centralized enterprise application directory & governance.</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 bg-white/80 backdrop-blur-xs border border-[#E2E8F0] p-3.5 rounded-xl shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span>Real-time operational status, owner contacts & SLA commitments.</span>
            </div>
          </div>

          {/* Bottom Left Footer */}
          <div className="relative z-10 pt-4 border-t border-[#E2E8F0]/80 flex items-center justify-between text-xs text-[#64748B]">
            <span>© {new Date().getFullYear()} PT Nusantara Regas</span>
            <span className="font-medium text-slate-500">Security & Compliance Portal</span>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE: Corporate Sign In Form Card
            =================================================== */}
        <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center bg-white">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight font-sans">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Sign in to access the IT Service Catalog
              </p>
            </div>

            {/* Quick Fill Credentials Banner (Enterprise Demo Helper) */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0068A5]" />
                <span>Quick Fill Demo Credentials</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillCredentials('admin@nusantararegas.com', 'admin123')}
                  className="px-2.5 py-1.5 text-left text-xs bg-white hover:bg-[#EAF5FA] border border-[#E2E8F0] hover:border-[#0068A5]/40 rounded-lg transition-all group"
                >
                  <div className="font-bold text-[#0068A5] flex items-center justify-between">
                    <span>ADMIN</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#0068A5] transition-colors" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">admin@nusantararegas.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillCredentials('user@nusantararegas.com', 'user123')}
                  className="px-2.5 py-1.5 text-left text-xs bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-slate-400 rounded-lg transition-all group"
                >
                  <div className="font-bold text-slate-700 flex items-center justify-between">
                    <span>USER</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">user@nusantararegas.com</div>
                </button>
              </div>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="bg-rose-50/90 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5 animate-in fade-in-50 duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email / Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@nusantararegas.com or username"
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-white text-[#172033] border border-[#DCE5ED] focus:border-[#0068A5] focus:ring-2 focus:ring-[#0068A5]/10 rounded-xl outline-hidden transition-all duration-150 placeholder:text-slate-400 font-sans"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full h-11 pl-10 pr-11 text-xs sm:text-sm bg-white text-[#172033] border border-[#DCE5ED] focus:border-[#0068A5] focus:ring-2 focus:ring-[#0068A5]/10 rounded-xl outline-hidden transition-all duration-150 placeholder:text-slate-400 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-300 text-[#0068A5] focus:ring-[#0068A5] transition"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-[#0068A5] hover:bg-[#005487] active:bg-[#004770] disabled:bg-[#0068A5]/60 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Form Portal Note */}
            <div className="pt-4 border-t border-[#E2E8F0] text-center">
              <p className="text-[11px] font-medium text-slate-500 tracking-wide">
                Nusantara Regas IT Service Portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
