import React, { useState } from 'react';
import { X, Trash2, UtensilsCrossed, CheckCircle2, Copy, ChevronLeft, Check, Star } from 'lucide-react';
import { FoodItem } from '../../types/menu';
import { formatPrice } from '../../utils/pricing';
import { TableOrderNavIcon } from '../common/MenuIcons';
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
  const [isShowingWaiter, setIsShowingWaiter] = useState<boolean>(false);
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
        {/* ===================== VIEW 1: SHOW TO WAITER SCREEN ===================== */}
        {isShowingWaiter ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0D]">
            {/* Screen Header */}
            <div className="p-4 sm:p-5 bg-[#181822] border-b border-[#2C2C3C] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsShowingWaiter(false)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#E5A93C] hover:text-[#FBBF24] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Selection
              </button>

              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#E5A93C] font-bold block">
                  ORDER SHORTLIST
                </span>
                <h2 className="text-base font-bold text-white">
                  Selected Dishes ({selectedItems.length})
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-[#20202C] text-[#A0A0B0] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-Legibility Checklist to show server */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              <p className="text-xs text-[#9E9EAA] text-center mb-2">
                Show this list to your server to place your dining order
              </p>

              {selectedItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#171722] border border-[#2F2F40] flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-[#232332] text-[#E5A93C] font-black text-sm flex items-center justify-center shrink-0 border border-[#3A3A4E]">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <DietaryIndicator type={item.dietary} size="sm" />
                        <h3 className="font-bold text-base sm:text-lg text-white leading-tight truncate">
                          {item.name}
                        </h3>
                      </div>
                      <span className="text-xs text-[#9E9EAA]">
                        {item.categoryName}
                      </span>
                    </div>
                  </div>

                  <span className="font-bold text-sm text-[#E5A93C] shrink-0">
                    {formatPrice(item.finalPrice)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#14141C] border-t border-[#242432] flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyList}
                className="flex-1 py-3 px-4 rounded-xl bg-[#22222E] hover:bg-[#2B2B3A] text-white font-semibold text-xs sm:text-sm border border-[#363648] flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                onClick={() => setIsShowingWaiter(false)}
                className="py-3 px-5 rounded-xl bg-[#E5A93C] hover:bg-[#FBBF24] text-black font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ===================== VIEW 2: STANDARD SELECTED DISHES LIST ===================== */
          <>
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#22222A] flex items-center justify-between bg-[#15151C]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5A93C] to-[#B07110] flex items-center justify-center text-black shadow-md">
                  <TableOrderNavIcon className="w-5 h-5" />
                </div>
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
                    Tap the <strong className="text-[#E5A93C]">Select</strong> button on any dish to shortlist it. Your chosen dishes will appear here for easy viewing when the server visits your table.
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

                    {/* Name & price */}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-white leading-snug truncate">
                        {item.name}
                      </h4>
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

            {/* Footer */}
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
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl border border-[#2E2E38] text-xs font-semibold text-[#8E8E9B] hover:text-white hover:border-[#444455] transition-colors cursor-pointer text-center"
                  >
                    Continue Browsing
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsShowingWaiter(true)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E5A93C] via-[#FBBF24] to-[#E5A93C] text-black font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#E5A93C]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <TableOrderNavIcon className="w-4 h-4" />
                    <span>Show Server</span>
                  </button>
                </div>

                {onOpenReview && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenReview();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#1B1B24] hover:bg-[#22222E] border border-[#2C2C3A] text-xs text-[#E5A93C] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>Enjoying your visit? Leave a Google Review</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
