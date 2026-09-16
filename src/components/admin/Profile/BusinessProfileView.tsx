import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  CheckCircle2,
  Building,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { BusinessProfile } from '../../../types/menu';
import { ProfileCompletionCard } from './ProfileCompletionCard';
import { uploadImageToSupabase } from '../../../utils/imageUpload';
import { resolveLogoUrl } from '../../../utils/imageResolver';
import { formatWhatsAppUrl } from '../../../utils/profileCompletion';
import { WhatsAppBrandIcon, GoogleReviewBrandIcon } from '../../common/MenuIcons';

interface BusinessProfileViewProps {
  business: BusinessProfile;
  onUpdateBusiness: (data: Partial<BusinessProfile>) => Promise<void>;
}

export function BusinessProfileView({
  business,
  onUpdateBusiness,
}: BusinessProfileViewProps) {
  // Baseline snapshot for data-aware dirty state comparison
  const [initialSnapshot, setInitialSnapshot] = useState<BusinessProfile>(business);

  // Form field states
  const [name, setName] = useState(business.name || '');
  const [location, setLocation] = useState(business.location || '');
  const [phone, setPhone] = useState(business.phone || '');
  const [email, setEmail] = useState(business.email || '');
  const [address, setAddress] = useState(business.address || '');

  // Native Time Input States
  const [openingTime, setOpeningTime] = useState(business.openingTime || '11:30');
  const [closingTime, setClosingTime] = useState(business.closingTime || '23:00');
  const [workingDays, setWorkingDays] = useState(business.workingDays || 'All 7 Days');

  // Social & Review Links
  const [instagram, setInstagram] = useState(business.instagram || '');
  const [facebook, setFacebook] = useState(business.facebook || '');
  const [whatsappInput, setWhatsappInput] = useState(business.whatsappNumber || business.whatsapp || '');
  const [website, setWebsite] = useState(business.website || '');
  const [googleReviewUrl, setGoogleReviewUrl] = useState(business.googleReviewUrl || '');

  // Persisted logo state
  const [logoUrl, setLogoUrl] = useState(business.logoUrl || '');
  const [logoStorageKey, setLogoStorageKey] = useState(business.logoStorageKey || '');

  // Pending Logo state (DEFERRED upload)
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [pendingLogoPreview, setPendingLogoPreview] = useState<string | null>(null);
  const [isLogoRemovedPending, setIsLogoRemovedPending] = useState(false);

  // Action status states
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Revoke object URLs to prevent memory leaks
  const activePreviewRef = useRef<string | null>(null);
  activePreviewRef.current = pendingLogoPreview;

  useEffect(() => {
    return () => {
      if (activePreviewRef.current) {
        URL.revokeObjectURL(activePreviewRef.current);
      }
    };
  }, []);

  // Sync state when business prop updates
  useEffect(() => {
    setInitialSnapshot(business);
    setName(business.name || '');
    setLocation(business.location || '');
    setPhone(business.phone || '');
    setEmail(business.email || '');
    setAddress(business.address || '');
    setOpeningTime(business.openingTime || '11:30');
    setClosingTime(business.closingTime || '23:00');
    setWorkingDays(business.workingDays || 'All 7 Days');
    setInstagram(business.instagram || '');
    setFacebook(business.facebook || '');
    setWhatsappInput(business.whatsappNumber || business.whatsapp || '');
    setWebsite(business.website || '');
    setGoogleReviewUrl(business.googleReviewUrl || '');
    setLogoUrl(business.logoUrl || '');
    setLogoStorageKey(business.logoStorageKey || '');
    setPendingLogoFile(null);
    if (pendingLogoPreview) {
      URL.revokeObjectURL(pendingLogoPreview);
    }
    setPendingLogoPreview(null);
    setIsLogoRemovedPending(false);
  }, [business]);

  // Compute 12-hour formatted time for display
  const format12H = (time24: string) => {
    if (!time24) return '';
    const [hStr, mStr] = time24.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h) || isNaN(m)) return '';
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const mFormatted = m < 10 ? `0${m}` : `${m}`;
    return `${h12}:${mFormatted} ${period}`;
  };

  const getComputedOpeningHoursString = (oTime: string, cTime: string, days: string) => {
    if (!oTime && !cTime) return '';
    const formattedOpen = format12H(oTime);
    const formattedClose = format12H(cTime);
    return `${formattedOpen} - ${formattedClose} (${days.trim() || 'All 7 Days'})`;
  };

  // Data-aware dirty state comparison
  const hasChanges = useMemo(() => {
    if (pendingLogoFile !== null || isLogoRemovedPending) return true;
    if (!initialSnapshot) return false;

    const initialWhatsapp = (initialSnapshot.whatsappNumber || initialSnapshot.whatsapp || '').trim();

    return (
      name.trim() !== (initialSnapshot.name || '').trim() ||
      location.trim() !== (initialSnapshot.location || '').trim() ||
      phone.trim() !== (initialSnapshot.phone || '').trim() ||
      email.trim() !== (initialSnapshot.email || '').trim() ||
      address.trim() !== (initialSnapshot.address || '').trim() ||
      openingTime.trim() !== (initialSnapshot.openingTime || '11:30').trim() ||
      closingTime.trim() !== (initialSnapshot.closingTime || '23:00').trim() ||
      workingDays.trim() !== (initialSnapshot.workingDays || 'All 7 Days').trim() ||
      instagram.trim() !== (initialSnapshot.instagram || '').trim() ||
      facebook.trim() !== (initialSnapshot.facebook || '').trim() ||
      whatsappInput.trim() !== initialWhatsapp ||
      website.trim() !== (initialSnapshot.website || '').trim() ||
      googleReviewUrl.trim() !== (initialSnapshot.googleReviewUrl || '').trim()
    );
  }, [
    name, location, phone, email, address, openingTime, closingTime, workingDays,
    instagram, facebook, whatsappInput, website, googleReviewUrl,
    pendingLogoFile, isLogoRemovedPending, initialSnapshot
  ]);

  // Handle local logo file selection (DEFERRED upload - NO immediate network request)
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError('Please select a valid image file (.jpg, .png, .webp).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be under 10MB.');
      return;
    }

    setError(null);
    if (pendingLogoPreview) {
      URL.revokeObjectURL(pendingLogoPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setPendingLogoFile(file);
    setPendingLogoPreview(previewUrl);
    setIsLogoRemovedPending(false);
  };

  const handleRemoveLogoClick = () => {
    if (pendingLogoPreview) {
      URL.revokeObjectURL(pendingLogoPreview);
    }
    setPendingLogoFile(null);
    setPendingLogoPreview(null);
    setIsLogoRemovedPending(true);
    setError(null);
  };

  const handleCancelPendingLogo = () => {
    if (pendingLogoPreview) {
      URL.revokeObjectURL(pendingLogoPreview);
    }
    setPendingLogoFile(null);
    setPendingLogoPreview(null);
    setIsLogoRemovedPending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges || isSaving) return;

    if (!name.trim()) {
      setError('Restaurant name is required.');
      return;
    }
    if (!location.trim()) {
      setError('Location is required.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      let finalLogoUrl = logoUrl;
      let finalLogoStorageKey = logoStorageKey;

      // 1. Upload pending logo to Supabase ONLY during Save Changes
      if (pendingLogoFile) {
        try {
          const { url, path } = await uploadImageToSupabase(pendingLogoFile, 'business');
          finalLogoUrl = url;
          finalLogoStorageKey = path || '';
        } catch (uploadErr: unknown) {
          const msg = uploadErr instanceof Error ? uploadErr.message : 'Failed to upload logo to Supabase Storage.';
          setError(`Logo Upload Error: ${msg}. Your other edits were NOT saved. Please try again.`);
          setIsSaving(false);
          return;
        }
      } else if (isLogoRemovedPending) {
        finalLogoUrl = '';
        finalLogoStorageKey = '';
      }

      const generatedWhatsappUrl = formatWhatsAppUrl(whatsappInput);
      const computedOpeningHours = getComputedOpeningHoursString(openingTime, closingTime, workingDays);

      const updatePayload: Partial<BusinessProfile> = {
        name: name.trim(),
        location: location.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        openingHours: computedOpeningHours,
        openingTime: openingTime.trim(),
        closingTime: closingTime.trim(),
        workingDays: workingDays.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        whatsappNumber: whatsappInput.trim(),
        whatsapp: generatedWhatsappUrl,
        website: website.trim(),
        googleReviewUrl: googleReviewUrl.trim(),
        logoUrl: finalLogoUrl.trim(),
        logoStorageKey: finalLogoStorageKey.trim(),
      };

      // 2. Persist to Firestore
      await onUpdateBusiness(updatePayload);

      // Clean up object URL after successful save
      if (pendingLogoPreview) {
        URL.revokeObjectURL(pendingLogoPreview);
      }
      setPendingLogoFile(null);
      setPendingLogoPreview(null);
      setIsLogoRemovedPending(false);
      setLogoUrl(finalLogoUrl);
      setLogoStorageKey(finalLogoStorageKey);

      // Reset baseline snapshot to newly saved state
      setInitialSnapshot({
        ...business,
        ...updatePayload,
      });

      setSuccessMessage('Business profile updated successfully! All changes are reflected on the customer menu.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update business profile.';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine which image URL to show in preview
  const displayLogoUrl = useMemo(() => {
    if (isLogoRemovedPending) return '';
    if (pendingLogoPreview) return pendingLogoPreview;
    return resolveLogoUrl(logoUrl);
  }, [isLogoRemovedPending, pendingLogoPreview, logoUrl]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">

      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Business Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Update your restaurant information
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-red-800 text-xs sm:text-sm font-medium">
          {error}
        </div>
      )}

      {/* Dynamic Profile Completion Status Indicator */}
      {/* <ProfileCompletionCard business={business} variant="profile-banner" /> */}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Top Split: Logo Card (Left) and Basic Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Logo Preview Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Restaurant Logo (9:16 Ratio)
              </span>
              {pendingLogoFile && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Pending Upload
                </span>
              )}
            </div>

            {/* Dark Card Preview for King's Platter Logo */}
            <div className="w-full h-52 rounded-2xl bg-[#0B1E15] border border-[#E5A93C]/30 flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-inner mb-4">
              {displayLogoUrl ? (
                <img
                  src={displayLogoUrl}
                  alt="King's Platter Logo"
                  className="h-44 w-auto max-w-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 text-xs">
                  <span>No Logo Selected</span>
                </div>
              )}
            </div>

            {/* Change Logo / Actions */}
            <div className="w-full space-y-2">
              <label className={`w-full py-2.5 px-4 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="w-4 h-4" />
                <span>{pendingLogoFile ? 'Choose Different Logo' : 'Select New Logo'}</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  disabled={isSaving}
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
              </label>

              {(pendingLogoFile || isLogoRemovedPending) && (
                <button
                  type="button"
                  onClick={handleCancelPendingLogo}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Revert Logo Selection</span>
                </button>
              )}

              {logoUrl && !pendingLogoFile && !isLogoRemovedPending && (
                <button
                  type="button"
                  onClick={handleRemoveLogoClick}
                  className="w-full py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Current Logo</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-400 mt-2">
              Logo will be uploaded to Supabase Storage when you click <strong>Save Changes</strong> below.
            </p>
          </div>

          {/* Right Column: Basic Information Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Basic Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Restaurant Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Restaurant Name *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="King's Platter"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Tirunelveli"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@kingsplatter.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Physical Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="No. 42, Royal Avenue, South Bypass Road, Tirunelveli..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20 resize-none"
              />
            </div>

            {/* Business Hours & Schedule (Native Time Picker Controls) */}
            <div className="space-y-3 pt-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Business Hours & Schedule
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Opening Time Picker */}
                <div>
                  <span className="block text-[11px] font-semibold text-gray-500 mb-1">Opening Time</span>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20"
                  />
                </div>

                {/* Closing Time Picker */}
                <div>
                  <span className="block text-[11px] font-semibold text-gray-500 mb-1">Closing Time</span>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20"
                  />
                </div>

                {/* Working Days Selector */}
                <div>
                  <span className="block text-[11px] font-semibold text-gray-500 mb-1">Working Days</span>
                  <input
                    type="text"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    placeholder="All 7 Days"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Social Links Section with Official Brand Icons */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Social & Review Links
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Instagram */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Instagram Profile</span>
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#F5B800]"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook Page</span>
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#F5B800]"
              />
            </div>

            {/* Official WhatsApp Brand Icon */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <WhatsAppBrandIcon className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Phone Number</span>
              </label>
              <input
                type="text"
                value={whatsappInput}
                onChange={(e) => setWhatsappInput(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#F5B800]"
              />
              <p className="text-[11px] text-gray-400 mt-1">Number will be normalized into direct WhatsApp wa.me link</p>
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-600" />
                <span>Website URL</span>
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#F5B800]"
              />
            </div>

            {/* Official Google Reviews Brand Icon */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <GoogleReviewBrandIcon className="w-4 h-4" />
                <span>Google Review URL</span>
              </label>
              <input
                type="text"
                value={googleReviewUrl}
                onChange={(e) => setGoogleReviewUrl(e.target.value)}
                placeholder="https://search.google.com/local/writereview?placeid=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#F5B800]"
              />
              <p className="text-[11px] text-gray-400 mt-1">Leave empty to disable review on customer menu</p>
            </div>
          </div>

          {/* Bottom Save Changes Button (Dirty-State Aware: DISABLED when no changes) */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {hasChanges ? 'Unsaved changes pending...' : 'No changes to save'}
            </span>

            <button
              type="submit"
              disabled={!hasChanges || isSaving}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs ${
                hasChanges && !isSaving
                  ? 'bg-[#F5B800] hover:bg-[#E5A93C] text-black shadow-md shadow-[#F5B800]/20 active:scale-98 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
              }`}
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}


