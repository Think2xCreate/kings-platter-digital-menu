import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { FoodItem, Category, DietaryType } from '../../../types/menu';
import { uploadImageToSupabase } from '../../../utils/imageUpload';

interface FoodItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FoodItem, 'id' | 'finalPrice'>) => Promise<void>;
  initialData?: FoodItem | null;
  categories: Category[];
  mode: 'create' | 'edit';
}

export function FoodItemFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  mode,
}: FoodItemFormModalProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [enableOffer, setEnableOffer] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [dietary, setDietary] = useState<DietaryType>('non-veg');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isPopular, setIsPopular] = useState(false);
  
  const [imageStorageKey, setImageStorageKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset form values
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategoryId(initialData.categoryId);
      setDescription(initialData.description || '');
      setPrice(initialData.price);
      setEnableOffer(!!initialData.discountPercentage && initialData.discountPercentage > 0);
      setDiscountPercentage(initialData.discountPercentage || 0);
      setImageUrl(initialData.imageUrl || '');
      setImageStorageKey(initialData.imageStorageKey || '');
      setIsAvailable(initialData.isAvailable);
      setDietary(initialData.dietary);
      setIsPopular(!!initialData.isPopular);
      setDisplayOrder(initialData.displayOrder || 1);
    } else {
      setName('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setDescription('');
      setPrice('');
      setEnableOffer(false);
      setDiscountPercentage(0);
      setImageUrl('');
      setImageStorageKey('');
      setIsAvailable(true);
      setDietary('non-veg');
      setIsPopular(false);
      setDisplayOrder(1);
    }
    setError(null);
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  // Calculated final price preview
  const finalPrice = enableOffer && discountPercentage > 0
    ? Math.max(0, Math.round((Number(price) || 0) * (1 - discountPercentage / 100)))
    : price;

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
      const res = await uploadImageToSupabase(file, 'food-items');
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
      setError('Food name is required.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }
    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setError('Price must be greater than 0.');
      return;
    }
    if (enableOffer && (discountPercentage <= 0 || discountPercentage > 100)) {
      setError('Discount percentage must be between 1% and 100%.');
      return;
    }

    const selectedCategory = categories.find(c => c.id === categoryId);
    const categoryName = selectedCategory ? selectedCategory.name : 'Mains';

    try {
      setIsSubmitting(true);
      setError(null);

      await onSubmit({
        name: name.trim(),
        categoryId,
        categoryName,
        description: description.trim(),
        price: Number(price),
        discountPercentage: enableOffer ? Number(discountPercentage) : 0,
        originalPrice: enableOffer ? Number(price) : undefined,
        imageUrl: imageUrl.trim(),
        imageStorageKey: imageStorageKey.trim(),
        isAvailable,
        dietary,
        isPopular,
        displayOrder: Number(displayOrder) || 1,
      });

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save food item.';
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
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'create' ? 'Add New Food Item' : 'Edit Food Item'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === 'create' 
                ? 'Create a dish and publish it to the digital menu'
                : 'Modify dish details, pricing, or availability'
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Dish Image Upload & Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Food Image *
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                {imageUrl ? (
                  <img src={imageUrl} alt="Food Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-gray-600" />
                  <span>Upload Dish Photo</span>
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

          {/* Food Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Food Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cream of Broccoli Soup"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20 text-sm text-gray-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20 text-sm text-gray-900 outline-none transition-all bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Offers Section (PRD Requirement 29) */}
          <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C88A00]" />
                Pricing & Offer
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableOffer}
                  onChange={(e) => setEnableOffer(e.target.checked)}
                  className="rounded border-gray-300 text-[#F5B800] focus:ring-[#F5B800]"
                />
                <span className="text-xs font-semibold text-gray-700">Enable Discount Offer</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-[#F5B800]"
                />
              </div>

              {enableOffer && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Discount (%) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Math.min(100, Math.max(1, parseInt(e.target.value) || 0)))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-[#F5B800]"
                  />
                </div>
              )}

              <div className="col-span-2 sm:col-span-1 flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-gray-500">Customer Price</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{finalPrice}
                  {enableOffer && (
                    <span className="text-xs text-red-600 font-semibold ml-1.5 line-through">
                      ₹{price}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Description *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fresh ingredients, flavours, marinade details..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20 text-sm text-gray-900 outline-none transition-all resize-none"
            />
          </div>

          {/* Dietary Type & Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Dietary Type
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value as DietaryType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F5B800] text-sm text-gray-900 outline-none bg-white"
              >
                <option value="veg">🟢 Pure Veg</option>
                <option value="non-veg">🔴 Non-Veg</option>
                <option value="egg">🟡 Contains Egg</option>
                <option value="vegan">🌱 Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Menu Availability
              </label>
              <div className="flex items-center h-10 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isAvailable ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={isAvailable}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-gray-700">
                  {isAvailable ? 'Available' : 'Sold Out / Unavailable'}
                </span>
              </div>
            </div>
          </div>

          {/* Display Order & Popular Checkbox */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#F5B800] text-sm text-gray-900 outline-none"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded border-gray-300 text-[#F5B800] focus:ring-[#F5B800]"
                />
                <span className="text-xs font-semibold text-gray-700">Mark as Popular Dish ⭐</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
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
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Food Item' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
