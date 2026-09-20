import {
  countWords,
  MAX_BUSINESS_DESCRIPTION_WORDS,
  MAX_FOOD_DESCRIPTION_WORDS,
  MAX_CATEGORY_DESCRIPTION_WORDS,
} from '@/utils/wordCount';
import { Category, FoodItem, BusinessProfile } from '@/types/menu';

export interface AuditReport {
  invalidCategories: Array<{ id: string; name: string; wordCount: number }>;
  invalidFoodItems: Array<{ id: string; name: string; wordCount: number }>;
  invalidBusinessProfile: boolean;
  businessWordCount: number;
}

/**
 * Audits current menu data and identifies records with descriptions exceeding word limits.
 * Does NOT corrupt or truncate any data automatically.
 */
export function auditDescriptionLimits(
  categories: Category[],
  foodItems: FoodItem[],
  businessProfile: BusinessProfile | null
): AuditReport {
  const invalidCategories = categories
    .filter((cat) => countWords(cat.description) > MAX_CATEGORY_DESCRIPTION_WORDS)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      wordCount: countWords(cat.description),
    }));

  const invalidFoodItems = foodItems
    .filter((food) => countWords(food.description) > MAX_FOOD_DESCRIPTION_WORDS)
    .map((food) => ({
      id: food.id,
      name: food.name,
      wordCount: countWords(food.description),
    }));

  const businessWordCount = countWords(businessProfile?.description);
  const invalidBusinessProfile = businessWordCount > MAX_BUSINESS_DESCRIPTION_WORDS;

  return {
    invalidCategories,
    invalidFoodItems,
    invalidBusinessProfile,
    businessWordCount,
  };
}
