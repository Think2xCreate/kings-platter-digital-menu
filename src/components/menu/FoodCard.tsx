import React from 'react';
import { Check, Plus, Flame, Clock, CheckCircle2, Ban } from 'lucide-react';
import { FoodItem } from '../../types/menu';
import { FoodImage } from './FoodImage';
import { DietaryIndicator } from './DietaryIndicator';
import { formatPrice } from '../../utils/pricing';

interface FoodCardProps {
  key?: React.Key;
  item: FoodItem;
  onSelect: (item: FoodItem) => void;
  isSelected?: boolean;
  onToggleSelect?: (item: FoodItem, e: React.MouseEvent) => void;
}

export function FoodCard({
  item,
  onSelect,
  isSelected = false,
  onToggleSelect,
}: FoodCardProps) {
  const hasDiscount = item.originalPrice && item.discountPercentage && item.discountPercentage > 0;
  const isAvailable = item.isAvailable !== false;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    if (onToggleSelect) {
      onToggleSelect(item, e);
    } else {
      onSelect(item);
    }
  };

  return (
    <article
      id={`food-card-${item.id}`}
      onClick={() => onSelect(item)}
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#16161B] transition-all duration-200 cursor-pointer overflow-hidden shadow-lg active:scale-[0.99] sm:active:scale-100 hover:shadow-xl hover:shadow-black/50 ${
        isSelected
          ? 'border-2 border-[#E5A93C] ring-1 ring-[#E5A93C]/30 bg-[#1A1A22]'
          : 'border border-[#26262F] hover:border-[#E5A93C]/60'
      } ${!isAvailable ? 'opacity-65 grayscale-[35%] cursor-not-allowed' : ''}`}
    >
      <div>
        {/* 1. Food Image Container */}
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#1D1D24]">
          <FoodImage
            src={item.imageUrl}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-300 ease-out ${
              isAvailable ? 'sm:group-hover:scale-103' : ''
            }`}
          />

          {/* Gradient Overlay at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161B] via-transparent to-black/30 pointer-events-none" />

          {/* Top badges: Dietary & Discount */}
          <div className="absolute top-2 left-2 right-2 sm:top-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-white/10 flex items-center gap-1.5 shadow-sm">
              <DietaryIndicator type={item.dietary} size="sm" />
              {hasDiscount && (
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {item.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Chef's special highlight badge */}
            {item.isChefSpecial && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#E5A93C] text-black shadow-md">
                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-black" />
                <span>Special</span>
              </span>
            )}
          </div>

          {/* Unavailable banner overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/90 border border-rose-600/70 text-rose-200 font-semibold text-[11px] sm:text-xs tracking-wide">
                <Ban className="w-3.5 h-3.5 text-rose-400" />
                <span>Currently unavailable</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Availability Status Badge + Details Content */}
        <div className="p-2.5 sm:p-4">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Unavailable
              </span>
            )}

            {item.prepTimeMinutes && isAvailable && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#80808C]">
                <Clock className="w-2.5 h-2.5 text-[#A0A0AB]" />
                ~{item.prepTimeMinutes}m
              </span>
            )}
          </div>

          {/* 3. Food Name */}
          <h3 className="font-bold text-xs sm:text-base text-[#F2F2F7] leading-snug line-clamp-2 min-h-[32px] sm:min-h-0 group-hover:text-[#E5A93C] transition-colors">
            {item.name}
          </h3>

          {/* 4. Short Description */}
          <p className="hidden sm:block text-xs text-[#9E9EA8] line-clamp-2 leading-relaxed mt-1 mb-2 min-h-[32px]">
            {item.description}
          </p>
        </div>
      </div>

      {/* 5. Footer: Price / Offer & 6. Select Action */}
      <div className="p-2.5 sm:p-4 pt-1 sm:pt-0 border-t border-[#22222A] mt-auto flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          {hasDiscount && item.originalPrice && (
            <span className="text-[10px] sm:text-xs text-[#7A7A85] line-through font-medium truncate">
              {formatPrice(item.originalPrice)}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-base md:text-lg font-extrabold text-white tracking-tight truncate">
              {formatPrice(item.finalPrice)}
            </span>
          </div>
        </div>

        {/* Action Button: Normal 'Select' or Active 'Selected' */}
        {isAvailable ? (
          <button
            type="button"
            aria-label={isSelected ? `Remove ${item.name} from selection` : `Select ${item.name}`}
            onClick={handleActionClick}
            className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm ${
              isSelected
                ? 'bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-emerald-400'
                : 'bg-[#E5A93C] hover:bg-[#FBBF24] text-black sm:hover:scale-[1.02]'
            }`}
          >
            {isSelected ? (
              <span className="flex items-center gap-1.5 animate-select-pop">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden xs:inline sm:inline">Selected</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Select</span>
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="shrink-0 px-2.5 py-1 rounded-xl bg-[#22222A] text-[#70707E] text-[11px] font-semibold cursor-not-allowed border border-[#2D2D38]"
          >
            Unavailable
          </button>
        )}
      </div>
    </article>
  );
}
