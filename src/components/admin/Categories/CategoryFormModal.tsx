import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { Category, PricingType } from '../../../types/menu';
import { uploadImageToSupabase, deleteImageFromSupabase } from '../../../utils/imageUpload';
import { resolveImageUrl } from '../../../utils/imageResolver';
import { countWords, MAX_CATEGORY_DESCRIPTION_WORDS } from '../../../utils/wordCount';

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
  const [defaultPricingType, setDefaultPricingType] = useState<PricingType>('SINGLE_PRICE');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  
  // Image Upload States
  const [imageUrl, setImageUrl] = useState('');
  const [imageStorageKey, setImageStorageKey] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setDefaultPricingType(initialData.defaultPricingType || 'SINGLE_PRICE');
      setDisplayOrder(initialData.displayOrder || 1);
      setIsActive(initialData.isActive !== false);
      setImageUrl(initialData.imageUrl || '');
      setImageStorageKey(initialData.imageStorageKey || '');
    } else {
      setName('');
      setDescription('');
      setDefaultPricingType('SINGLE_PRICE');
      setDisplayOrder(1);
      setIsActive(true);
      setImageUrl('');
      setImageStorageKey('');
    }

    setPendingFile(null);
    if (pendingPreview) {
      URL.revokeObjectURL(pendingPreview);
      setPendingPreview(null);
    }
    setUploadStatus('idle');
    setError(null);
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (pendingPreview) {
      URL.revokeObjectURL(pendingPreview);
    }
    const localUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = localUrl;
    setPendingPreview(localUrl);
    setPendingFile(file);
    setUploadStatus('idle');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    if (countWords(description) > MAX_CATEGORY_DESCRIPTION_WORDS) {
      setError(`Category description must be ${MAX_CATEGORY_DESCRIPTION_WORDS} words or fewer.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let finalImageUrl = imageUrl;
      let finalStorageKey = imageStorageKey;
      const oldStorageKey = initialData?.imageStorageKey;

      if (pendingFile) {
        setUploadStatus('uploading');
        try {
          const res = await uploadImageToSupabase(pendingFile, 'categories');
          finalImageUrl = res.url;
          finalStorageKey = res.path;
          setUploadStatus('success');
        } catch (uploadErr: unknown) {
          const msg = uploadErr instanceof Error ? uploadErr.message : 'Category image upload failed.';
          setUploadStatus('error');
          setError(`Upload Error: ${msg}`);
          setIsSubmitting(false);
          return;
        }
      }

      await onSubmit({
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        iconName: 'Soup',
        description: description.trim(),
        defaultPricingType,
        displayOrder: Number(displayOrder) || 1,
        isActive,
        imageUrl: finalImageUrl.trim(),
        imageStorageKey: finalStorageKey.trim(),
      });

      if (pendingFile && oldStorageKey && oldStorageKey !== finalStorageKey) {
        deleteImageFromSupabase(oldStorageKey).catch(() => {});
      }

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save category.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewDisplayUrl = pendingPreview || resolveImageUrl(imageUrl);

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
                ? 'Create a new category for your digital menu'
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
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Category Image Upload & Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Category Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                {previewDisplayUrl ? (
                  <img src={previewDisplayUrl} alt="Category Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}

                {uploadStatus === 'uploading' && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  </div>
                )}
                {uploadStatus === 'success' && (
                  <div className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>{pendingFile ? 'Change Photo' : 'Choose Category Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-gray-400 mt-1">WEBP, PNG, JPG up to 5MB</p>
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
              placeholder="e.g. Biriyani and Mandi, Seafood, Desserts"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
            />
          </div>

          {/* Default Pricing Format for Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Default Category Pricing Mode
            </label>
            <select
              value={defaultPricingType}
              onChange={(e) => setDefaultPricingType(e.target.value as PricingType)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none bg-white font-medium"
            >
              <option value="SINGLE_PRICE">Single Price (Standard)</option>
              <option value="VEG_NON_VEG">Veg / Non-Veg Options</option>
              <option value="CUSTOM_VARIANTS">Portions & Custom Variants (Half, Full, Mandi)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Description
              </label>
              <span className={`text-[11px] font-semibold ${countWords(description) > MAX_CATEGORY_DESCRIPTION_WORDS ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                {countWords(description)} / {MAX_CATEGORY_DESCRIPTION_WORDS} words
              </span>
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the items in this category..."
              className={`w-full px-4 py-2 rounded-xl border ${
                countWords(description) > MAX_CATEGORY_DESCRIPTION_WORDS
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30'
                  : 'border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
              } text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-none`}
            />
            {countWords(description) > MAX_CATEGORY_DESCRIPTION_WORDS && (
              <p className="text-[11px] font-bold text-red-600 mt-1">
                Please shorten this description to {MAX_CATEGORY_DESCRIPTION_WORDS} words or fewer.
              </p>
            )}
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
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 text-sm text-gray-900 outline-none transition-all"
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
              disabled={isSubmitting || countWords(description) > MAX_CATEGORY_DESCRIPTION_WORDS}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-black" />}
              <span>{isSubmitting ? 'Saving Category...' : mode === 'create' ? 'Create Category' : 'Save Changes'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

