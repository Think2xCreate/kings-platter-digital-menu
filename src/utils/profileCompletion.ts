import { BusinessProfile } from '../types/menu';

export interface RequiredFieldDef {
  key: keyof BusinessProfile;
  label: string;
}

export const REQUIRED_BUSINESS_FIELDS: RequiredFieldDef[] = [
  { key: 'name', label: 'Restaurant Name' },
  { key: 'location', label: 'City Location' },
  { key: 'phone', label: 'Business Phone Number' },
  { key: 'email', label: 'Business Email Address' },
  { key: 'logoUrl', label: 'Restaurant Logo' },
  { key: 'address', label: 'Physical Address' },
  { key: 'openingHours', label: 'Opening Hours' },
];

export interface ProfileCompletionResult {
  percentage: number;
  completedCount: number;
  totalFields: number;
  isComplete: boolean;
  missingFields: string[];
}

/**
 * Calculates dynamic profile completion based on actual persisted Firestore business profile fields.
 */
export function calculateBusinessProfileCompletion(business?: BusinessProfile | null): ProfileCompletionResult {
  if (!business) {
    return {
      percentage: 0,
      completedCount: 0,
      totalFields: REQUIRED_BUSINESS_FIELDS.length,
      isComplete: false,
      missingFields: REQUIRED_BUSINESS_FIELDS.map(f => f.label),
    };
  }

  const missingFields: string[] = [];
  let completedCount = 0;

  for (const field of REQUIRED_BUSINESS_FIELDS) {
    const val = business[field.key];
    if (typeof val === 'string' && val.trim().length > 0) {
      completedCount++;
    } else {
      missingFields.push(field.label);
    }
  }

  const totalFields = REQUIRED_BUSINESS_FIELDS.length;
  const percentage = Math.round((completedCount / totalFields) * 100);
  const isComplete = percentage === 100;

  return {
    percentage,
    completedCount,
    totalFields,
    isComplete,
    missingFields,
  };
}

/**
 * Helper to normalize phone number and construct a WhatsApp wa.me link.
 */
export function formatWhatsAppUrl(whatsappInput?: string | null): string {
  if (!whatsappInput || typeof whatsappInput !== 'string') return '';
  const trimmed = whatsappInput.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  // If number starts with 10 digits without country code, default to +91 (India) if appropriate or keep digits
  const countryDigits = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${countryDigits}`;
}
