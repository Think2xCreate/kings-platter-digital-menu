import React from 'react';
import { CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { BusinessProfile } from '../../../types/menu';

interface ProfileCompletionCardProps {
  business: BusinessProfile;
  onNavigateProfile?: () => void;
  variant?: 'dashboard' | 'profile-banner';
}

interface RequiredFieldDef {
  key: keyof BusinessProfile;
  label: string;
}

const REQUIRED_FIELDS: RequiredFieldDef[] = [
  { key: 'name', label: 'Restaurant name' },
  { key: 'location', label: 'City location' },
  { key: 'phone', label: 'Business phone number' },
  { key: 'email', label: 'Business email address' },
  { key: 'logoUrl', label: 'Restaurant logo' },
];

export function ProfileCompletionCard({
  business,
  onNavigateProfile,
  variant = 'dashboard',
}: ProfileCompletionCardProps) {
  // Data-driven calculation of completed required fields
  const missingFields: string[] = [];
  let completedCount = 0;

  for (const field of REQUIRED_FIELDS) {
    const val = business[field.key];
    if (typeof val === 'string' && val.trim().length > 0) {
      completedCount++;
    } else {
      missingFields.push(field.label);
    }
  }

  const totalFields = REQUIRED_FIELDS.length;
  const percentage = Math.round((completedCount / totalFields) * 100);
  const isComplete = percentage === 100;
  const remainingCount = totalFields - completedCount;

  // SVG Circle Progress parameters
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (variant === 'profile-banner') {
    return (
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isComplete
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
      }`}>
        <div className="flex items-center gap-4">
          {/* Circular progress meter */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-gray-200"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className={`${isComplete ? 'text-emerald-500' : 'text-[#C88A00]'} transition-[stroke-dashoffset,color] duration-700 ease-out`}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-black">
              {percentage}%
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm sm:text-base">
              {isComplete ? 'Profile Complete' : `${percentage}% Profile Completed`}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {isComplete
                ? 'All required business details are ready and live.'
                : `${completedCount} of ${totalFields} required details completed.`}
            </p>
            {!isComplete && missingFields.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-amber-800">
                <span className="font-medium">Missing:</span>
                {missingFields.map((f, i) => (
                  <span key={f} className="font-semibold underline">
                    {f}{i < missingFields.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {isComplete && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready for Customer QR Menu</span>
          </div>
        )}
      </div>
    );
  }

  // Dashboard Overview Widget variant
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Business Profile
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Keep your restaurant information up to date
            </p>
          </div>

          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isComplete
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {isComplete ? '100% Ready' : `${percentage}% Completed`}
          </span>
        </div>

        {/* Circular Progress & Status Body */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-gray-100"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className={`${isComplete ? 'text-emerald-500' : 'text-[#C88A00]'} transition-[stroke-dashoffset,color] duration-700 ease-out`}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-gray-900 leading-none">
                {percentage}%
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                Status
              </span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-900">
            {isComplete ? 'Profile Complete' : `${percentage}% Complete`}
          </h3>

          <p className="text-xs text-gray-500 mt-0.5 max-w-xs">
            {isComplete
              ? 'All required business details are ready.'
              : `${remainingCount} required detail${remainingCount > 1 ? 's' : ''} remaining`}
          </p>

          {/* Missing list if incomplete */}
          {!isComplete && missingFields.length > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 w-full text-left">
              <span className="text-[11px] font-bold text-amber-900 block mb-1">
                Missing required information:
              </span>
              <ul className="space-y-0.5">
                {missingFields.map((field) => (
                  <li key={field} className="text-[11px] text-amber-800 flex items-center gap-1.5 font-medium">
                    <span className="w-1 h-1 rounded-full bg-amber-600" />
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {onNavigateProfile && (
        <button
          type="button"
          onClick={onNavigateProfile}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 ${
            isComplete
              ? 'bg-[#F5B800] hover:bg-[#E5A93C] text-black'
              : 'bg-[#C88A00] hover:bg-[#B37800] text-white shadow-md'
          }`}
        >
          <span>{isComplete ? 'Edit Profile' : 'Complete Profile'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
