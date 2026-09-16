import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../../types/menu';
import { getMenuCategoryIcon, AllMenuIcon } from '../common/MenuIcons';

interface CategoryNavigationProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenShowcaseMenu?: () => void;
  variant?: 'sidebar' | 'horizontal';
  className?: string;
}

export { getMenuCategoryIcon };

export function CategoryNavigation({
  categories,
  activeCategoryId,
  onSelectCategory,
  onOpenShowcaseMenu,
  variant = 'horizontal',
  className = ''
}: CategoryNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to update arrows visibility or state
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, categories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  // 1. DESKTOP SIDEBAR NAVIGATION
  if (variant === 'sidebar') {
    return (
      <aside aria-label="Menu category sidebar" className={`flex flex-col space-y-1.5 ${className}`}>
        {/* All Menu Option (Updated from All Items as requested) */}
        <button
          type="button"
          onClick={() => {
            onSelectCategory('all');
            if (onOpenShowcaseMenu) {
              onOpenShowcaseMenu();
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeCategoryId === 'all'
              ? 'bg-[#E5A93C] text-black shadow-lg shadow-[#E5A93C]/20'
              : 'text-[#9E9EAA] hover:text-white hover:bg-[#1C1C22]'
          }`}
        >
          <span className="flex items-center gap-3">
            <AllMenuIcon className={`w-4 h-4 ${activeCategoryId === 'all' ? 'text-black' : 'text-[#E5A93C]'}`} />
            <span className="font-semibold tracking-wide">All Menu</span>
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
            activeCategoryId === 'all' ? 'bg-black/20 text-black' : 'bg-[#222228] text-[#8E8E9B]'
          }`}>
            Browse
          </span>
        </button>

        {/* 20 Categories List with Authentic Relatable SVGs */}
        <div className="space-y-1 pt-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E5A93C] text-black font-semibold shadow-md'
                    : 'text-[#9E9EAA] hover:text-[#FFFFFF] hover:bg-[#1C1C22]'
                }`}
              >
                <span className="flex items-center gap-3 truncate">
                  {getMenuCategoryIcon(
                    cat.slug || cat.iconName || cat.name,
                    `w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-black' : 'text-[#A0A0B0]'}`
                  )}
                  <span className="truncate">{cat.name}</span>
                </span>
                {cat.itemCount !== undefined && cat.itemCount > 0 && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ml-2 shrink-0 ${
                    isActive ? 'bg-black/20 text-black' : 'bg-[#222228] text-[#70707D]'
                  }`}>
                    {cat.itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  // 2. HORIZONTAL SCROLLABLE CATEGORY CHIPS (Mobile & Tablet with visible slide arrows)
  return (
    <div className={`relative group mb-6 select-none ${className}`}>
      {/* Mobile & Tablet Left Slide Arrow */}
      <button
        type="button"
        onClick={scrollLeft}
        aria-label="Slide menu categories left"
        className={`absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#141419]/95 border border-[#E5A93C]/40 text-[#E5A93C] flex items-center justify-center shadow-xl shadow-black/80 hover:bg-[#E5A93C] hover:text-black active:scale-95 transition-all ${
          canScrollLeft ? 'opacity-100' : 'opacity-40 pointer-events-none'
        }`}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </button>

      {/* Mobile & Tablet Right Slide Arrow */}
      <button
        type="button"
        onClick={scrollRight}
        aria-label="Slide menu categories right"
        className={`absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#141419]/95 border border-[#E5A93C]/40 text-[#E5A93C] flex items-center justify-center shadow-xl shadow-black/80 hover:bg-[#E5A93C] hover:text-black active:scale-95 transition-all ${
          canScrollRight ? 'opacity-100' : 'opacity-40 pointer-events-none'
        }`}
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </button>

      {/* Categories Row */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-6 sm:px-8 scroll-smooth"
      >
        {/* All Menu Tab */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`shrink-0 flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl transition-all cursor-pointer ${
            activeCategoryId === 'all'
              ? 'scale-105'
              : 'opacity-75 hover:opacity-100'
          }`}
        >
          <div className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all ${
            activeCategoryId === 'all'
              ? 'bg-[#E5A93C] text-black border-[#FBBF24] shadow-lg shadow-[#E5A93C]/30'
              : 'bg-[#18181F] text-[#E5A93C] border-[#2A2A33] hover:border-[#E5A93C]/40'
          }`}>
            <AllMenuIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className={`text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap ${
            activeCategoryId === 'all' ? 'text-[#E5A93C]' : 'text-[#A0A0B0]'
          }`}>
            All Menu
          </span>
        </button>

        {/* Dynamic Categories with circular food photography or icons */}
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'scale-105'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              <div className={`relative w-13 h-13 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-all ${
                isActive
                  ? 'border-[#E5A93C] shadow-lg shadow-[#E5A93C]/30 ring-2 ring-[#E5A93C]/50'
                  : 'border-[#2A2A33] hover:border-[#42424E]'
              }`}>
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-[#18181F] flex items-center justify-center text-[#E5A93C]">
                    {getMenuCategoryIcon(cat.slug || cat.iconName || cat.name, 'w-6 h-6')}
                  </div>
                )}
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-black/25 hover:bg-black/10 transition-colors" />
              </div>

              <span className={`text-[11px] sm:text-xs font-semibold tracking-tight whitespace-nowrap max-w-[78px] sm:max-w-[95px] truncate text-center ${
                isActive ? 'text-[#E5A93C] font-bold' : 'text-[#8E8E9B]'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
