/**
 * Central Motion System for King's Platter Web Application
 * Provides standard timing tokens, easing curves, and accessibility helpers.
 */

export const MOTION_TOKENS = {
  duration: {
    instant: 0,
    fast: 150,    // Micro-interactions (select toggles, icons, tags)
    normal: 250,  // Standard UI transitions (cards, tabs, buttons)
    slow: 400,    // Modals, drawers, section reveals
    brand: 500,   // Brand loader and key brand moments
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0.0, 0, 1)',
    enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0.0, 1, 1)',
    brand: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

/**
 * Checks if the user has requested reduced motion in their system preferences
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
