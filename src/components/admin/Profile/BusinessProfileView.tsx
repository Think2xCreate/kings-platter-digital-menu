import React, { useState, useEffect } from 'react';
import {
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  CheckCircle2,
  Building
} from 'lucide-react';
import { BusinessProfile } from '../../../types/menu';
import { CrownIcon } from '../../common/MenuIcons';
import { ProfileCompletionCard } from './ProfileCompletionCard';

import { uploadImageToSupabase } from '../../../utils/imageUpload';

interface BusinessProfileViewProps {
  business: BusinessProfile;
  onUpdateBusiness: (data: Partial<BusinessProfile>) => Promise<void>;
}

export function BusinessProfileView({
  business,
  onUpdateBusiness,
}: BusinessProfileViewProps) {
  const [name, setName] = useState(business.name || "KING'S PLATTER");
  const [location, setLocation] = useState(business.location || 'Tirunelveli');
  const [phone, setPhone] = useState(business.phone || '+91 98765 43210');
  const [email, setEmail] = useState(business.email || 'info@kingsplatter.com');
  const [address, setAddress] = useState(business.address || '');
  const [openingHours, setOpeningHours] = useState(business.openingHours || '');

  // Social Links
  const [instagram, setInstagram] = useState(business.instagram || 'https://instagram.com/kingsplatter');
  const [facebook, setFacebook] = useState(business.facebook || 'https://facebook.com/kingsplatter');
  const [whatsapp, setWhatsapp] = useState(business.whatsapp || 'https://wa.me/919876543210');
  const [website, setWebsite] = useState(business.website || 'https://kingsplatter.com');

  // Logo
  const [logoUrl, setLogoUrl] = useState(business.logoUrl || '');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(business.name || "KING'S PLATTER");
    setLocation(business.location || 'Tirunelveli');
    setPhone(business.phone || '+91 98765 43210');
    setEmail(business.email || 'info@kingsplatter.com');
    setAddress(business.address || '');
    setOpeningHours(business.openingHours || '');
    setInstagram(business.instagram || 'https://instagram.com/kingsplatter');
    setFacebook(business.facebook || 'https://facebook.com/kingsplatter');
    setWhatsapp(business.whatsapp || 'https://wa.me/919876543210');
    setWebsite(business.website || 'https://kingsplatter.com');
    setLogoUrl(business.logoUrl || '');
  }, [business]);

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError('Please select a valid image file (.jpg, .png, .webp).');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const url = await uploadImageToSupabase(file, 'business');
      setLogoUrl(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload logo.';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      await onUpdateBusiness({
        name: name.trim(),
        location: location.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        openingHours: openingHours.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        whatsapp: whatsapp.trim(),
        website: website.trim(),
        logoUrl: logoUrl.trim() || undefined,
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
      <ProfileCompletionCard business={business} variant="profile-banner" />

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Top Split: Logo Card (Left) and Basic Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Logo Preview Card (Matches Screen 6) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col items-center text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block w-full text-left">
              Restaurant Logo
            </span>

            {/* Dark Card Preview for King's Platter Logo */}
            <div className="w-full h-44 rounded-2xl bg-[#0B1E15] border border-[#E5A93C]/30 flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner mb-4">
              <img
                src={logoUrl || '/kings_platter_logo.jpg'}
                alt="King's Platter Logo"
                className="max-h-28 max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Change Logo Yellow Button */}
            <label className={`w-full py-2.5 px-4 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading Logo...' : 'Change Logo'}</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                disabled={isUploading}
                onChange={handleLogoFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-gray-400 mt-2">
              Supports: .jpg, .png, .webp (Auto compressed)
            </p>
          </div>

          {/* Right Column: Basic Information Form (Matches Screen 6) */}
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
          </div>

        </div>

        {/* Social Links Section (Matches Screen 6) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Social Links
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Instagram */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Instagram</span>
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/kingsplatter"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#F5B800]"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/kingsplatter"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#F5B800]"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </label>
              <input
                type="url"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="https://wa.me/919876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#F5B800]"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-600" />
                <span>Website</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://kingsplatter.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#F5B800]"
              />
            </div>
          </div>

          {/* Bottom Save Changes Button (Right-aligned yellow button) */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black font-bold text-sm shadow-md shadow-[#F5B800]/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
