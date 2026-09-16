import React from 'react';
import { Phone } from 'lucide-react';
import { BusinessProfile } from '../../types/menu';
import { CrownIcon, CartNavIcon } from '../common/MenuIcons';

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
          
          {/* Brand Identity: Complete Logo As Primary Brand Anchor (Zero Redundant Text) */}
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
            {business.logoUrl || '/kings_platter_logo.jpg' ? (
              <div className="h-10 sm:h-12 flex items-center justify-center">
                <img
                  src={business.logoUrl || '/kings_platter_logo.jpg'}
                  alt={business.name || "King's Platter"}
                  className="h-9 sm:h-11 w-auto max-h-11 object-contain rounded-lg drop-shadow-sm hover:opacity-95 transition-opacity"
                  loading="eager"
                />
              </div>
            ) : (
              <span className="font-royal text-base sm:text-xl font-bold tracking-wider text-white">
                {business.name}
              </span>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          <nav aria-label="Main customer navigation" className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              type="button"
              onClick={() => onNavTabChange('home')}
              className={`transition-colors py-2 relative cursor-pointer ${
                activeNavTab === 'home'
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
              className={`transition-colors py-2 relative cursor-pointer ${
                activeNavTab === 'menu'
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
              className={`transition-colors py-2 relative cursor-pointer ${
                activeNavTab === 'about'
                  ? 'text-white font-semibold'
                  : 'text-[#9C9CA8] hover:text-white'
              }`}
            >
              About
            </button>
          </nav>

          {/* Desktop Right Info */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone */}
            <a
              href={`tel:${business.phone}`}
              className="flex items-center gap-1.5 text-xs font-medium text-[#E5E5ED] hover:text-[#E5A93C] transition-colors bg-[#1A1A20] px-3.5 py-2 rounded-full border border-[#2B2B35]"
            >
              <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>{business.phone}</span>
            </a>

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
          <div className="flex lg:hidden items-center gap-2">
            {onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                aria-label="View selected dishes"
                className="relative p-2 rounded-lg bg-[#18181D] border border-[#292933] text-[#E5A93C] hover:text-white transition-colors cursor-pointer"
              >
                <CartNavIcon className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#E5A93C] text-black font-extrabold text-[9px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <a
              href={`tel:${business.phone}`}
              aria-label="Call restaurant"
              className="p-2 rounded-lg bg-[#18181D] border border-[#292933] text-[#E5A93C] hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
