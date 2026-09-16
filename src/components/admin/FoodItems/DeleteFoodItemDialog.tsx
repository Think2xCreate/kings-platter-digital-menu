import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { FoodItem } from '../../../types/menu';

interface DeleteFoodItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  foodItem: FoodItem | null;
  onConfirmDelete: (foodItemId: string) => Promise<void>;
}

export function DeleteFoodItemDialog({
  isOpen,
  onClose,
  foodItem,
  onConfirmDelete,
}: DeleteFoodItemDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !foodItem) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirmDelete(foodItem.id);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete food item.';
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
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Delete food item?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Are you sure you want to delete <strong>"{foodItem.name}"</strong>?
              This will remove it from your digital menu and table orders. This action cannot be undone.
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
              {isDeleting ? 'Deleting...' : 'Delete Food Item'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
