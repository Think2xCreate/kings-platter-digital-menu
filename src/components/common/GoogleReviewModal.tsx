import React, { useState } from 'react';
import { X, Star, Check, Copy, CheckCircle2, MessageSquareText, AlertCircle } from 'lucide-react';
import { BusinessProfile } from '../../types/menu';

interface GoogleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  suggestedFoodName?: string;
}

export function GoogleReviewModal({ isOpen, onClose, business, suggestedFoodName }: GoogleReviewModalProps) {
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState<string>(
    suggestedFoodName
      ? `Food semma tasty ah irundhuchu! Loved the ${suggestedFoodName}. Family ah pona comfortable ah irundhuchu.`
      : 'Food semma tasty ah irundhuchu! Fresh ingredients and authentic taste. Family ah pona comfortable ah irundhuchu.'
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);

  if (!isOpen) return null;

  const reviewSuggestions = [
    suggestedFoodName
      ? `Food semma tasty ah irundhuchu! Loved the ${suggestedFoodName}. Family ah pona comfortable ah irundhuchu.`
      : 'Food semma tasty ah irundhuchu! Fresh ingredients and authentic taste. Family ah pona comfortable ah irundhuchu.',
    'Biriyani nalla flavour ah irundhuchu! Piping hot food, royal taste, and very clean dining ambience.',
    'Super tasty starters and generous portions. Ambience romba nice ah irundhuchu!',
    'One of our favourite dining spots in Tirunelveli. Quick table service and polite hospitality.',
    'Good food and great value. Starters and gravies were cooked to perfection!',
    'Wonderful atmosphere with delicious food. Definitely visiting again with friends!',
  ];

  const handleSelectSuggestion = (text: string, index: number) => {
    setSelectedSuggestionIndex(index);
    setReviewText(text);
    setCopyError(false);
  };

  const handleContinueToGoogle = async () => {
    const textToCopy = reviewText.trim();
    setCopyError(false);

    if (textToCopy) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          setIsCopied(true);
        } else {
          setCopyError(true);
        }
      } catch {
        setCopyError(true);
      }
    }

    const targetUrl = business.googleReviewUrl?.trim() || 'https://search.google.com/local/writereview?placeid=ChIJrzeECyrPBjsRK1OB2iwAL_4';
    
    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        setIsCopied(false);
        onClose();
      }, 800);
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] bg-[#121217] border border-[#282833] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 text-[#EDEDF2]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-review-modal-title"
      >
        {/* Header Banner */}
        <div className="relative p-5 sm:p-6 pb-4 border-b border-[#22222D] bg-[#16161E]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review dialog"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#20202A] text-[#9E9EAA] hover:text-white flex items-center justify-center cursor-pointer transition-colors border border-[#2F2F3D]"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#E5A93C] uppercase tracking-wider">
              King's Platter Experience
            </span>
          </div>

          <h2 id="google-review-modal-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Share Your Dining Experience
          </h2>
          <p className="text-xs text-[#9E9EA8] mt-1">
            Choose a suggestion below or personalize your review before posting to Google.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* Step 1: Select a Suggestion */}
          <div>
            <label className="text-xs font-bold text-[#A6A6B5] uppercase tracking-wider block mb-2.5">
              Choose a review suggestion:
            </label>

            <div className="space-y-2">
              {reviewSuggestions.map((suggestion, idx) => {
                const isSelected = selectedSuggestionIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion, idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[#E5A93C]/10 border-[#E5A93C] text-white shadow-sm ring-1 ring-[#E5A93C]/30'
                        : 'bg-[#181820] border-[#262632] text-[#B8B8C6] hover:border-[#383848] hover:text-white'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${
                      isSelected ? 'border-[#E5A93C] bg-[#E5A93C]' : 'border-[#444455]'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                    </span>
                    <span className="flex-1">{suggestion}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Edit Text Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="custom-review-input" className="text-xs font-bold text-[#A6A6B5] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareText className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Your review (edit if needed):</span>
              </label>
              {reviewText && (
                <span className="text-[11px] text-[#7A7A88]">
                  {reviewText.length} characters
                </span>
              )}
            </div>

            <textarea
              id="custom-review-input"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-[#16161D] border border-[#2B2B38] text-white placeholder-[#686878] focus:outline-none focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] transition-colors leading-relaxed"
            />
          </div>

          {/* Step 3: Feedback Messages */}
          <div className="p-3 rounded-xl bg-[#171720] border border-[#272733] text-xs text-[#9E9EAA] flex items-start gap-2">
            <Copy className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
            <span>
              Tapping <strong>Continue</strong> copies your review text to clipboard and opens Google Reviews.
            </span>
          </div>

          {isCopied && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Review copied to clipboard! Redirecting to Google Reviews...</span>
            </div>
          )}

          {copyError && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-600/60 text-amber-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Review couldn't be copied automatically. Please copy it manually.</span>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-[#14141B] border-t border-[#222228] flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-[#2E2E38] text-xs font-semibold text-[#8E8E9B] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!reviewText.trim()}
            onClick={handleContinueToGoogle}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              reviewText.trim()
                ? 'bg-gradient-to-r from-[#E5A93C] via-[#FBBF24] to-[#E5A93C] text-black shadow-[#E5A93C]/20 hover:brightness-110 active:scale-98 cursor-pointer'
                : 'bg-[#22222A] text-[#606070] cursor-not-allowed border border-[#2C2C38]'
            }`}
          >
            <span>Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
}

