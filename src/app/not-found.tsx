'use client';

import React from 'react';
import Link from 'next/link';
import { BrandIdentity } from '@/components/common/BrandIdentity';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D10] text-[#E8E8ED] flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#F5B800]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full flex flex-col items-center">
        {/* Brand Identity */}
        <div className="mb-8">
          <BrandIdentity size="lg" />
        </div>

        {/* 404 Badge & Error Number */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5B800]/10 border border-[#F5B800]/20 text-[#F5B800] text-xs font-semibold uppercase tracking-wider mb-4">
          <span>Error 404</span>
        </div>

        <h1 className="font-royal text-4xl sm:text-5xl font-bold text-white tracking-wide mb-3">
          Page Not Found
        </h1>

        <p className="text-[#9898A0] text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
          The dish, category, or page you are looking for doesn't exist or may have been moved.
        </p>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/menu/kings-platter"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F5B800] to-[#E5A93C] text-[#0D0D10] font-bold text-sm shadow-lg shadow-[#F5B800]/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Digital Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
