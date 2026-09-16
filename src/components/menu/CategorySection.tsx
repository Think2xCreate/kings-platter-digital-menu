import React from 'react';
import { FoodItem } from '../../types/menu';
import { FoodCard } from './FoodCard';

interface CategorySectionProps {
  key?: React.Key;
  id: string;
  title: string;
  description?: string;
  items: FoodItem[];
  onSelectItem: (item: FoodItem) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (item: FoodItem, e: React.MouseEvent) => void;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

export function CategorySection({
  id,
  title,
  description,
  items,
  onSelectItem,
  selectedIds = new Set(),
  onToggleSelect,
  onViewAll,
  showViewAll = false
}: CategorySectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      id={id}
      aria-labelledby={`heading-${id}`}
      className="mb-10 sm:mb-14 scroll-mt-24 sm:scroll-mt-28 animate-section-reveal"
    >
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6 pb-2 border-b border-[#202026]">
        <div>
          <h2
            id={`heading-${id}`}
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFFFF] flex items-center gap-2"
          >
            {title}
            <span className="text-xs font-medium text-[#7D7D8A] bg-[#1E1E24] px-2 py-0.5 rounded-full border border-[#2B2B33]">
              {items.length}
            </span>
          </h2>
          {description && (
            <p className="text-xs sm:text-sm text-[#8C8C9A] mt-1">
              {description}
            </p>
          )}
        </div>

        {showViewAll && onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs sm:text-sm font-semibold text-[#E5A93C] hover:text-[#FBBF24] transition-colors whitespace-nowrap cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {/* Grid of Food Cards (2 columns on mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
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
    </section>
  );
}
