'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, AlertTriangle } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F5B800]/10 border border-[#F5B800]/20 flex items-center justify-center text-[#F5B800] mb-6 shadow-lg shadow-[#F5B800]/5">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold text-[#F5B800] uppercase tracking-wider mb-2">
        Admin Portal
      </span>

      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
        Admin Page Not Found
      </h1>

      <p className="text-[#A1A1AA] text-sm sm:text-base max-w-md leading-relaxed mb-8">
        The requested admin route or resource could not be found. It may have been deleted or the URL might be invalid.
      </p>

      <Link
        href="/admin"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F5B800] to-[#E5A93C] text-[#0D0D10] font-bold text-sm shadow-lg shadow-[#F5B800]/20 hover:brightness-110 active:scale-[0.98] transition-all"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
}
