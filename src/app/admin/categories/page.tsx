'use client';

import React, { useContext } from 'react';
import { AdminContext } from '../layout';
import { CategoryManagement } from '@/components/admin/Categories/CategoryManagement';
import { CategoriesSkeleton } from '@/components/admin/AdminSkeletons';

export default function AdminCategoriesPage() {
  const {
    categories,
    foodItems,
    isLoadingData,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    setSelectedCategoryFilter,
    handleNavigateTab,
    isAddCategoryOpen,
    setIsAddCategoryOpen,
  } = useContext(AdminContext);

  if (isLoadingData) {
    return <CategoriesSkeleton />;
  }

  return (
    <CategoryManagement
      categories={categories}
      foodItems={foodItems}
      onCreateCategory={handleCreateCategory}
      onUpdateCategory={handleUpdateCategory}
      onDeleteCategory={handleDeleteCategory}
      onNavigateToFoodItemsWithCategory={(catId) => {
        setSelectedCategoryFilter(catId);
        handleNavigateTab('food-items');
      }}
      isAddModalOpen={isAddCategoryOpen}
      onCloseAddModal={() => setIsAddCategoryOpen(false)}
    />
  );
}
