import React from 'react';

interface BrandIdentityProps {
  logoUrl?: string;
  name?: string;
  subName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'customer' | 'admin';
  onClick?: () => void;
}

/**
 * King's Platter Brand Identity Component
 * 
 * PRODUCT BRAND RULE:
 * If a complete brand logo exists, the logo is the primary identity.
 * We DO NOT duplicate the business name / wordmark text next to the logo,
 * because the King's Platter emblem already contains the brand typography.
 * If no logo is available, it falls back to elegant text styling.
 */
export function BrandIdentity({
  logoUrl = '/kings_platter_logo.jpg',
  name = "King's Platter",
  subName = 'Restaurant & Cafe',
  className = '',
  size = 'md',
  variant = 'customer',
  onClick,
}: BrandIdentityProps) {
  const hasLogo = Boolean(logoUrl);

  const sizeDimensions = {
    sm: {
      container: 'h-9 sm:h-10',
      logo: 'h-9 sm:h-10 max-h-10 w-auto',
      text: 'text-sm font-bold',
      subtext: 'text-[9px]',
    },
    md: {
      container: 'h-10 sm:h-12',
      logo: 'h-10 sm:h-12 max-h-12 w-auto',
      text: 'text-base sm:text-lg font-bold',
      subtext: 'text-[10px]',
    },
    lg: {
      container: 'h-14 sm:h-16',
      logo: 'h-14 sm:h-16 max-h-16 w-auto',
      text: 'text-xl sm:text-2xl font-bold',
      subtext: 'text-xs',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={name}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {hasLogo ? (
        /* PRIMARY IDENTITY: Complete Brand Logo Only (Zero Text Redundancy) */
        <div className={`relative flex items-center justify-center ${sizeDimensions.container}`}>
          <img
            src={logoUrl}
            alt={name}
            className={`${sizeDimensions.logo} object-contain rounded-xl drop-shadow-md transition-transform duration-200 ${
              onClick ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
            }`}
            loading="eager"
          />
        </div>
      ) : (
        /* FALLBACK: Render text identity only if no complete brand logo asset is provided */
        <div className="flex flex-col">
          <span className={`font-royal tracking-wider text-white leading-tight ${sizeDimensions.text}`}>
            {name}
          </span>
          {subName && (
            <span className={`tracking-[0.2em] uppercase font-semibold text-[#E5A93C] ${sizeDimensions.subtext}`}>
              {subName}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
