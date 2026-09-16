import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../../types/menu';

import { uploadImageToSupabase } from '../../../utils/imageUpload';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Category, 'id' | 'itemCount'>) => Promise<void>;
  initialData?: Category | null;
  mode: 'create' | 'edit';
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: CategoryFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageStorageKey, setImageStorageKey] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setDisplayOrder(initialData.displayOrder || 1);
      setIsActive(initialData.isActive !== false);
      setImageUrl(initialData.imageUrl || '');
      setImageStorageKey(initialData.imageStorageKey || '');
    } else {
      setName('');
      setDescription('');
      setDisplayOrder(1);
      setIsActive(true);
      setImageUrl('');
      setImageStorageKey('');
    }
    setError(null);
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await uploadImageToSupabase(file, 'categories');
      setImageUrl(res.url);
      setImageStorageKey(res.path || '');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload image.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onSubmit({
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        iconName: 'Soup',
        description: description.trim(),
        displayOrder: Number(displayOrder) || 1,
        isActive,
        imageUrl: imageUrl.trim(),
        imageStorageKey: imageStorageKey.trim(),
      });

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save category.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'create' ? 'Add New Category' : 'Edit Category'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === 'create' 
                ? 'Create a new section for your digital menu'
                : 'Update category details and display sequence'
              }
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Category Image Upload & Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Category Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                {imageUrl ? (
                  <img src={imageUrl} alt="Category Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-gray-600" />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, or WEBP up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Appetizers, Seafood, Desserts"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the items in this category..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-none"
            />
          </div>

          {/* Display Order and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20 text-sm text-gray-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Status
              </label>
              <div className="flex items-center h-10 gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isActive ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={isActive}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-gray-700">
                  {isActive ? 'Active on Menu' : 'Hidden'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black font-bold text-sm shadow-md shadow-[#F5B800]/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Category' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
