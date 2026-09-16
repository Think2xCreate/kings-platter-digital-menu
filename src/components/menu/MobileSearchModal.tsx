import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Check, Plus } from 'lucide-react';
import { FoodItem, Category } from '../../types/menu';
import { formatPrice } from '../../utils/pricing';
import { DietaryIndicator } from './DietaryIndicator';
import { FoodImage } from './FoodImage';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodItems: FoodItem[];
  categories: Category[];
  onSelectItem: (item: FoodItem) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (item: FoodItem, e: React.MouseEvent) => void;
}

export function MobileSearchModal({
  isOpen,
  onClose,
  foodItems,
  categories,
  onSelectItem,
  selectedIds = new Set(),
  onToggleSelect,
}: MobileSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryType, setDietaryType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setSelectedCategory('all');
      setDietaryType('all');
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    const safeItems = Array.isArray(foodItems) ? foodItems : [];

    return safeItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if (dietaryType === 'veg' && item.dietary !== 'veg' && item.dietary !== 'vegan') {
        return false;
      }
      if (dietaryType === 'non-veg' && item.dietary !== 'non-veg') {
        return false;
      }

      // Search query
      if (!cleanQuery) return true;

      const nameMatch = item.name.toLowerCase().includes(cleanQuery);
      const descMatch = (item.description || '').toLowerCase().includes(cleanQuery);
      const categoryMatch = (item.categoryName || '').toLowerCase().includes(cleanQuery);

      return nameMatch || descMatch || categoryMatch;
    });
  }, [foodItems, query, selectedCategory, dietaryType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0D0D11] animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="p-4 border-b border-[#22222B] bg-[#14141A]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8C9A]" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, drinks, starters..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#1C1C24] border border-[#2B2B38] rounded-xl text-sm text-white placeholder-[#787888] focus:outline-none focus:border-[#E5A93C]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787888] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#1C1C24] border border-[#2B2B38] text-[#8E8E9B] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setDietaryType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              dietaryType === 'all'
                ? 'bg-[#E5A93C] text-black'
                : 'bg-[#1C1C24] text-[#8E8E9B] border border-[#2B2B38]'
            }`}
          >
            All Items
          </button>

          <button
            type="button"
            onClick={() => setDietaryType('veg')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              dietaryType === 'veg'
                ? 'bg-emerald-500 text-black'
                : 'bg-[#1C1C24] text-[#8E8E9B] border border-[#2B2B38]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Vegetarian
          </button>

          <button
            type="button"
            onClick={() => setDietaryType('non-veg')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              dietaryType === 'non-veg'
                ? 'bg-rose-500 text-white'
                : 'bg-[#1C1C24] text-[#8E8E9B] border border-[#2B2B38]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Non-Veg
          </button>
        </div>
      </div>

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[#1C1C24] border border-[#2B2B38] flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-[#E5A93C]/70" />
            </div>
            <h4 className="font-bold text-white text-base">No dishes found</h4>
            <p className="text-xs text-[#8E8E9B] mt-1 max-w-xs mx-auto">
              Try searching for Biriyani, Seafood, Chicken, Soup, Mojito, or Milkshake.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {filteredItems.map((item) => {
              const isSelected = selectedIds.has(item.id);
              const isAvailable = item.isAvailable !== false;

              return (
                <article
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`group relative flex flex-col justify-between rounded-2xl bg-[#16161B] border transition-all cursor-pointer overflow-hidden shadow-md ${
                    isSelected
                      ? 'border-[#E5A93C] ring-1 ring-[#E5A93C]/30'
                      : 'border-[#262630] hover:border-[#E5A93C]/60'
                  } ${!isAvailable ? 'opacity-60' : ''}`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1E1E26]">
                    <FoodImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 pointer-events-none">
                      <div className="bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
                        <DietaryIndicator type={item.dietary} size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-[#E5A93C] font-semibold uppercase tracking-wider block truncate">
                        {item.categoryName}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-white leading-snug line-clamp-2 mt-0.5">
                        {item.name}
                      </h4>
                    </div>

                    {/* Price & Select Action */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22222A]">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {formatPrice(item.finalPrice)}
                      </span>

                      {isAvailable ? (
                        <button
                          type="button"
                          aria-label={isSelected ? `Remove ${item.name}` : `Select ${item.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleSelect) onToggleSelect(item, e);
                          }}
                          className={`px-2 py-1 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-black'
                              : 'bg-[#E5A93C] hover:bg-[#FBBF24] text-black'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                              <span>Select</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-rose-400 font-medium">Sold Out</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
