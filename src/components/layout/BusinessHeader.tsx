import React from 'react';
import { Phone, Info } from 'lucide-react';
import { BusinessProfile } from '../../types/menu';
import { CrownIcon, CartNavIcon } from '../common/MenuIcons';
import { resolveLogoUrl } from '../../utils/imageResolver';

interface BusinessHeaderProps {
  business: BusinessProfile;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenAboutModal: () => void;
  activeNavTab: 'home' | 'menu' | 'about';
  onNavTabChange: (tab: 'home' | 'menu' | 'about') => void;
  onOpenShowcaseMenu?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export function BusinessHeader({
  business,
  onOpenAboutModal,
  activeNavTab,
  onNavTabChange,
  onOpenShowcaseMenu,
  cartCount = 0,
  onOpenCart,
}: BusinessHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0D0D11]/95 backdrop-blur-md border-b border-[#222228] transition-all shadow-md shadow-black/40">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">

          {/* Brand Identity: Complete Responsive Logo Container (9:16 Aspect Ratio Preserved) */}
          <div
            className="flex items-center cursor-pointer select-none shrink-0"
            onClick={() => onNavTabChange('home')}
            role="button"
            tabIndex={0}
            aria-label={business.name || "King's Platter"}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavTabChange('home');
              }
            }}
          >
            <div className="h-11 sm:h-13 md:h-14 flex items-center justify-center py-1">
              <img
                src={resolveLogoUrl(business.logoUrl)}
                alt={business.name || "King's Platter"}
                className="h-10 sm:h-12 md:h-13 w-auto max-h-13 object-contain rounded-lg drop-shadow-sm hover:opacity-95 transition-opacity"
                loading="eager"
              />
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav aria-label="Main customer navigation" className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              type="button"
              onClick={() => onNavTabChange('home')}
              className={`transition-colors py-2 relative cursor-pointer ${activeNavTab === 'home'
                  ? 'text-white font-semibold'
                  : 'text-[#9C9CA8] hover:text-white'
                }`}
            >
              Home
              {activeNavTab === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5A93C] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onNavTabChange('menu');
                if (onOpenShowcaseMenu) onOpenShowcaseMenu();
              }}
              className={`transition-colors py-2 relative cursor-pointer ${activeNavTab === 'menu'
                  ? 'text-[#E5A93C] font-semibold'
                  : 'text-[#9C9CA8] hover:text-[#E5A93C]'
                }`}
            >
              Menu
              {activeNavTab === 'menu' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5A93C] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenAboutModal}
              className={`transition-colors py-2 relative cursor-pointer ${activeNavTab === 'about'
                  ? 'text-white font-semibold'
                  : 'text-[#9C9CA8] hover:text-white'
                }`}
            >
              About
            </button>
          </nav>

          {/* Desktop Right Info */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Selected Dishes Drawer Toggle */}
            {onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                aria-label="View selected dishes"
                className="relative p-2.5 rounded-xl bg-[#1A1A22] border border-[#2B2B38] text-[#E5A93C] hover:bg-[#E5A93C] hover:text-black transition-all cursor-pointer"
              >
                <CartNavIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E5A93C] text-black font-extrabold text-[10px] flex items-center justify-center border-2 border-black">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Mobile Right Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenAboutModal}
              aria-label="About restaurant"
              className="flex items-center gap-1 px-3 py-2 min-h-[44px] min-w-[44px] rounded-xl bg-[#18181D] border border-[#292933] text-[#E5A93C] hover:text-white transition-colors cursor-pointer text-xs font-bold shrink-0"
            >
              <Info className="w-4 h-4 text-[#E5A93C]" />
              <span>About</span>
            </button>

            {onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                aria-label="View selected dishes"
                className="relative flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-xl bg-[#18181D] border border-[#292933] text-[#E5A93C] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <CartNavIcon className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#E5A93C] text-black font-extrabold text-[9px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

