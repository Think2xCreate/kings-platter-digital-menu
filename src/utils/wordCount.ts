export const MAX_BUSINESS_DESCRIPTION_WORDS = 150;
export const MAX_FOOD_DESCRIPTION_WORDS = 20;
export const MAX_CATEGORY_DESCRIPTION_WORDS = 20;

/**
 * Reusable word count utility.
 * - Trims leading and trailing whitespace
 * - Treats multiple spaces, tabs, and newlines as separators
 * - Returns 0 for empty or whitespace-only input
 */
export function countWords(text: string | null | undefined): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}
