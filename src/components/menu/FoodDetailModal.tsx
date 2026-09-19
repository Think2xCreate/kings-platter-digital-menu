import { useEffect, useRef, useState } from 'react';
import { X, Clock, Flame, Check, Plus } from 'lucide-react';
import { FoodItem, FoodVariant } from '../../types/menu';
import { FoodImage } from './FoodImage';
import { DietaryIndicator } from './DietaryIndicator';
import { formatPrice, calculateSavings, isOfferValid, calculateFoodPricing } from '../../utils/pricing';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
  isSelected?: boolean;
  onToggleSelect?: (item: FoodItem) => void;
}

export function FoodDetailModal({ item, onClose, isSelected = false, onToggleSelect }: FoodDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedVariant, setSelectedVariant] = useState<FoodVariant | null>(null);

  // Initialize selected variant when item changes
  useEffect(() => {
    if (item && item.variants && item.variants.length > 0) {
      setSelectedVariant(item.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [item]);

  // Handle ESC key and focus trapping
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button initially
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [item, onClose]);

  if (!item) return null;

  const offerValid = isOfferValid(item);
  const pricingInfo = calculateFoodPricing(item);

  const currentPrice = selectedVariant
    ? (offerValid ? calculateFoodPricing(item).variants.find(v => v.id === selectedVariant.id)?.finalPrice || selectedVariant.price : selectedVariant.price)
    : pricingInfo.finalPrice;

  const originalPrice = selectedVariant ? selectedVariant.price : pricingInfo.originalPrice;
  const hasDiscount = offerValid && originalPrice > currentPrice;
  const savings = hasDiscount ? calculateSavings(originalPrice, currentPrice) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-detail-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#151518] border border-[#2B2B33] shadow-2xl flex flex-col text-[#EDEDF2] no-scrollbar animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close dish details"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center border border-white/10 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Compact Food Image Container (Req #5 - Height Reduction for UX) */}
        <div className="relative aspect-[21/9] sm:aspect-[16/8] max-h-52 w-full shrink-0 bg-[#1D1D24] overflow-hidden">
          <FoodImage
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover object-center"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151518] via-transparent to-black/40 pointer-events-none" />

          {/* Badges on image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between pointer-events-none">
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-2">
                <DietaryIndicator type={item.dietary} showLabel={true} size="md" />
              </div>
              <span className="bg-[#24242C]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-[#D4D4DE] border border-white/10">
                {item.categoryName}
              </span>
            </div>

            {offerValid && (
              <span className="bg-[#E5A93C] text-black px-3 py-0.5 rounded-full text-xs font-extrabold shadow-lg">
                {pricingInfo.offerLabel}
              </span>
            )}
          </div>
        </div>

        {/* Detail Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#E5A93C] mb-1.5">
              {item.isChefSpecial && (
                <span className="inline-flex items-center gap-1 font-semibold">
                  Royal Chef's Signature
                </span>
              )}
              {item.isPopular && (
                <span className="inline-flex items-center gap-1 bg-[#E5A93C]/10 text-[#E5A93C] px-2 py-0.5 rounded">
                  ★ Popular Dish
                </span>
              )}
            </div>

            <h2 id="food-detail-title" className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
              {item.name}
            </h2>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between p-4 rounded-2xl bg-[#1C1C22] border border-[#2B2B33]">
            <div>
              <span className="text-xs text-[#8A8A96] block uppercase tracking-wider font-semibold mb-0.5">
                {selectedVariant ? `Price (${selectedVariant.label})` : 'Price'}
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-[#FFFFFF] tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && originalPrice && (
                  <span className="text-sm text-[#7D7D8A] line-through font-medium">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {savings > 0 && (
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full inline-block">
                  You Save {formatPrice(savings)}
                </span>
              </div>
            )}
          </div>

          {/* Size / Portion Variants Selector */}
          {item.variants && item.variants.length > 0 && (
            <div>
              <label className="text-xs font-bold text-[#A6A6B5] uppercase tracking-wider block mb-2.5">
                Select Portion Size
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {item.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all ${
                        isSelected
                          ? 'border-[#E5A93C] bg-[#E5A93C]/10 text-white shadow-sm'
                          : 'border-[#2D2D38] bg-[#1A1A20] text-[#A6A6B5] hover:border-[#3E3E4D]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#E5A93C] bg-[#E5A93C]' : 'border-[#4D4D5C]'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                        </span>
                        {v.label}
                      </span>
                      <span className="font-bold text-white">{formatPrice(v.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-[#A6A6B5] uppercase tracking-wider mb-2">
              About This Dish
            </h3>
            <p className="text-sm sm:text-base text-[#B5B5C2] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Additional Information Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#26262E]">
            {item.prepTimeMinutes && (
              <div className="p-3 rounded-xl bg-[#1A1A20] border border-[#282832]">
                <span className="text-[11px] text-[#80808C] block mb-1">Prep Time</span>
                <span className="text-sm font-semibold text-[#E5E5ED] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#E5A93C]" />
                  ~{item.prepTimeMinutes} mins
                </span>
              </div>
            )}

            {item.spicyLevel !== undefined && (
              <div className="p-3 rounded-xl bg-[#1A1A20] border border-[#282832]">
                <span className="text-[11px] text-[#80808C] block mb-1">Spice Level</span>
                <span className="text-sm font-semibold text-[#E5E5ED] flex items-center gap-1">
                  <Flame className="w-4 h-4 text-rose-400" />
                  {item.spicyLevel === 0 ? 'Mild' : item.spicyLevel === 1 ? 'Medium' : item.spicyLevel === 2 ? 'Spicy' : 'Extra Hot'}
                </span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-[#1A1A20] border border-[#282832]">
              <span className="text-[11px] text-[#80808C] block mb-1">Status</span>
              <span className={`text-sm font-semibold flex items-center gap-1.5 ${
                item.isAvailable ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {item.isAvailable ? 'Available Now' : 'Currently Sold Out'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {item.isAvailable !== false && onToggleSelect && (
              <button
                type="button"
                onClick={() => onToggleSelect(item)}
                className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-[#E5A93C] hover:bg-[#FBBF24] text-black shadow-lg shadow-[#E5A93C]/20'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Selected for Dining</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Select This Dish</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-5 rounded-xl font-semibold text-sm bg-[#22222A] hover:bg-[#2C2C36] text-[#E5E5ED] transition-colors text-center border border-[#333340] cursor-pointer"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
