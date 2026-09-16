import React, { useState, useEffect, useCallback } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminMobileDrawer } from './AdminMobileDrawer';
import { AdminLoginModal } from './AdminLoginModal';
import { DashboardOverview } from './Dashboard/DashboardOverview';
import { CategoryManagement } from './Categories/CategoryManagement';
import { FoodItemManagement } from './FoodItems/FoodItemManagement';
import { BusinessProfileView } from './Profile/BusinessProfileView';
import { BrandLoader } from '../common/BrandLoader';
import { AdminToast } from './AdminToast';
import { adminAuth, AdminUser } from '../../services/adminAuth';
import { menuRepository } from '../../services/menuRepository';
import { Category, FoodItem, BusinessProfile } from '../../types/menu';
import { mockBusinessProfile } from '../../data/mock-menu';

interface AdminDashboardProps {
  onBackToCustomerMenu: () => void;
}

export function AdminDashboard({ onBackToCustomerMenu }: AdminDashboardProps) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Data state from repository
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [business, setBusiness] = useState<BusinessProfile>(mockBusinessProfile);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Quick Action Modal triggers
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddFoodItemOpen, setIsAddFoodItemOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  // Check login session on mount
  useEffect(() => {
    const user = adminAuth.getCurrentUser();
    setCurrentUser(user);
    setIsAuthLoading(false);
  }, []);

  // Load menu data safely as async
  const loadData = useCallback(async () => {
    try {
      const [cats, items, prof] = await Promise.all([
        menuRepository.getCategories(true),
        menuRepository.getFoodItems(),
        menuRepository.getBusinessProfile(),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setFoodItems(Array.isArray(items) ? items : []);
      if (prof) setBusiness(prof);
    } catch (error) {
      console.error('Failed to load admin menu data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = menuRepository.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  // Auth Handlers
  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const handleLogout = () => {
    adminAuth.logout();
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
  };

  // Category Actions
  const handleCreateCategory = async (data: Omit<Category, 'id' | 'itemCount'>) => {
    await menuRepository.addCategory(data);
    await loadData();
    showToast(`Category "${data.name}" created successfully!`, 'success');
  };

  const handleUpdateCategory = async (id: string, data: Partial<Category>) => {
    await menuRepository.updateCategory(id, data);
    await loadData();
    showToast('Category updated successfully!', 'success');
  };

  const handleDeleteCategory = async (id: string) => {
    await menuRepository.deleteCategory(id);
    await loadData();
    showToast('Category deleted successfully.', 'info');
  };

  // Food Item Actions
  const handleCreateFoodItem = async (data: Omit<FoodItem, 'id' | 'finalPrice'>) => {
    await menuRepository.addFoodItem(data);
    await loadData();
    showToast(`Food item "${data.name}" added to menu!`, 'success');
  };

  const handleUpdateFoodItem = async (id: string, data: Partial<FoodItem>) => {
    await menuRepository.updateFoodItem(id, data);
    await loadData();
    showToast('Food item updated successfully!', 'success');
  };

  const handleDeleteFoodItem = async (id: string) => {
    await menuRepository.deleteFoodItem(id);
    await loadData();
    showToast('Food item deleted.', 'info');
  };

  // Business Profile Actions
  const handleUpdateBusiness = async (data: Partial<BusinessProfile>) => {
    await menuRepository.updateBusinessProfile(data);
    await loadData();
    showToast('Business profile updated successfully!', 'success');
  };

  const handleNavigateToFoodItemsWithCategory = (catId: string) => {
    setSelectedCategoryFilter(catId);
    setActiveTab('food-items');
  };

  if (isAuthLoading) {
    return (
      <BrandLoader
        isLoading={isAuthLoading}
        variant="admin"
        restaurantName="KING'S PLATTER"
        subName="ADMIN PORTAL"
      />
    );
  }

  // If not logged in, display login view
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0E0E12] flex flex-col justify-between">
        <AdminLoginModal
          isOpen={true}
          onSuccess={handleLoginSuccess}
          onCancel={onBackToCustomerMenu}
        />
        {toastMessage && (
          <AdminToast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-row">
      {/* Desktop Sidebar (Persistent) */}
      <div className="hidden md:block">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
          onViewCustomerMenu={onBackToCustomerMenu}
        />
      </div>

      {/* Mobile Slide-in Drawer */}
      <AdminMobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        onViewCustomerMenu={onBackToCustomerMenu}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={currentUser}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onViewCustomerMenu={onBackToCustomerMenu}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              categories={categories}
              foodItems={foodItems}
              business={business}
              onNavigateTab={setActiveTab}
              onOpenAddCategory={() => {
                setActiveTab('categories');
                setIsAddCategoryOpen(true);
              }}
              onOpenAddFoodItem={() => {
                setActiveTab('food-items');
                setIsAddFoodItemOpen(true);
              }}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryManagement
              categories={categories}
              foodItems={foodItems}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onNavigateToFoodItemsWithCategory={handleNavigateToFoodItemsWithCategory}
              isAddModalOpen={isAddCategoryOpen}
              onCloseAddModal={() => setIsAddCategoryOpen(false)}
            />
          )}

          {activeTab === 'food-items' && (
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
          )}

          {activeTab === 'profile' && (
            <BusinessProfileView
              business={business}
              onUpdateBusiness={handleUpdateBusiness}
            />
          )}
        </main>
      </div>

      {/* Toast feedback notifications */}
      {toastMessage && (
        <AdminToast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
