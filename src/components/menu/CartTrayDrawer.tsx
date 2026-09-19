import React, { useState } from 'react';
import { X, Trash2, UtensilsCrossed, CheckCircle2, Copy, Star } from 'lucide-react';
import { FoodItem } from '../../types/menu';
import { formatPrice } from '../../utils/pricing';
import { TableOrderNavIcon, GoogleReviewBrandIcon } from '../common/MenuIcons';
import { DietaryIndicator } from './DietaryIndicator';

interface SelectedDishesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: FoodItem[];
  onRemoveItem: (foodId: string) => void;
  onClearAll: () => void;
  onOpenReview?: () => void;
}

export function CartTrayDrawer({
  isOpen,
  onClose,
  selectedItems,
  onRemoveItem,
  onClearAll,
  onOpenReview,
}: SelectedDishesDrawerProps) {
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyList = () => {
    const lines = [
      "KING'S PLATTER - SELECTED DISHES:",
      ...selectedItems.map((item, i) => `${i + 1}. ${item.name} (${formatPrice(item.finalPrice)})`),
      `Total Dishes Selected: ${selectedItems.length}`,
    ];

    navigator.clipboard?.writeText(lines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200">
      <div 
        className="w-full sm:max-w-lg max-h-[92vh] bg-[#111115] border border-[#2A2A33] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="selected-dishes-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#22222A] flex items-center justify-between bg-[#15151C]">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5A93C] to-[#B07110] flex items-center justify-center text-black shadow-md">
              <TableOrderNavIcon className="w-5 h-5" />
            </div> */}
            <div>
              <div className="flex items-center gap-2">
                <h2 id="selected-dishes-title" className="text-base sm:text-lg font-bold text-white">
                  Selected Dishes
                </h2>
                <span className="text-[10px] font-sans font-bold bg-[#E5A93C] text-black px-2 py-0.5 rounded-full">
                  {selectedItems.length}
                </span>
              </div>
              <p className="text-xs text-[#8E8E9B]">
                Shortlist of dishes you wish to order
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close selected dishes drawer"
            className="w-8 h-8 rounded-full bg-[#1C1C24] border border-[#2D2D38] text-[#A0A0B0] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dishes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh]">
          {selectedItems.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#1A1A22] border border-[#2B2B38] flex items-center justify-center text-[#707080] mb-3">
                <UtensilsCrossed className="w-7 h-7 text-[#E5A93C]/70" />
              </div>
              <h3 className="font-bold text-white text-base">No Dishes Selected Yet</h3>
              <p className="text-xs text-[#8E8E9B] mt-1.5 max-w-xs leading-relaxed">
                Tap the <strong className="text-[#E5A93C]">Select</strong> button on any dish to shortlist it. Your chosen dishes will appear here for easy viewing.
              </p>
            </div>
          ) : (
            selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#17171E] border border-[#262630] gap-3"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#2E2E3A] relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Name & dietary & price */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <DietaryIndicator type={item.dietary} size="sm" />
                    <h4 className="font-bold text-xs sm:text-sm text-white leading-snug truncate">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[#E5A93C] font-semibold mt-0.5">
                    {formatPrice(item.finalPrice)}
                  </p>
                </div>

                {/* Remove Action */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label={`Remove ${item.name} from selection`}
                  className="p-2 rounded-xl bg-[#20202A] hover:bg-rose-950/40 border border-[#2F2F3D] hover:border-rose-600/50 text-[#9E9EAA] hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {selectedItems.length > 0 && (
          <div className="p-4 bg-[#14141B] border-t border-[#22222A] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#9E9EAA]">
              <span>{selectedItems.length} {selectedItems.length === 1 ? 'dish' : 'dishes'} selected</span>
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyList}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1C1C24] hover:bg-[#252530] text-white font-semibold text-xs sm:text-sm border border-[#2D2D3A] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedNotification ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Copied List!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#E5A93C]" />
                    <span>Copy Dishes</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E5A93C] via-[#FBBF24] to-[#E5A93C] text-black font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#E5A93C]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer text-center"
              >
                Continue Browsing
              </button>
            </div>

            {onOpenReview && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReview();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#16161F] hover:bg-[#1E1E2A] border border-[#2B2B3A] text-xs font-semibold text-white flex items-center justify-between transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <GoogleReviewBrandIcon className="w-4 h-4 shrink-0" />
                  <span className="text-[#E0E0EA] group-hover:text-white transition-colors">
                    Enjoying your visit? <span className="text-[#E5A93C] font-bold">Leave a Review</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#FBBF24]">
                  <Star className="w-3.5 h-3.5 fill-[#FBBF24]" />
                  <span className="text-[11px] font-bold">5.0</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
