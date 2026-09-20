'use client';

import React, { useContext } from 'react';
import { AdminContext } from './layout';
import { DashboardOverview } from '@/components/admin/Dashboard/DashboardOverview';
import { DashboardSkeleton } from '@/components/admin/AdminSkeletons';

export default function AdminDashboardPage() {
  const {
    business,
    categories,
    foodItems,
    isLoadingData,
    handleNavigateTab,
    setIsAddCategoryOpen,
    setIsAddFoodItemOpen,
  } = useContext(AdminContext);

  if (isLoadingData || !business) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardOverview
      categories={categories}
      foodItems={foodItems}
      business={business}
      onNavigateTab={handleNavigateTab}
      onOpenAddCategory={() => {
        handleNavigateTab('categories');
        setIsAddCategoryOpen(true);
      }}
      onOpenAddFoodItem={() => {
        handleNavigateTab('food-items');
        setIsAddFoodItemOpen(true);
      }}
    />
  );
}
