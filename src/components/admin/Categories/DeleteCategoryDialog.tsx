import React, { useState } from 'react';
import { AlertTriangle, X, ArrowRight, Trash2 } from 'lucide-react';
import { Category, FoodItem } from '../../../types/menu';

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  foodItems: FoodItem[];
  onConfirmDelete: (categoryId: string) => Promise<void>;
  onNavigateToFoodItemsWithCategory: (categoryId: string) => void;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  category,
  foodItems,
  onConfirmDelete,
  onNavigateToFoodItemsWithCategory,
}: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !category) return null;

  // Check how many food items belong to this category
  const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];
  const associatedFoodItems = safeFoodItems.filter(item => item.categoryId === category.id);
  const hasFoodItems = associatedFoodItems.length > 0;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirmDelete(category.id);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete category.';
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-10 p-6 animate-in zoom-in-95 duration-150">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {hasFoodItems ? (
          /* Case 1: Category contains food items - BLOCK DELETION FOR SAFETY */
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Cannot delete this category
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                This category <strong>"{category.name}"</strong> contains{' '}
                <span className="text-amber-700 font-bold">{associatedFoodItems.length} food item(s)</span>.
                Move or delete those food items before deleting this category.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 max-h-32 overflow-y-auto space-y-1 text-xs text-gray-600">
              <p className="font-semibold text-gray-800 mb-1">Associated Dishes:</p>
              {associatedFoodItems.slice(0, 5).map(f => (
                <div key={f.id} className="truncate">• {f.name}</div>
              ))}
              {associatedFoodItems.length > 5 && (
                <div className="text-gray-400 text-[11px]">+ {associatedFoodItems.length - 5} more</div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFoodItemsWithCategory(category.id);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
              >
                <span>View Food Items</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Case 2: 0 food items - SAFE TO DELETE */
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Delete category?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                Are you sure you want to delete <strong>"{category.name}"</strong>? This action cannot be undone.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
