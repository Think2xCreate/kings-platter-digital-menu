import React from 'react';

/**
 * Dashboard Overview Skeleton Loader
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded-xl" />
        <div className="h-4 w-64 bg-gray-100 rounded-lg" />
      </div>

      {/* 3 Overview metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-6 w-12 bg-gray-300 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Mid section cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 space-y-4">
          <div className="h-5 w-36 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-gray-100 rounded-xl" />
            <div className="h-28 bg-gray-100 rounded-xl" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 space-y-4 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-gray-200" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Category Management Skeleton Loader
 */
export function CategoriesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded-xl" />
          <div className="h-4 w-64 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-xl" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200" />
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Food Item Management Skeleton Loader
 */
export function FoodItemsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded-xl" />
          <div className="h-4 w-64 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-xl" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 bg-gray-200 rounded-xl shrink-0" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200/80 p-4 space-y-3">
            <div className="h-40 bg-gray-200 rounded-xl w-full" />
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-100 rounded" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 w-16 bg-gray-300 rounded" />
              <div className="h-8 w-16 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Business Profile Form Skeleton Loader
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded-xl" />
        <div className="h-4 w-64 bg-gray-100 rounded-lg" />
      </div>

      <div className="h-20 bg-gray-200 rounded-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-200/80 space-y-4">
          <div className="h-48 bg-gray-200 rounded-2xl w-full" />
          <div className="h-10 bg-gray-300 rounded-xl w-full" />
        </div>
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-200/80 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-100 rounded-xl" />
            <div className="h-10 bg-gray-100 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-100 rounded-xl" />
            <div className="h-10 bg-gray-100 rounded-xl" />
          </div>
          <div className="h-20 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
