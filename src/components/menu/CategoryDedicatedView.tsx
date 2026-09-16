import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Category, FoodItem } from '../../types/menu';
import { FoodCard } from './FoodCard';
import { getMenuCategoryIcon } from '../common/MenuIcons';
import { CategoryNavigation } from './CategoryNavigation';

interface CategoryDedicatedViewProps {
  category: Category;
  categories: Category[];
  items: FoodItem[];
  onBackToAll: () => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectItem: (item: FoodItem) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (item: FoodItem, e: React.MouseEvent) => void;
}

export function CategoryDedicatedView({
  category,
  categories,
  items,
  onBackToAll,
  onSelectCategory,
  onSelectItem,
  selectedIds = new Set(),
  onToggleSelect,
}: CategoryDedicatedViewProps) {
  return (
    <div className="animate-in fade-in duration-200">
      {/* Top Breadcrumb / Back button */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={onBackToAll}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171720] border border-[#2B2B38] text-xs sm:text-sm font-semibold text-[#E5A93C] hover:text-[#FBBF24] hover:bg-[#1E1E2A] transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Menus</span>
        </button>

        <span className="text-xs text-[#8E8E9B] font-medium bg-[#14141A] px-3 py-1.5 rounded-xl border border-[#23232C]">
          Showing <strong className="text-white">{items.length}</strong> {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Category Hero Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1A1A24] via-[#14141B] to-[#101015] border border-[#2A2A38] p-4 sm:p-6 mb-6 shadow-xl overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E5A93C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#E5A93C] to-[#B07110] flex items-center justify-center text-black shrink-0 shadow-lg shadow-[#E5A93C]/20 border border-[#F5BE58]/40">
              {getMenuCategoryIcon(category.slug || category.iconName || category.name, 'w-7 h-7 sm:w-8 sm:h-8')}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5A93C] bg-[#E5A93C]/10 px-2 py-0.5 rounded border border-[#E5A93C]/30">
                  Category Showcase
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-royal text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xs sm:text-sm text-[#A0A0B0] mt-1 max-w-xl">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Chips to switch between other categories easily */}
      <div className="mb-6">
        <CategoryNavigation
          categories={categories}
          activeCategoryId={category.id}
          onSelectCategory={onSelectCategory}
          variant="horizontal"
        />
      </div>

      {/* Items Section */}
      {items.length === 0 ? (
        <div className="py-16 text-center bg-[#141419] rounded-2xl border border-[#22222C] p-8">
          <p className="text-[#8E8E9B] text-sm">
            No items currently available in this category matching your filters.
          </p>
          <button
            type="button"
            onClick={onBackToAll}
            className="mt-4 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-bold text-xs cursor-pointer"
          >
            View All Categories
          </button>
        </div>
      ) : (
        /* Mobile 2-column grid, Desktop 3-column grid */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 mb-12">
          {items.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              isSelected={selectedIds.has(item.id)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
