import React, { useEffect, useState } from 'react';

interface BrandLoaderProps {
  isLoading: boolean;
  variant?: 'customer' | 'admin';
  restaurantName?: string;
  subName?: string;
  tagline?: string;
  error?: string | null;
  onRetry?: () => void;
  onExitComplete?: () => void;
}

export function BrandLoader({
  isLoading,
  variant = 'customer',
  restaurantName = "KING'S PLATTER",
  subName = 'RESTAURANT',
  tagline = 'Great Food · Royal Experience',
  error = null,
  onRetry,
  onExitComplete,
}: BrandLoaderProps) {
  // Lifecycle stages: 'entering' -> 'active' -> 'exiting' -> 'completed'
  const [stage, setStage] = useState<'entering' | 'active' | 'exiting' | 'completed'>('entering');
  const [stepIndex, setStepIndex] = useState(0);

  // Dynamic royal culinary status messages for an immersive feel
  const customerSteps = [
    'Warming the kitchen...',
    'Preparing your meal...',
    'Almost ready...',
  ];

  const adminSteps = [
    'Verifying credentials...',
    'Loading data...',
    'Almost ready...',
  ];

  const steps = variant === 'admin' ? adminSteps : customerSteps;

  // Step cycling while loading
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1 < steps.length ? prev + 1 : prev));
    }, 750);
    return () => clearInterval(interval);
  }, [steps.length]);

  // Entrance transition to active stage
  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setStage((prev) => (prev === 'entering' ? 'active' : prev));
    }, 450);

    return () => clearTimeout(entranceTimer);
  }, []);

  // Handle readiness and trigger creative split-screen transition
  useEffect(() => {
    if (!isLoading && !error && stage !== 'exiting' && stage !== 'completed') {
      // Ensure smooth visual settling before initiating the split if just mounted
      const minDisplayDelay = stage === 'entering' ? 500 : 0;

      const splitTimer = setTimeout(() => {
        setStage('exiting');

        const exitCompleteTimer = setTimeout(() => {
          setStage('completed');
          if (onExitComplete) {
            onExitComplete();
          }
        }, 660);

        return () => clearTimeout(exitCompleteTimer);
      }, minDisplayDelay);

      return () => clearTimeout(splitTimer);
    }
  }, [isLoading, error, stage, onExitComplete]);

  // If split-screen exit has completed, remove from DOM
  if (stage === 'completed') {
    return null;
  }

  const isExiting = stage === 'exiting';
  const isAdmin = variant === 'admin';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${restaurantName} ${isAdmin ? 'Admin Portal' : 'Digital Menu'} Loading`}
      className="fixed inset-0 z-50 select-none pointer-events-none"
    >
      {/* =====================================================================
          SPLIT SCREEN PANEL: TOP HALF (Slides Upward on Exit)
          ===================================================================== */}
      <div
        className={`fixed inset-x-0 top-0 h-1/2 z-50 overflow-hidden ${isAdmin ? 'bg-[#09090D]' : 'bg-[#05110A]'
          } ${isExiting ? 'animate-split-top' : ''}`}
      >
        {/* Ambient royal green spotlight aura (top half) */}
        <div
          className={`absolute -bottom-28 left-1/2 -translate-x-1/2 w-80 sm:w-[460px] h-80 sm:h-[460px] rounded-full pointer-events-none filter blur-3xl ${isAdmin ? 'bg-[#F5B800]/12' : 'bg-emerald-600/22'
            }`}
        />
        <div
          className={`absolute -bottom-16 left-1/2 -translate-x-1/2 w-60 sm:w-80 h-60 sm:h-80 rounded-full pointer-events-none filter blur-2xl ${isAdmin ? 'bg-amber-600/10' : 'bg-[#E5A93C]/14'
            }`}
        />

        {/* Horizontal golden split hairline seam (bottom edge of top panel) */}
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E5A93C] to-transparent shadow-[0_0_10px_rgba(229,169,60,0.7)] animate-seam-glow" />
      </div>

      {/* =====================================================================
          SPLIT SCREEN PANEL: BOTTOM HALF (Slides Downward on Exit)
          ===================================================================== */}
      <div
        className={`fixed inset-x-0 bottom-0 h-1/2 z-50 overflow-hidden ${isAdmin ? 'bg-[#09090D]' : 'bg-[#05110A]'
          } ${isExiting ? 'animate-split-bottom' : ''}`}
      >
        {/* Ambient royal gold spotlight aura (bottom half) */}
        <div
          className={`absolute -top-28 left-1/2 -translate-x-1/2 w-80 sm:w-[460px] h-80 sm:h-[460px] rounded-full pointer-events-none filter blur-3xl ${isAdmin ? 'bg-[#F5B800]/10' : 'bg-emerald-700/16'
            }`}
        />
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 w-60 sm:w-80 h-60 sm:h-80 rounded-full pointer-events-none filter blur-2xl ${isAdmin ? 'bg-amber-600/12' : 'bg-[#E5A93C]/16'
            }`}
        />

        {/* Horizontal golden split hairline seam (top edge of bottom panel) */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E5A93C] to-transparent shadow-[0_0_10px_rgba(229,169,60,0.7)] animate-seam-glow" />
      </div>

      {/* =====================================================================
          CENTER BRAND CONTENT & EMBLEM (Centered on the Horizontal Split Axis)
          ===================================================================== */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none ${isExiting ? 'animate-split-center pointer-events-none' : 'pointer-events-auto'
          }`}
      >
        {/* Floating culinary golden ember sparks */}
        {!isAdmin && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-sm mx-auto">
            <span className="absolute bottom-1/2 left-1/4 w-1.5 h-1.5 rounded-full bg-[#FBBF24] filter blur-[0.5px] animate-ember-1" />
            <span className="absolute bottom-1/2 right-1/4 w-2 h-2 rounded-full bg-[#E5A93C] filter blur-[0.5px] animate-ember-2" />
            <span className="absolute bottom-[46%] left-1/2 w-1 h-1 rounded-full bg-[#FDE68A] filter blur-[0.2px] animate-ember-3" />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
          {/* Creative Royal Platter Bezel & Rotating Halo */}
          <div className="relative flex items-center justify-center">
            {/* Subtle rotating golden bezel halo */}
            <div
              className={`absolute -inset-3 rounded-full pointer-events-none opacity-45 filter blur-[1px] animate-spin-bezel ${isAdmin
                  ? 'bg-[conic-gradient(from_0deg,transparent_0deg,#F5B800_120deg,transparent_200deg,#D97706_300deg,transparent_360deg)]'
                  : 'bg-[conic-gradient(from_0deg,transparent_0deg,#E5A93C_100deg,transparent_180deg,#F59E0B_280deg,transparent_360deg)]'
                }`}
            />

            {/* Outer Royal Platter Border Rim */}
            <div
              className={`relative rounded-3xl p-1.5 sm:p-2 flex items-center justify-center transition-transform animate-brand-entrance ${isAdmin
                  ? 'w-26 h-26 sm:w-30 sm:h-30 bg-[#121217] border border-[#F5B800]/40 shadow-2xl shadow-black/80'
                  : 'w-34 h-34 sm:w-40 sm:h-40 md:w-44 md:h-44 bg-gradient-to-b from-[#0C2217] via-[#081810] to-[#040C08] border border-[#E5A93C]/45 shadow-2xl shadow-emerald-950/80'
                }`}
            >
              {/* Concentric hairline gold accent */}
              <div className="absolute inset-1.5 rounded-[22px] border border-[#E5A93C]/25 pointer-events-none" />

              {/* Logo container with overflow hidden for sheen reflection */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center p-1 bg-[#06120C]">
                <img
                  src="/kings_platter_logo.jpg"
                  alt={restaurantName}
                  className="w-full h-full object-contain rounded-xl transition-opacity duration-300"
                />

                {/* Shimmer sheen passing over the emblem */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-sheen" />
                </div>
              </div>
            </div>
          </div>

          {/* Brand Identity / Status indicator (Zero redundant wordmark if logo is shown) */}
          {isAdmin && (
            <div className="mt-4 animate-brand-entrance">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#F5B800] bg-[#1C1C26] px-3 py-1 rounded-full border border-[#2D2D3A]">
                Admin Portal
              </span>
            </div>
          )}

          {/* Creative Royal Platter Hairline Progress Bar */}
          <div className="mt-6 w-48 sm:w-56 flex flex-col items-center gap-2.5">
            <div className="w-full h-[2px] bg-[#1C2C22] rounded-full overflow-hidden relative">
              <div
                className={`h-full bg-gradient-to-r ${isAdmin
                    ? 'from-amber-500 via-[#F5B800] to-yellow-300'
                    : 'from-[#D97706] via-[#E5A93C] to-[#FDE68A]'
                  } rounded-full transition-all duration-500 ease-out`}
                style={{
                  width: isLoading ? `${Math.min(95, 35 + stepIndex * 30)}%` : '100%',
                }}
              />
            </div>

            {/* Dynamic Status / Progress or Error */}
            <div className="min-h-[28px] flex items-center justify-center">
              {error ? (
                <div className="flex flex-col items-center gap-2 animate-brand-entrance">
                  <p className="text-xs text-rose-300 max-w-xs">{error}</p>
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="px-4 py-1.5 rounded-xl bg-[#E5A93C] text-black text-xs font-bold hover:bg-[#FBBF24] transition-colors cursor-pointer"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              ) : (
                <p
                  key={stepIndex}
                  className="text-[11px] sm:text-xs text-[#8FA397] font-medium tracking-wider animate-section-reveal flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] opacity-80 animate-pulse" />
                  <span>{steps[stepIndex]}</span>
                </p>
              )}
            </div>
          </div>

          {/* Footer tagline subtle hint */}
          {!isAdmin && !error && (
            <p className="text-[10px] text-[#55695E] tracking-widest uppercase mt-2">
              {tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
