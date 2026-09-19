import React from 'react';
import { 
  LayoutGrid, 
  UtensilsCrossed, 
  BadgePercent,  
  Edit3,
  Calendar,
} from 'lucide-react';
import { Category, FoodItem, BusinessProfile } from '../../../types/menu';
import { CrownIcon } from '../../common/MenuIcons';
import { SafeImage } from '../../common/SafeImage';
import { AdminTab } from '../AdminSidebar';
import { ProfileCompletionCard } from '../Profile/ProfileCompletionCard';

interface DashboardOverviewProps {
  categories: Category[];
  foodItems: FoodItem[];
  business: BusinessProfile;
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddCategory: () => void;
  onOpenAddFoodItem: () => void;
}

export function DashboardOverview({
  categories = [],
  foodItems = [],
  business,
  onNavigateTab,
  onOpenAddCategory,
  onOpenAddFoodItem,
}: DashboardOverviewProps) {
  // Defensive checks to ensure categories and foodItems are arrays
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];

  // Compute counts
  const totalCategoriesCount = safeCategories.length;
  const totalFoodItemsCount = safeFoodItems.length;
  const activeOffersCount = safeFoodItems.filter(f => (f.discountPercentage || 0) > 0).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quick overview of your digital menu
        </p>
      </div>

      {/* 4 Small Overview Cards (Desktop: 4 columns, Mobile: 2x2 grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        
        {/* Card 1: Total Categories */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex items-center gap-3.5 sm:gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-[#FFF8E6] text-[#C88A00] flex items-center justify-center shrink-0 border border-[#F5B800]/20">
            <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Total Categories</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {totalCategoriesCount}
            </span>
          </div>
        </div>

        {/* Card 2: Total Food Items */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex items-center gap-3.5 sm:gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-[#FFF8E6] text-[#C88A00] flex items-center justify-center shrink-0 border border-[#F5B800]/20">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Total Food Items</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {totalFoodItemsCount}
            </span>
          </div>
        </div>

        {/* Card 3: Active Offers */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex items-center gap-3.5 sm:gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-[#FFF8E6] text-[#C88A00] flex items-center justify-center shrink-0 border border-[#F5B800]/20">
            <BadgePercent className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Active Offers</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {activeOffersCount || 8}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions (Matches Mobile Screen 3) */}
      <div className="block lg:hidden bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenAddFoodItem}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-amber-50/50 border border-gray-200 hover:border-[#F5B800] transition-all text-center cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#FFF8E6] text-[#C88A00] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-gray-800 leading-tight">Add Food Item</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddCategory}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-amber-50/50 border border-gray-200 hover:border-[#F5B800] transition-all text-center cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#FFF8E6] text-[#C88A00] flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-gray-800 leading-tight">Add Category</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('profile')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-amber-50/50 border border-gray-200 hover:border-[#F5B800] transition-all text-center cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#FFF8E6] text-[#C88A00] flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-gray-800 leading-tight">Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Mid Section: Menu Management & Business Profile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Card 1: Menu Management */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Menu Management
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Organize your menu categories and food items
            </p>

            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mt-5">
              {/* Category Sub-Box */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] text-[#C88A00] flex items-center justify-center mb-2">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  {totalCategoriesCount}
                </span>
                <span className="text-xs text-gray-500 font-medium mb-3">Categories</span>
                
                <button
                  type="button"
                  onClick={() => onNavigateTab('categories')}
                  className="w-full py-2 px-3 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black font-semibold text-xs transition-all shadow-xs active:scale-98 cursor-pointer"
                >
                  Manage Categories
                </button>
              </div>

              {/* Food Items Sub-Box */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] text-[#C88A00] flex items-center justify-center mb-2">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <span className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  {totalFoodItemsCount}
                </span>
                <span className="text-xs text-gray-500 font-medium mb-3">Food Items</span>

                <button
                  type="button"
                  onClick={() => onNavigateTab('food-items')}
                  className="w-full py-2 px-3 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black font-semibold text-xs transition-all shadow-xs active:scale-98 cursor-pointer"
                >
                  Manage Food Items
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Business Profile with Data-Driven Completion Circle */}
        <ProfileCompletionCard
          business={business}
          onNavigateProfile={() => onNavigateTab('profile')}
        />

      </div>
    </div>
  );
}
