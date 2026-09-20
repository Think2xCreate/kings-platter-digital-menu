import React, { useState } from 'react';
import { X, Search, ChevronRight, Star, Utensils } from 'lucide-react';
import { Category, FoodItem } from '../../types/menu';
import { getMenuCategoryIcon, CrownIcon } from '../common/MenuIcons';
import { resolveImageUrl } from '../../utils/imageResolver';

interface ShowcaseMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  foodItems: FoodItem[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function ShowcaseMenuDrawer({
  isOpen,
  onClose,
  categories,
  foodItems,
  activeCategoryId,
  onSelectCategory
}: ShowcaseMenuDrawerProps) {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredCategories = categories.filter((cat) => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q)
    );
  });

  const getCategoryCount = (categoryId: string) => {
    const safeItems = Array.isArray(foodItems) ? foodItems : [];
    return safeItems.filter((item) => item.categoryId === categoryId).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200">
      <div 
        className="w-full sm:max-w-2xl max-h-[90vh] bg-[#111115] border border-[#2A2A33] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="showcase-menu-title"
      >
        {/* Header with Royal Identity */}
        <div className="p-4 sm:p-6 pb-3 border-b border-[#22222A] flex items-center justify-between bg-gradient-to-r from-[#17171E] via-[#111115] to-[#17171E]">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5A93C] to-[#B07110] flex items-center justify-center text-black shadow-lg shadow-[#E5A93C]/20 border border-[#F5BE58]/40">
              <CrownIcon className="w-5 h-5" />
            </div> */}
            <div>
              <h2 id="showcase-menu-title" className="text-lg sm:text-xl font-bold font-royal text-white flex items-center gap-2">
                RESTAURANT MENU
                <span className="text-[10px] font-sans font-semibold bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30 px-2 py-0.5 rounded-full">
                  {categories.length} Categories
                </span>
              </h2>
              <p className="text-xs text-[#8E8E9B]">
                Taste The Royal Flavours • Explore our complete dining selection
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close restaurant menu"
            className="w-9 h-9 rounded-full bg-[#1C1C24] border border-[#2D2D38] text-[#A0A0B0] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search inside menu */}
        <div className="p-4 pb-2 border-b border-[#1E1E26] bg-[#14141A]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E7E8E]" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter menu categories (e.g. Biriyani, Seafood, Frappe)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1A1A22] border border-[#2E2E3A] text-xs sm:text-sm text-white placeholder-[#707080] focus:outline-none focus:border-[#E5A93C] transition-colors"
            />
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                onClose();
              }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5A93C] text-black text-xs font-bold hover:bg-[#FBBF24] transition-all"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Show All Dishes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('cat-seafood');
                onClose();
              }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D1D26] text-[#A0A0B0] hover:text-white text-xs font-medium border border-[#2B2B38] transition-all"
            >
              <Star className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Chef's Seafood</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('cat-biriyani');
                onClose();
              }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D1D26] text-[#A0A0B0] hover:text-white text-xs font-medium border border-[#2B2B38] transition-all"
            >
              <span>Dum Biriyani & Mandi</span>
            </button>
          </div>
        </div>

        {/* Categories Showcase Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 max-h-[60vh]">
          {filteredCategories.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isActive = activeCategoryId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E5A93C]/10 border-[#E5A93C] shadow-lg shadow-[#E5A93C]/5'
                    : 'bg-[#15151B] border-[#24242E] hover:border-[#E5A93C]/50 hover:bg-[#1A1A22]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Category Thumbnail or SVG Icon */}
                  <div className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isActive ? 'border-[#E5A93C]' : 'border-[#2C2C36]'
                  }`}>
                    {cat.imageUrl ? (
                      <img
                        src={resolveImageUrl(cat.imageUrl)}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1C1C24] flex items-center justify-center text-[#E5A93C]">
                        {getMenuCategoryIcon(cat.slug || cat.iconName || cat.name, 'w-6 h-6')}
                      </div>
                    )}
                  </div>

                  {/* Name and Description */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-sm sm:text-base leading-snug truncate group-hover:text-[#E5A93C] transition-colors ${
                        isActive ? 'text-[#E5A93C]' : 'text-white'
                      }`}>
                        {cat.name}
                      </h3>
                      {count > 0 && (
                        <span className="text-[10px] font-bold text-[#8E8E9B] bg-[#202028] px-2 py-0.5 rounded-full border border-[#2D2D38] shrink-0">
                          {count} {count === 1 ? 'dish' : 'dishes'}
                        </span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-[#828290] line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Jump arrow */}
                <div className="pl-3 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-[#E5A93C] text-black'
                      : 'bg-[#1D1D26] text-[#8E8E9B] group-hover:bg-[#E5A93C] group-hover:text-black'
                  }`}>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-[#8E8E9B]">
                No menu categories match "{filterQuery}".
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0E0E12] border-t border-[#1E1E26] text-center text-xs text-[#70707D]">
          Tap any category to jump directly to its dishes
        </div>
      </div>
    </div>
  );
}
