import React from 'react';
import { HomeNavIcon, MenuNavIcon, SearchNavIcon, TableOrderNavIcon, GoogleReviewNavIcon } from '../common/MenuIcons';

interface MobileBottomNavProps {
  activeTab: 'home' | 'menu' | 'search' | 'cart' | 'review';
  onTabChange: (tab: 'home' | 'menu' | 'search' | 'cart' | 'review') => void;
  cartCount?: number;
  hasReview?: boolean;
}

export function MobileBottomNav({
  activeTab,
  onTabChange,
  cartCount = 0,
  hasReview = false,
}: MobileBottomNavProps) {
  return (
    <nav 
      aria-label="Mobile bottom navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E12]/95 backdrop-blur-lg border-t border-[#23232C] px-2 py-1.5 shadow-2xl safe-area-pb"
    >
      <div className={`max-w-md mx-auto grid ${hasReview ? 'grid-cols-5' : 'grid-cols-4'} gap-1 items-center`}>
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#E5A93C]'
              : 'text-[#8E8E9B] hover:text-white'
          }`}
        >
          <div className="relative">
            <HomeNavIcon className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-semibold mt-1 tracking-tight ${
            activeTab === 'home' ? 'text-[#E5A93C] font-bold' : 'text-[#8E8E9B]'
          }`}>
            Home
          </span>
        </button>

        {/* 2. Menu (Showcase restaurant menu categories) */}
        <button
          type="button"
          onClick={() => onTabChange('menu')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'menu'
              ? 'text-[#E5A93C]'
              : 'text-[#8E8E9B] hover:text-white'
          }`}
        >
          <div className="relative">
            <MenuNavIcon className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-semibold mt-1 tracking-tight ${
            activeTab === 'menu' ? 'text-[#E5A93C] font-bold' : 'text-[#8E8E9B]'
          }`}>
            Menu
          </span>
        </button>

        {/* 3. Search (Interactive quick mobile search) */}
        <button
          type="button"
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'search'
              ? 'text-[#E5A93C]'
              : 'text-[#8E8E9B] hover:text-white'
          }`}
        >
          <div className="relative">
            <SearchNavIcon className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-semibold mt-1 tracking-tight ${
            activeTab === 'search' ? 'text-[#E5A93C] font-bold' : 'text-[#8E8E9B]'
          }`}>
            Search
          </span>
        </button>

        {/* 4. Table Order / Dine-in Selection Shortlist */}
        <button
          type="button"
          onClick={() => onTabChange('cart')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'cart'
              ? 'text-[#E5A93C]'
              : 'text-[#8E8E9B] hover:text-white'
          }`}
        >
          <div className="relative">
            <TableOrderNavIcon className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E5A93C] text-black font-extrabold text-[10px] flex items-center justify-center shadow-md animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-semibold mt-1 tracking-tight ${
            activeTab === 'cart' ? 'text-[#E5A93C] font-bold' : 'text-[#8E8E9B]'
          }`}>
            Order
          </span>
        </button>

        {/* 5. Google Review (Optional button in mobile bottom nav) */}
        {hasReview && (
          <button
            type="button"
            onClick={() => onTabChange('review')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'text-[#F59E0B]'
                : 'text-[#8E8E9B] hover:text-[#F59E0B]'
            }`}
          >
            <div className="relative">
              <GoogleReviewNavIcon className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <span className={`text-[10px] font-semibold mt-1 tracking-tight ${
              activeTab === 'review' ? 'text-[#F59E0B] font-bold' : 'text-[#8E8E9B]'
            }`}>
              Review
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
