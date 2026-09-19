'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminAuth, AdminUser } from '@/services/adminAuth';
import { menuRepository } from '@/services/menuRepository';
import { Category, FoodItem, BusinessProfile } from '@/types/menu';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminMobileDrawer } from '@/components/admin/AdminMobileDrawer';
import { BrandLoader } from '@/components/common/BrandLoader';
import { AdminToast } from '@/components/admin/AdminToast';

export interface AdminContextType {
  business: BusinessProfile | null;
  categories: Category[];
  foodItems: FoodItem[];
  isLoadingData: boolean;
  loadData: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  handleCreateCategory: (data: Omit<Category, 'id' | 'itemCount'>) => Promise<void>;
  handleUpdateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  handleDeleteCategory: (id: string) => Promise<void>;
  handleCreateFoodItem: (data: Omit<FoodItem, 'id' | 'finalPrice'>) => Promise<void>;
  handleUpdateFoodItem: (id: string, data: Partial<FoodItem>) => Promise<void>;
  handleDeleteFoodItem: (id: string) => Promise<void>;
  handleUpdateBusiness: (data: Partial<BusinessProfile>) => Promise<void>;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (catId: string) => void;
  isAddCategoryOpen: boolean;
  setIsAddCategoryOpen: (open: boolean) => void;
  isAddFoodItemOpen: boolean;
  setIsAddFoodItemOpen: (open: boolean) => void;
  handleNavigateTab: (tab: AdminTab) => void;
}

export const AdminContext = React.createContext<AdminContextType>({
  business: null,
  categories: [],
  foodItems: [],
  isLoadingData: true,
  loadData: async () => {},
  showToast: () => {},
  handleCreateCategory: async () => {},
  handleUpdateCategory: async () => {},
  handleDeleteCategory: async () => {},
  handleCreateFoodItem: async () => {},
  handleUpdateFoodItem: async () => {},
  handleDeleteFoodItem: async () => {},
  handleUpdateBusiness: async () => {},
  selectedCategoryFilter: 'all',
  setSelectedCategoryFilter: () => {},
  isAddCategoryOpen: false,
  setIsAddCategoryOpen: () => {},
  isAddFoodItemOpen: false,
  setIsAddFoodItemOpen: () => {},
  handleNavigateTab: () => {},
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Quick Action Modal states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddFoodItemOpen, setIsAddFoodItemOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
  }, []);

  // Compute active tab from pathname
  const activeTab: AdminTab = useMemo(() => {
    if (pathname?.includes('/admin/categories')) return 'categories';
    if (pathname?.includes('/admin/food-items')) return 'food-items';
    if (pathname?.includes('/admin/business-profile')) return 'profile';
    return 'dashboard';
  }, [pathname]);

  const handleNavigateTab = useCallback((tab: AdminTab) => {
    if (tab === 'dashboard') router.push('/admin');
    else if (tab === 'categories') router.push('/admin/categories');
    else if (tab === 'food-items') router.push('/admin/food-items');
    else if (tab === 'profile') router.push('/admin/business-profile');
  }, [router]);

  // Auth verification & session expiration listener
  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsCheckingAuth(false);
      return;
    }

    const unsubListener = adminAuth.initAuthListener((firebaseUser) => {
      if (!firebaseUser && !adminAuth.getStoredUser()) {
        router.replace('/admin/login');
      } else {
        setCurrentUser(adminAuth.getCurrentUser());
        setIsCheckingAuth(false);
      }
    });

    adminAuth.onSessionExpired(() => {
      setCurrentUser(null);
      router.replace('/admin/login?expired=true');
    });

    if (!adminAuth.getStoredUser()) {
      router.replace('/admin/login');
    } else {
      setCurrentUser(adminAuth.getCurrentUser());
      setIsCheckingAuth(false);
    }

    return () => {
      unsubListener();
    };
  }, [pathname, router]);

  // Data loading handler with 401/403 unauthorized handling
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
    } catch (error: unknown) {
      console.error('Failed to load admin data:', error);
      if (error instanceof Error && (error.message.includes('UNAUTHORIZED') || error.message.includes('401') || error.message.includes('403'))) {
        adminAuth.notifySessionExpired();
      }
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    loadData();
    const unsubscribe = menuRepository.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [pathname, loadData]);

  const handleLogout = useCallback(() => {
    adminAuth.logout();
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
    router.push('/admin/login');
  }, [router, showToast]);

  const handleReturnToCustomer = useCallback(() => {
    router.push('/menu/kings-platter');
  }, [router]);

  // CRUD handlers
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
    const res = await menuRepository.deleteCategory(id);
    if (!res.success) {
      showToast(res.error || 'Failed to delete category.', 'error');
      return;
    }
    await loadData();
    showToast('Category deleted successfully.', 'info');
  };

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
    const res = await menuRepository.deleteFoodItem(id);
    if (!res.success) {
      showToast(res.error || 'Failed to delete food item.', 'error');
      return;
    }
    await loadData();
    showToast('Food item deleted.', 'info');
  };

  const handleUpdateBusiness = async (data: Partial<BusinessProfile>) => {
    await menuRepository.updateBusinessProfile(data);
    await loadData();
    showToast('Business profile updated successfully!', 'success');
  };

  // If on login route, render login page directly without layout shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Auth checking state
  if (isCheckingAuth) {
    return (
      <BrandLoader
        isLoading={true}
        variant="admin"
        restaurantName="KING'S PLATTER"
        subName="ADMIN PORTAL"
      />
    );
  }

  const contextValue: AdminContextType = {
    business,
    categories,
    foodItems,
    isLoadingData,
    loadData,
    showToast,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleCreateFoodItem,
    handleUpdateFoodItem,
    handleDeleteFoodItem,
    handleUpdateBusiness,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    isAddCategoryOpen,
    setIsAddCategoryOpen,
    isAddFoodItemOpen,
    setIsAddFoodItemOpen,
    handleNavigateTab,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-row">
        {/* Desktop Sidebar (Persistent) */}
        <div className="hidden md:block">
          <AdminSidebar
            activeTab={activeTab}
            logoUrl={business?.logoUrl}
            onSelectTab={handleNavigateTab}
            onLogout={handleLogout}
            onViewCustomerMenu={handleReturnToCustomer}
          />
        </div>

        {/* Mobile Slide-in Drawer */}
        <AdminMobileDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          activeTab={activeTab}
          logoUrl={business?.logoUrl}
          onSelectTab={(tab) => {
            setIsMobileDrawerOpen(false);
            handleNavigateTab(tab);
          }}
          onLogout={handleLogout}
          onViewCustomerMenu={handleReturnToCustomer}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            user={currentUser}
            logoUrl={business?.logoUrl}
            onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
            onViewCustomerMenu={handleReturnToCustomer}
            onLogout={handleLogout}
          />

          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {children}
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
    </AdminContext.Provider>
  );
}
