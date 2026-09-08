import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-subtle space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#0068A5]/[0.08] text-[#0068A5] flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 font-sans">Page or Service Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested service, category, or directory page could not be located in the NR IT Catalog.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0068A5] hover:bg-[#005487] rounded-lg shadow-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Catalog Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
