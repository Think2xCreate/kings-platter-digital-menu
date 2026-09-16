'use client';

import React, { useContext } from 'react';
import { AdminContext } from '../layout';
import { FoodItemManagement } from '@/components/admin/FoodItems/FoodItemManagement';
import { FoodItemsSkeleton } from '@/components/admin/AdminSkeletons';

export default function AdminFoodItemsPage() {
  const {
    foodItems,
    categories,
    isLoadingData,
    handleCreateFoodItem,
    handleUpdateFoodItem,
    handleDeleteFoodItem,
    selectedCategoryFilter,
    isAddFoodItemOpen,
    setIsAddFoodItemOpen,
  } = useContext(AdminContext);

  if (isLoadingData) {
    return <FoodItemsSkeleton />;
  }

  return (
    <FoodItemManagement
      foodItems={foodItems}
      categories={categories}
      onCreateFoodItem={handleCreateFoodItem}
      onUpdateFoodItem={handleUpdateFoodItem}
      onDeleteFoodItem={handleDeleteFoodItem}
      initialCategoryFilter={selectedCategoryFilter}
      isAddModalOpen={isAddFoodItemOpen}
      onCloseAddModal={() => setIsAddFoodItemOpen(false)}
    />
  );
}
