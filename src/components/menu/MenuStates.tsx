import React from 'react';
import { SearchX, RefreshCw, AlertCircle, Utensils } from 'lucide-react';

// 1. SKELETON FOOD CARD
export function FoodCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#18181C] border border-[#26262D] overflow-hidden animate-pulse">
      <div className="aspect-[16/11] bg-[#222228]" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-[#25252C] rounded-md w-3/4" />
        <div className="space-y-1.5">
          <div className="h-3 bg-[#202026] rounded w-full" />
          <div className="h-3 bg-[#202026] rounded w-4/5" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#222228]">
          <div className="h-6 bg-[#25252C] rounded w-16" />
          <div className="w-8 h-8 rounded-full bg-[#25252C]" />
        </div>
      </div>
    </div>
  );
}

// 2. SKELETON FULL MENU
export function MenuLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="w-full h-56 sm:h-72 rounded-3xl bg-[#18181C] border border-[#26262D]" />

      {/* Category Pills Skeleton */}
      <div className="flex items-center gap-4 overflow-hidden py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#202026]" />
            <div className="w-12 h-3 bg-[#1C1C22] rounded" />
          </div>
        ))}
      </div>

      {/* Section Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="h-7 bg-[#202026] rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. EMPTY SEARCH STATE
interface EmptySearchProps {
  query: string;
  onReset: () => void;
}

export function EmptySearchState({ query, onReset }: EmptySearchProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-[#141418] border border-[#22222A] my-6">
      <div className="w-16 h-16 rounded-full bg-[#1F1F26] border border-[#2C2C36] flex items-center justify-center text-[#E5A93C] mb-4">
        <SearchX className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No dishes found</h3>
      <p className="text-sm text-[#9494A0] max-w-md mb-6 leading-relaxed">
        We couldn't find any dish matching "<span className="text-[#E5A93C] font-semibold">{query}</span>". Try another dish name or browse through the menu categories.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-5 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#F59E0B] text-black font-bold text-sm transition-all shadow-md active:scale-95"
      >
        Clear Search & View Full Menu
      </button>
    </div>
  );
}

// 4. ERROR STATE
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  title = "We couldn't load the menu",
  message = "Please check your connection and try again.",
  onRetry
}: ErrorStateProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-800/50 flex items-center justify-center text-rose-400 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-sm text-[#9A9AA6] max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E5A93C] hover:bg-[#F59E0B] text-black font-bold text-sm transition-all shadow-lg active:scale-95"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
