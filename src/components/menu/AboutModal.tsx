import { useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Phone,
  Clock,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Navigation,
  ChevronRight,
  UtensilsCrossed,
  ChefHat,
  Users,
  Leaf
} from 'lucide-react';
import { BusinessProfile } from '../../types/menu';
import { resolveLogoUrl } from '../../utils/imageResolver';
import { WhatsAppBrandIcon } from '../common/MenuIcons';

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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappUrl = business.whatsapp
    ? business.whatsapp.startsWith('http')
      ? business.whatsapp
      : `https://wa.me/${business.whatsapp.replace(/\D/g, '')}`
    : business.whatsappNumber
    ? `https://wa.me/${business.whatsappNumber.replace(/\D/g, '')}`
    : '';

  const hasPhone = Boolean(business.phone && business.phone.trim());
  const hasEmail = Boolean(business.email && business.email.trim());
  const hasWhatsApp = Boolean(whatsappUrl);
  const hasInstagram = Boolean(business.instagram && business.instagram.trim());
  const hasFacebook = Boolean(business.facebook && business.facebook.trim());
  const hasWebsite = Boolean(business.website && business.website.trim());

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl rounded-3xl bg-[#FAFAF8] text-gray-900 border border-gray-200 p-5 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close information"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center border border-gray-200 transition-colors shadow-xs cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto pr-1 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Logo, Description, 4 Badges, Socials, Address */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Logo + Title Header */}
              <div className="flex items-start gap-4">
                {/* 9:16 Aspect Ratio Logo Container */}
                <div className="w-20 sm:w-24 aspect-[9/16] shrink-0 bg-black rounded-2xl p-1.5 shadow-md flex items-center justify-center overflow-hidden border border-gray-800">
                  <img
                    src={resolveLogoUrl(business.logoUrl)}
                    alt={business.name || "King's Platter"}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>

                <div className="pt-1">
                  <h2 id="about-dialog-title" className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-serif-display">
                    {business.name || "King's Platter"}
                  </h2>
                  <p className="text-sm font-semibold text-gray-600 mt-0.5">
                    {business.subName || 'Restaurant & Cafe'}
                  </p>

                  {business.description && business.description.trim() !== '' && (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-3 max-w-lg">
                      {business.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 4 Feature Badges Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FFF9EA] border border-amber-200/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-800 mb-2 shadow-xs">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">Fresh Ingredients</span>
                </div>

                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FFF9EA] border border-amber-200/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-800 mb-2 shadow-xs">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">Hygienic Kitchen</span>
                </div>

                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FFF9EA] border border-amber-200/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-800 mb-2 shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">Family Friendly</span>
                </div>

                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FFF9EA] border border-amber-200/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-800 mb-2 shadow-xs">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">Cozy Ambience</span>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-4" />

              {/* Connect & Follow Us */}
              {(hasWhatsApp || hasInstagram || hasFacebook || hasWebsite) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
                    Connect & Follow Us
                  </h3>

                  <div className="flex flex-wrap items-center gap-3">
                    {hasWhatsApp && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-gray-100 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-colors w-16 text-center"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <WhatsAppBrandIcon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-700">WhatsApp</span>
                      </a>
                    )}

                    {hasInstagram && (
                      <a
                        href={business.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-gray-100 hover:bg-pink-50 border border-gray-200 hover:border-pink-300 transition-colors w-16 text-center"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                          <Instagram className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-700">Instagram</span>
                      </a>
                    )}

                    {hasFacebook && (
                      <a
                        href={business.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-gray-100 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-colors w-16 text-center"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Facebook className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-700">Facebook</span>
                      </a>
                    )}

                    {hasWebsite && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors w-16 text-center"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gray-800 text-white flex items-center justify-center shadow-xs">
                          <Globe className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-700">Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Visit Us Section */}
              {business.address && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                    Visit Us
                  </h3>

                  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{business.address}</span>
                  </div>

                  {business.mapUrl && (
                    <a
                      href={business.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 fill-black" />
                      <span>View Location</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Interior Photo, Details Cards & Brand Quote */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Restaurant Hero / Interior Image */}
              <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative bg-gray-900">
                <img
                  src="/kings-platter-ambiance.webp"
                  alt="King's Platter Dining Experience"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Details Action List */}
              <div className="space-y-2">
                {hasPhone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF7] border border-amber-200/80 hover:bg-amber-100/50 transition-colors shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">Call Us</span>
                        <span className="text-xs text-gray-600">{business.phone}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </a>
                )}

                {hasWhatsApp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF7] border border-amber-200/80 hover:bg-amber-100/50 transition-colors shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                        <WhatsAppBrandIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">WhatsApp</span>
                        <span className="text-xs text-gray-600">Chat with us</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </a>
                )}

                {hasEmail && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF7] border border-amber-200/80 hover:bg-amber-100/50 transition-colors shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">Email</span>
                        <span className="text-xs text-gray-600">{business.email}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </a>
                )}

                {business.openingHours && (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF7] border border-amber-200/80 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">Open Hours</span>
                        <span className="text-xs text-gray-600">{business.openingHours}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Testimonial / Brand Quote Box */}
              <div className="p-4 rounded-2xl bg-[#FFF9EB] border border-amber-200/90 relative">
                <span className="text-3xl font-serif text-amber-400 absolute top-2 left-3 leading-none select-none">
                  “
                </span>
                <p className="text-xs text-gray-700 italic pl-5 pr-2 pt-1 leading-relaxed">
                  Good food brings people together. At King's Platter, we serve more than just meals — we serve happiness.
                </p>
                <div className="text-right mt-2 text-[11px] font-bold text-gray-500">
                  — The King's Platter Team
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

