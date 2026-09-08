'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Mail, AlertCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { registerAction } from '@/lib/actions/auth-actions';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Confirm Password does not match.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await registerAction({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        });

        if (!res.success) {
          setError(res.error || 'Registration failed. Please check your information.');
          return;
        }

        router.push(res.redirectTo || '/register/pending');
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    });
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
            {/* Logo Wrapper */}
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

          {/* Middle Value Props */}
          <div className="relative z-10 my-8 sm:my-10 space-y-3.5 max-w-md">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 bg-white/80 backdrop-blur-xs border border-[#E2E8F0] p-3.5 rounded-xl shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#EAF5FA] text-[#0068A5] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Secure worker access with administrator governance.</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 bg-white/80 backdrop-blur-xs border border-[#E2E8F0] p-3.5 rounded-xl shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span>Explore full IT services, application owners, and SLA targets.</span>
            </div>
          </div>

          {/* Bottom Left Footer */}
          <div className="relative z-10 pt-4 border-t border-[#E2E8F0]/80 flex items-center justify-between text-xs text-[#64748B]">
            <span>© {new Date().getFullYear()} PT Nusantara Regas</span>
            <span className="font-medium text-slate-500">Security & Compliance Portal</span>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE: Corporate Registration Form Card
            =================================================== */}
        <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center bg-white">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight font-sans">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Register to access the NR IT Service Catalog
              </p>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="bg-rose-50/90 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5 animate-in fade-in-50 duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-white text-[#172033] border border-[#DCE5ED] focus:border-[#0068A5] focus:ring-2 focus:ring-[#0068A5]/10 rounded-xl outline-hidden transition-all duration-150 placeholder:text-slate-400 font-sans"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@nusantararegas.com"
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-white text-[#172033] border border-[#DCE5ED] focus:border-[#0068A5] focus:ring-2 focus:ring-[#0068A5]/10 rounded-xl outline-hidden transition-all duration-150 placeholder:text-slate-400 font-sans"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password (min. 6 characters)"
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

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full h-11 pl-10 pr-11 text-xs sm:text-sm bg-white text-[#172033] border border-[#DCE5ED] focus:border-[#0068A5] focus:ring-2 focus:ring-[#0068A5]/10 rounded-xl outline-hidden transition-all duration-150 placeholder:text-slate-400 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Link to Sign In */}
            <div className="pt-4 border-t border-[#E2E8F0] text-center space-y-1">
              <p className="text-xs text-slate-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[#0068A5] hover:text-[#005487] hover:underline"
                >
                  Sign In
                </Link>
              </p>
              <p className="text-[11px] font-medium text-slate-400 pt-1">
                Nusantara Regas IT Service Portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
