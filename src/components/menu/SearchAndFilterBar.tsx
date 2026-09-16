import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { DietaryFilter } from '../../types/menu';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dietaryFilter: DietaryFilter;
  onDietaryFilterChange: (filter: DietaryFilter) => void;
  totalResultsCount?: number;
}

export function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  dietaryFilter,
  onDietaryFilterChange,
  totalResultsCount
}: SearchAndFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
      {/* Mobile-visible Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C7C8A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search dishes, ingredients..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#16161B] border border-[#2B2B33] text-sm text-white placeholder-[#6C6C78] focus:outline-none focus:border-[#E5A93C] transition-colors shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A96] hover:text-white p-1"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dietary & Preference Quick Filters */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => onDietaryFilterChange('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
            dietaryFilter === 'all'
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-[#18181D] text-[#90909E] border-[#292933] hover:text-white'
          }`}
        >
          All Dishes
        </button>

        <button
          type="button"
          onClick={() => onDietaryFilterChange('veg')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
            dietaryFilter === 'veg'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
              : 'bg-[#18181D] text-[#90909E] border-[#292933] hover:text-emerald-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Pure Veg
        </button>

        <button
          type="button"
          onClick={() => onDietaryFilterChange('non-veg')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
            dietaryFilter === 'non-veg'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-sm'
              : 'bg-[#18181D] text-[#90909E] border-[#292933] hover:text-rose-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Non-Veg
        </button>

        <button
          type="button"
          onClick={() => onDietaryFilterChange('popular')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
            dietaryFilter === 'popular'
              ? 'bg-[#E5A93C]/20 text-[#F5BE58] border-[#E5A93C]/60 shadow-sm'
              : 'bg-[#18181D] text-[#90909E] border-[#292933] hover:text-[#F5BE58]'
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#E5A93C]" />
          Popular
        </button>
      </div>
    </div>
  );
}
