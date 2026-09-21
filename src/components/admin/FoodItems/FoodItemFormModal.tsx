import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Video as VideoIcon, Loader2, Plus, Trash2, CheckCircle2, Play } from 'lucide-react';
import { FoodItem, Category, DietaryType, PricingType, FoodVariant } from '../../../types/menu';
import { uploadImageToSupabase, deleteImageFromSupabase } from '../../../utils/imageUpload';
import { resolveImageUrl, extractYouTubeId, normalizeYouTubeVideoUrl, getYouTubeThumbnail } from '../../../utils/imageResolver';
import { countWords, MAX_FOOD_DESCRIPTION_WORDS } from '../../../utils/wordCount';

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
  
  // Pricing Mode & Fields
  const [pricingType, setPricingType] = useState<PricingType | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [vegPrice, setVegPrice] = useState<number | ''>('');
  const [nonVegPrice, setNonVegPrice] = useState<number | ''>('');
  const [customVariants, setCustomVariants] = useState<FoodVariant[]>([]);

  // Offers
  const [enableOffer, setEnableOffer] = useState(false);
  const [offerType, setOfferType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [offerValue, setOfferValue] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  
  // Additional Attributes
  const [isAvailable, setIsAvailable] = useState(true);
  const [dietary, setDietary] = useState<DietaryType | ''>('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isPopular, setIsPopular] = useState(false);
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | ''>('');
  const [spicyLevel, setSpicyLevel] = useState<0 | 1 | 2 | 3 | ''>('');
  
  // Image Upload State
  const [imageUrl, setImageUrl] = useState('');
  const [imageStorageKey, setImageStorageKey] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);

  // YouTube Video URL State
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [youtubeUrlError, setYoutubeUrlError] = useState<string | null>(null);

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

  // Initialize form when opening or changing category
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setName(initialData.name || '');
      setCategoryId(initialData.categoryId || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price || '');
      setVegPrice(initialData.vegPrice || '');
      setNonVegPrice(initialData.nonVegPrice || '');
      setPricingType(initialData.pricingType || (initialData.variants && initialData.variants.length > 0 ? 'CUSTOM_VARIANTS' : 'SINGLE_PRICE'));
      setCustomVariants(initialData.variants ? [...initialData.variants] : []);
      const hasOffer = initialData.offerEnabled !== false && (initialData.offerEnabled || (!!initialData.discountPercentage && initialData.discountPercentage > 0) || (!!initialData.offerValue && initialData.offerValue > 0));
      setEnableOffer(hasOffer);
      setOfferType(initialData.offerType || 'PERCENTAGE');
      const val = initialData.offerValue !== undefined && initialData.offerValue !== null ? initialData.offerValue : initialData.discountPercentage || 0;
      setOfferValue(val);
      setDiscountPercentage(initialData.discountPercentage || val || 0);
      setImageUrl(initialData.imageUrl || '');
      setImageStorageKey(initialData.imageStorageKey || '');
      
      const existingYt = initialData.youtubeVideoUrl || (initialData.youtubeVideoId ? `https://www.youtube.com/watch?v=${initialData.youtubeVideoId}` : initialData.videoUrl || '');
      setYoutubeVideoUrl(existingYt);

      setIsAvailable(initialData.isAvailable !== false);
      setDietary(initialData.dietary || '');
      setIsPopular(!!initialData.isPopular);
      setIsChefSpecial(!!initialData.isChefSpecial);
      setDisplayOrder(initialData.displayOrder || 1);
      setPrepTimeMinutes(initialData.prepTimeMinutes || '');
      setSpicyLevel(initialData.spicyLevel !== undefined && initialData.spicyLevel !== null ? initialData.spicyLevel : '');
    } else {
      // CREATE MODE: Neutral state for explicit user choices
      setName('');
      setCategoryId('');
      setPricingType('');
      setDescription('');
      setPrice('');
      setVegPrice('');
      setNonVegPrice('');
      setCustomVariants([]);
      setEnableOffer(false);
      setOfferType('PERCENTAGE');
      setOfferValue(0);
      setDiscountPercentage(0);
      setImageUrl('');
      setImageStorageKey('');
      setYoutubeVideoUrl('');
      setIsAvailable(true);
      setDietary('');
      setIsPopular(false);
      setIsChefSpecial(false);
      setDisplayOrder(1);
      setPrepTimeMinutes('');
      setSpicyLevel('');
    }

    setPendingFile(null);
    if (pendingPreview) {
      URL.revokeObjectURL(pendingPreview);
      setPendingPreview(null);
    }
    setUploadStatus('idle');
    setUploadErrorMessage(null);
    setYoutubeUrlError(null);
    setError(null);
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  // Compute category default pricing when category changes manually
  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.defaultPricingType && !initialData) {
      setPricingType(cat.defaultPricingType);
    }
  };

  // Local image file selection (Deferred Upload until Save or Immediate Upload with real state)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setUploadErrorMessage('Please select a valid image file (JPG, PNG, WEBP).');
      setUploadStatus('error');
      return;
    }

    // Create local object URL for preview
    if (pendingPreview) {
      URL.revokeObjectURL(pendingPreview);
    }
    const localUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = localUrl;
    setPendingPreview(localUrl);
    setPendingFile(file);
    setUploadStatus('idle');
    setUploadErrorMessage(null);
  };

  const handleAddCustomVariant = () => {
    setCustomVariants((prev) => [
      ...prev,
      { id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`, label: '', price: 0 },
    ]);
  };

  const handleRemoveCustomVariant = (id: string) => {
    setCustomVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateCustomVariant = (id: string, field: 'label' | 'price', value: string | number) => {
    setCustomVariants((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            [field]: field === 'price' ? Math.max(0, Number(value) || 0) : String(value),
          };
        }
        return v;
      })
    );
  };

  // Compute calculated customer price preview
  const primaryBasePrice =
    pricingType === 'VEG_NON_VEG'
      ? Number(vegPrice) || Number(nonVegPrice) || Number(price) || 0
      : pricingType === 'CUSTOM_VARIANTS' && customVariants.length > 0
      ? customVariants[0].price
      : Number(price) || 0;

  const finalCustomerPrice =
    enableOffer && discountPercentage > 0
      ? Math.max(0, Math.round(primaryBasePrice * (1 - discountPercentage / 100)))
      : primaryBasePrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Food item name is required.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }
    if (!dietary) {
      setError('Please select a dietary type.');
      return;
    }
    const currentWordCount = countWords(description);
    if (currentWordCount > MAX_FOOD_DESCRIPTION_WORDS) {
      setError(`Food description must be ${MAX_FOOD_DESCRIPTION_WORDS} words or fewer.`);
      return;
    }
    if (!pricingType) {
      setError('Please select a pricing type.');
      return;
    }

    // Pricing validation based on mode
    if (pricingType === 'SINGLE_PRICE' && (!primaryBasePrice || primaryBasePrice <= 0)) {
      setError('Please enter a valid base price greater than ₹0.');
      return;
    }
    if (pricingType === 'VEG_NON_VEG' && (!vegPrice || Number(vegPrice) <= 0) && (!nonVegPrice || Number(nonVegPrice) <= 0)) {
      setError('Please enter at least one valid price for Veg or Non-Veg.');
      return;
    }
    if (pricingType === 'CUSTOM_VARIANTS' && customVariants.length === 0) {
      setError('Please add at least one portion/variant (e.g., Half, Full).');
      return;
    }

    // YouTube Video URL Validation
    let normalizedYtUrl: string | undefined = undefined;
    let extractedYtId: string | undefined = undefined;
    setYoutubeUrlError(null);

    if (youtubeVideoUrl.trim()) {
      const result = normalizeYouTubeVideoUrl(youtubeVideoUrl.trim());
      if (!result.isValid || !result.videoId || !result.normalizedUrl) {
        const errMsg = result.error || 'Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...).';
        setYoutubeUrlError(errMsg);
        setError(errMsg);
        return;
      }
      normalizedYtUrl = result.normalizedUrl;
      extractedYtId = result.videoId;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const categoryName = selectedCategory ? selectedCategory.name : 'Mains';

    try {
      setIsSubmitting(true);
      setError(null);

      let finalImageUrl = imageUrl;
      let finalStorageKey = imageStorageKey;

      const oldStorageKey = initialData?.imageStorageKey;

      // 1. Upload new image file if selected
      if (pendingFile) {
        setUploadStatus('uploading');
        try {
          const uploadRes = await uploadImageToSupabase(pendingFile, 'food-items');
          finalImageUrl = uploadRes.url;
          finalStorageKey = uploadRes.path;
          setUploadStatus('success');
        } catch (uploadErr: unknown) {
          const msg = uploadErr instanceof Error ? uploadErr.message : 'Image upload failed.';
          setUploadStatus('error');
          setUploadErrorMessage(msg);
          setError(`Image Upload Error: ${msg}`);
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Submit data to Firestore
      await onSubmit({
        name: name.trim(),
        categoryId,
        categoryName,
        description: description.trim(),
        price: primaryBasePrice,
        pricingType: pricingType as PricingType,
        vegPrice: pricingType === 'VEG_NON_VEG' ? Number(vegPrice) || undefined : undefined,
        nonVegPrice: pricingType === 'VEG_NON_VEG' ? Number(nonVegPrice) || undefined : undefined,
        variants: (pricingType === 'CUSTOM_VARIANTS' || pricingType === 'PORTION') && customVariants.length > 0 ? customVariants : undefined,
        discountPercentage: enableOffer ? discountPercentage : 0,
        offerType: enableOffer ? offerType : undefined,
        imageUrl: finalImageUrl.trim(),
        imageStorageKey: finalStorageKey.trim(),
        youtubeVideoUrl: normalizedYtUrl,
        youtubeVideoId: extractedYtId,
        isAvailable,
        dietary,
        isPopular,
        isChefSpecial,
        displayOrder: Number(displayOrder) || 1,
        prepTimeMinutes: prepTimeMinutes !== '' ? Number(prepTimeMinutes) : undefined,
        spicyLevel: spicyLevel !== '' ? (Number(spicyLevel) as 0 | 1 | 2 | 3) : undefined,
      });

      // 3. Delete old image object after successful Firestore update if changed
      if (pendingFile && oldStorageKey && oldStorageKey !== finalStorageKey) {
        deleteImageFromSupabase(oldStorageKey).catch(() => {});
      }

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save food item.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewDisplayUrl = pendingPreview || resolveImageUrl(imageUrl);
  const currentYtId = extractYouTubeId(youtubeVideoUrl);
  const ytThumbnail = currentYtId ? getYouTubeThumbnail(currentYtId, 'hq') : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card - Compact & Laptop Responsive */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              {mode === 'create' ? 'Add New Food Item' : 'Edit Food Item'}
              <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                {mode === 'create' ? 'New Menu Item' : `ID: ${initialData?.id || ''}`}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Fill in dish details and pricing options for digital menu ordering
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/80 cursor-pointer transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Top Section: Compact Image & Core Details side-by-side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Constrained Compact Image & YouTube Video input */}
            <div className="md:col-span-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col items-center space-y-4">
              
              {/* Food Image */}
              <div className="w-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 text-left">
                  Food Photo Preview
                </label>

                <div className="relative w-full aspect-[4/3] rounded-xl bg-gray-200 border border-gray-300 overflow-hidden shadow-inner flex items-center justify-center group mb-2">
                  {previewDisplayUrl ? (
                    <img src={previewDisplayUrl} alt="Dish Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-3">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <span className="text-[11px] text-gray-500 font-medium">No image selected</span>
                    </div>
                  )}

                  {/* Upload Status Overlay */}
                  {uploadStatus === 'uploading' && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-semibold p-2 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400 mb-1" />
                      <span>Uploading image...</span>
                    </div>
                  )}
                  {uploadStatus === 'success' && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <label className="w-full py-2 px-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-xs font-bold text-gray-800 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>{pendingFile ? 'Change Selected Photo' : 'Select Food Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>

                {uploadErrorMessage && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1 text-center">
                    {uploadErrorMessage}
                  </p>
                )}
              </div>

              {/* YouTube Video Section (Concept 01 Cinematic Food Hero) */}
              <div className="w-full pt-3 border-t border-gray-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 text-left flex items-center justify-between">
                  <span>Video</span>
                </label>

                {/* YouTube Video URL Text Field */}
                <div className="mb-2">
                  <div className="relative">
                    <input
                      type="url"
                      value={youtubeVideoUrl}
                      onChange={(e) => {
                        setYoutubeVideoUrl(e.target.value);
                        setYoutubeUrlError(null);
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className={`w-full px-3 py-1.5 rounded-xl border ${
                        youtubeUrlError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-amber-500'
                      } text-xs font-medium text-gray-900 outline-none focus:ring-1 pr-14`}
                    />
                    {youtubeVideoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setYoutubeVideoUrl('');
                          setYoutubeUrlError(null);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Paste YouTube URL. The video will play in customer modal.
                  </p>
                  {youtubeUrlError && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">
                      {youtubeUrlError}
                    </p>
                  )}
                </div>

                {/* Live YouTube Thumbnail & Video Preview */}
                <div className="relative w-full aspect-[16/10] rounded-xl bg-gray-900 border border-gray-300 overflow-hidden shadow-inner flex items-center justify-center group">
                  {ytThumbnail ? (
                    <>
                      <img src={ytThumbnail} alt="YouTube Hero Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                        ID: {currentYtId}
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-3 text-gray-400">
                      <VideoIcon className="w-7 h-7 mx-auto mb-1 text-gray-500" />
                      <span className="text-[11px] text-gray-400 font-medium block">No YouTube video linked</span>
                      <span className="text-[9px] text-gray-500 block">Paste YouTube URL above</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Name, Category, Description, Dietary */}
            <div className="md:col-span-8 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Food Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kongu Mutton Biriyani"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs sm:text-sm text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs sm:text-sm text-gray-900 outline-none bg-white font-medium"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Description *
                  </label>
                  <span className={`text-[11px] font-semibold ${countWords(description) > MAX_FOOD_DESCRIPTION_WORDS ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                    {countWords(description)} / {MAX_FOOD_DESCRIPTION_WORDS} words
                  </span>
                </div>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rich spices, slow cooked tender meat, authentic recipe..."
                  className={`w-full px-3.5 py-2 rounded-xl border ${
                    countWords(description) > MAX_FOOD_DESCRIPTION_WORDS
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30'
                      : 'border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                  } text-xs sm:text-sm text-gray-900 outline-none resize-none`}
                />
                {countWords(description) > MAX_FOOD_DESCRIPTION_WORDS && (
                  <p className="text-[11px] font-bold text-red-600 mt-1">
                    Please shorten this description to {MAX_FOOD_DESCRIPTION_WORDS} words or fewer.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Dietary Type *
                  </label>
                  <select
                    value={dietary}
                    required
                    onChange={(e) => setDietary(e.target.value as DietaryType)}
                    className={`w-full px-3 py-1.5 rounded-xl border text-xs outline-none bg-white font-medium ${
                      !dietary ? 'border-amber-400 text-gray-500' : 'border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="" disabled>Select dietary type</option>
                    <option value="veg">🟢 Vegetarian</option>
                    <option value="non-veg">🔴 Non-Vegetarian</option>
                    <option value="egg">🟡 Egg</option>
                    <option value="vegan">🌱 Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(e.target.value ? Math.max(0, parseInt(e.target.value) || 0) : '')}
                    placeholder="e.g. 20"
                    className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Spice Level
                  </label>
                  <select
                    value={spicyLevel}
                    onChange={(e) => setSpicyLevel(e.target.value === '' ? '' : (parseInt(e.target.value) as 0 | 1 | 2 | 3))}
                    className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none bg-white font-medium"
                  >
                    <option value="">Not specified</option>
                    <option value="0">Mild</option>
                    <option value="1">Medium</option>
                    <option value="2">Spicy</option>
                    <option value="3">Extra Hot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center h-9 gap-2.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isAvailable ? 'bg-emerald-500' : 'bg-gray-300'
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
                    <span className="text-xs font-bold text-gray-700">
                      {isAvailable ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Pricing Section (Req #10 - PDF Menu Alignment) */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900 block">
                  Pricing Mode & Options
                </span>
                <span className="text-[11px] text-gray-500">
                  Select pricing format based on dish menu category
                </span>
              </div>

              {/* Pricing Mode Selector */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setPricingType('SINGLE_PRICE')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    pricingType === 'SINGLE_PRICE'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Single Price
                </button>
                <button
                  type="button"
                  onClick={() => setPricingType('VEG_NON_VEG')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    pricingType === 'VEG_NON_VEG'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Veg / Non-Veg
                </button>
                <button
                  type="button"
                  onClick={() => setPricingType('CUSTOM_VARIANTS')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    pricingType === 'CUSTOM_VARIANTS' || pricingType === 'PORTION'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Portions / Variants
                </button>
              </div>
            </div>

            {/* Render Pricing Fields dynamically */}
            {pricingType === 'SINGLE_PRICE' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="295"
                    className="w-full px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-900 outline-none"
                  />
                </div>
              </div>
            )}

            {pricingType === 'VEG_NON_VEG' && (
              <div className="space-y-3">
                <p className="text-[11px] text-gray-600 font-medium">
                  Enter prices for Veg and Non-Veg variants (e.g. Classic Hakka Noodle ₹215 / ₹265)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-700 mb-1">
                      🟢 Veg Price (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={vegPrice}
                      onChange={(e) => setVegPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="215"
                      className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 bg-white text-xs sm:text-sm font-semibold text-gray-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-rose-700 mb-1">
                      🔴 Non-Veg Price (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={nonVegPrice}
                      onChange={(e) => setNonVegPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="265"
                      className="w-full px-3 py-1.5 rounded-xl border border-rose-300 bg-white text-xs sm:text-sm font-semibold text-gray-900 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {(pricingType === 'CUSTOM_VARIANTS' || pricingType === 'PORTION') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Portion Sizes & Prices (e.g. Half ₹395 / Full ₹745, or 4 Persons / 6 Persons)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCustomVariant}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Portion</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {customVariants.map((v, idx) => (
                    <div key={v.id || idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-300">
                      <input
                        type="text"
                        placeholder="e.g. Half / Full / 4 Persons"
                        value={v.label}
                        onChange={(e) => handleUpdateCustomVariant(v.id, 'label', e.target.value)}
                        className="flex-1 px-3 py-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-900 outline-none"
                      />
                      <span className="text-xs font-bold text-gray-500">₹</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={v.price || ''}
                        onChange={(e) => handleUpdateCustomVariant(v.id, 'price', e.target.value)}
                        className="w-28 px-3 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomVariant(v.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        aria-label="Remove portion option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {customVariants.length === 0 && (
                    <p className="text-xs text-gray-500 italic py-1">
                      No portions added yet. Click "Add Portion" above.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Offer Controls for All Pricing Types */}
            {pricingType !== '' && (
              <div className="pt-3 border-t border-amber-200/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableOffer}
                      onChange={(e) => setEnableOffer(e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span className="text-xs font-extrabold text-gray-900">Enable Special Offer / Discount</span>
                  </label>

                  {enableOffer && (
                    <div className="flex items-center gap-2">
                      <select
                        value={offerType}
                        onChange={(e) => setOfferType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                        className="px-2.5 py-1 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-800 outline-none"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Discount (₹)</option>
                      </select>

                      <input
                        type="number"
                        min={1}
                        max={offerType === 'PERCENTAGE' ? 100 : undefined}
                        value={offerValue || discountPercentage || ''}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          setOfferValue(val);
                          setDiscountPercentage(offerType === 'PERCENTAGE' ? Math.min(100, val) : val);
                        }}
                        placeholder={offerType === 'PERCENTAGE' ? 'e.g. 10' : 'e.g. 50'}
                        className="w-24 px-3 py-1 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-900 outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Calculated Live Discount Preview */}
                {enableOffer && (
                  <div className="p-2.5 rounded-xl bg-amber-100/60 border border-amber-300/70 text-xs text-amber-950 font-medium">
                    <span className="font-bold block mb-1">Live Discounted Price Preview:</span>
                    {pricingType === 'SINGLE_PRICE' && Number(price) > 0 && (
                      <span>
                        ₹{price} → <strong className="text-emerald-800 font-extrabold text-sm">₹{Math.max(0, Math.round(offerType === 'PERCENTAGE' ? Number(price) * (1 - (offerValue || discountPercentage) / 100) : Number(price) - (offerValue || discountPercentage)))}</strong>
                      </span>
                    )}
                    {pricingType === 'VEG_NON_VEG' && (
                      <div className="flex items-center gap-4">
                        {Number(vegPrice) > 0 && (
                          <span>🟢 Veg: ₹{vegPrice} → <strong className="text-emerald-800">₹{Math.max(0, Math.round(offerType === 'PERCENTAGE' ? Number(vegPrice) * (1 - (offerValue || discountPercentage) / 100) : Number(vegPrice) - (offerValue || discountPercentage)))}</strong></span>
                        )}
                        {Number(nonVegPrice) > 0 && (
                          <span>🔴 Non-Veg: ₹{nonVegPrice} → <strong className="text-emerald-800">₹{Math.max(0, Math.round(offerType === 'PERCENTAGE' ? Number(nonVegPrice) * (1 - (offerValue || discountPercentage) / 100) : Number(nonVegPrice) - (offerValue || discountPercentage)))}</strong></span>
                        )}
                      </div>
                    )}
                    {(pricingType === 'CUSTOM_VARIANTS' || pricingType === 'PORTION') && customVariants.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3">
                        {customVariants.map((v) => (
                          <span key={v.id}>
                            {v.label || 'Variant'}: ₹{v.price} → <strong className="text-emerald-800">₹{Math.max(0, Math.round(offerType === 'PERCENTAGE' ? v.price * (1 - (offerValue || discountPercentage) / 100) : v.price - (offerValue || discountPercentage)))}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Special Badges (Popular & Chef Special) */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-gray-800">Popular Dish ⭐</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isChefSpecial}
                onChange={(e) => setIsChefSpecial(e.target.checked)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-gray-800">Chef Special 👑</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || countWords(description) > MAX_FOOD_DESCRIPTION_WORDS || !dietary}
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-black" />}
              <span>{isSubmitting ? 'Saving Dish...' : mode === 'create' ? 'Create Food Item' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

