import { useEffect, useRef } from 'react';
import { X, Crown, MapPin, Phone, Clock, MessageCircle, Utensils, Award, ShieldCheck } from 'lucide-react';
import { BusinessProfile } from '../../types/menu';
import { resolveLogoUrl } from '../../utils/imageResolver';

interface AboutModalProps {
  business: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ business, isOpen, onClose }: AboutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-3xl bg-[#141418] border border-[#2B2B33] p-6 sm:p-8 shadow-2xl text-[#EDEDF2] space-y-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close restaurant information"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1F26] hover:bg-[#2C2C36] text-[#A6A6B5] hover:text-white flex items-center justify-center border border-[#333340] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 flex items-center">
            <img
              src={resolveLogoUrl(business.logoUrl)}
              alt={business.name || "King's Platter"}
              className="h-11 w-auto max-h-11 object-contain rounded-xl drop-shadow-md"
            />
          </div>
          <div>
            <h2 id="about-dialog-title" className="text-sm font-semibold tracking-wide text-white">
              About Our Restaurant
            </h2>
            <p className="text-xs text-[#E5A93C] font-medium">
              {business.location}
            </p>
          </div>
        </div>

        {/* Story / About paragraph */}
        <p className="text-sm text-[#A8A8B7] leading-relaxed">
          Welcome to King's Platter Restaurant & Cafe in {business.location}. We bring you an exquisite culinary voyage blending heritage Indian dum biriyanis, fresh coastal catches, sizzling clay-oven starters, and comforting continental pastas.
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-[#1A1A20] border border-[#282833]">
            <Utensils className="w-4 h-4 text-[#E5A93C] mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-white block">Fresh Ingredients</span>
            <span className="text-[10px] text-[#7A7A88]">Sourced daily</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#1A1A20] border border-[#282833]">
            <Award className="w-4 h-4 text-[#E5A93C] mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-white block">Royal Flavours</span>
            <span className="text-[10px] text-[#7A7A88]">Chef crafted</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#1A1A20] border border-[#282833]">
            <ShieldCheck className="w-4 h-4 text-[#E5A93C] mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-white block">100% Halal</span>
            <span className="text-[10px] text-[#7A7A88]">Highest hygiene</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 pt-2 border-t border-[#22222A] text-xs text-[#A8A8B7]">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
            <span>{business.address}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#E5A93C] shrink-0" />
            <span>Open: {business.openingHours}</span>
          </div>

          {business.phone && (
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <a href={`tel:${business.phone}`} className="hover:text-white underline">
                {business.phone}
              </a>
            </div>
          )}

          {business.whatsapp && (
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href={business.whatsapp.startsWith('http') ? business.whatsapp : `https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                Contact via WhatsApp
              </a>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#E5A93C] hover:bg-[#F59E0B] text-black font-bold text-sm transition-all shadow-md active:scale-95"
        >
          Close Information
        </button>
      </div>
    </div>
  );
}
