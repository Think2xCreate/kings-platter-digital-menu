'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname, notFound } from 'next/navigation';
import { menuRepository } from '../../services/menuRepository';
import { BusinessProfile, Category, FoodItem, DietaryFilter } from '../../types/menu';
import { BusinessHeader } from '../layout/BusinessHeader';
import { HeroFoodBanner } from './HeroFoodBanner';
import { CategoryNavigation } from './CategoryNavigation';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { CategorySection } from './CategorySection';
import { CategoryDedicatedView } from './CategoryDedicatedView';
import { FoodDetailModal } from './FoodDetailModal';
import { ShowcaseMenuDrawer } from './ShowcaseMenuDrawer';
import { CartTrayDrawer } from './CartTrayDrawer';
import { MobileBottomNav } from '../layout/MobileBottomNav';
import { MobileSearchModal } from './MobileSearchModal';
import { GoogleReviewModal } from '../common/GoogleReviewModal';
import { AboutModal } from './AboutModal';
import { BrandLoader } from '../common/BrandLoader';
import { EmptySearchState, ErrorState } from './MenuStates';

interface CustomerMenuViewProps {
  initialCategorySlug?: string;
  initialFoodSlug?: string;
}

export function CustomerMenuView({ initialCategorySlug, initialFoodSlug }: CustomerMenuViewProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBrandLoaderFinished, setIsBrandLoaderFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'menu' | 'about'>('menu');
  const [mobileActiveTab, setMobileActiveTab] = useState<'home' | 'menu' | 'search' | 'cart' | 'review'>('home');

  const [selectedItems, setSelectedItems] = useState<FoodItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('kp_selected_dishes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const selectedIds = useMemo(() => {
    return new Set(selectedItems.map((item) => item.id));
  }, [selectedItems]);

  const handleToggleSelect = useCallback((item: FoodItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      const next = exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
      try {
        localStorage.setItem('kp_selected_dishes', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleRemoveSelectedItem = useCallback((foodId: string) => {
    setSelectedItems((prev) => {
      const next = prev.filter((i) => i.id !== foodId);
      try {
        localStorage.setItem('kp_selected_dishes', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleClearAllSelected = useCallback(() => {
    setSelectedItems([]);
    try {
      localStorage.removeItem('kp_selected_dishes');
    } catch {
      // ignore
    }
  }, []);

  const loadMenuData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [businessData, categoriesData, foodData] = await Promise.all([
        menuRepository.getBusinessProfile(),
        menuRepository.getCategories(),
        menuRepository.getFoodItems()
      ]);

      setBusiness(businessData);
      const safeCats = Array.isArray(categoriesData) ? categoriesData : [];
      const safeFoods = Array.isArray(foodData) ? foodData : [];

      setCategories(safeCats);
      setFoodItems(safeFoods);

      // Handle initial category route if provided
      if (initialCategorySlug) {
        const matchedCat = safeCats.find(c => c.slug === initialCategorySlug || c.id === initialCategorySlug);
        if (matchedCat) {
          setActiveCategoryId(matchedCat.id);
        } else {
          notFound();
        }
      }

      // Handle initial food route if provided
      if (initialFoodSlug) {
        const matchedFood = safeFoods.find(f => (f.id === initialFoodSlug || f.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === initialFoodSlug));
        if (matchedFood) {
          setSelectedFoodItem(matchedFood);
        } else {
          notFound();
        }
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'digest' in err && (err as { digest?: string }).digest?.includes('NEXT_NOT_FOUND')) {
        throw err;
      }
      setError('We could not load the digital menu. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [initialCategorySlug, initialFoodSlug]);

  useEffect(() => {
    loadMenuData();
    const unsubscribe = menuRepository.subscribe(() => {
      loadMenuData();
    });
    return () => unsubscribe();
  }, [loadMenuData]);

  const handleSelectCategory = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
    window.scrollTo({ top: 0, behavior: 'instant' });

    const targetCat = categories.find(c => c.id === categoryId);
    if (targetCat && targetCat.slug) {
      window.history.replaceState(null, '', `/menu/kings-platter/category/${targetCat.slug}`);
    } else if (categoryId === 'all') {
      window.history.replaceState(null, '', `/menu/kings-platter`);
    }
  }, [categories]);

  const handleSelectFoodItem = useCallback((item: FoodItem | null) => {
    setSelectedFoodItem(item);
    if (item) {
      const foodSlug = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      window.history.pushState(null, '', `/menu/kings-platter/food/${foodSlug || item.id}`);
    } else {
      if (activeCategoryId !== 'all') {
        const targetCat = categories.find(c => c.id === activeCategoryId);
        if (targetCat && targetCat.slug) {
          window.history.replaceState(null, '', `/menu/kings-platter/category/${targetCat.slug}`);
        } else {
          window.history.replaceState(null, '', `/menu/kings-platter`);
        }
      } else {
        window.history.replaceState(null, '', `/menu/kings-platter`);
      }
    }
  }, [categories, activeCategoryId]);

  const filteredFoodItems = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    const safeItems = Array.isArray(foodItems) ? foodItems : [];

    return safeItems.filter(item => {
      if (dietaryFilter === 'veg' && item.dietary !== 'veg' && item.dietary !== 'vegan') {
        return false;
      }
      if (dietaryFilter === 'non-veg' && item.dietary !== 'non-veg') {
        return false;
      }
      if (dietaryFilter === 'special' && !item.isChefSpecial) {
        return false;
      }
      if (dietaryFilter === 'popular' && !item.isPopular) {
        return false;
      }

      if (activeCategoryId !== 'all' && item.categoryId !== activeCategoryId) {
        return false;
      }

      if (!cleanQuery) return true;

      const nameMatch = item.name.toLowerCase().includes(cleanQuery);
      const descMatch = (item.description || '').toLowerCase().includes(cleanQuery);
      const categoryMatch = (item.categoryName || '').toLowerCase().includes(cleanQuery);

      return nameMatch || descMatch || categoryMatch;
    });
  }, [foodItems, searchQuery, dietaryFilter, activeCategoryId]);

  const popularItems = useMemo(() => {
    const safeItems = Array.isArray(foodItems) ? foodItems : [];
    return safeItems.filter(item => item.isPopular);
  }, [foodItems]);

  const currentCategory = useMemo(() => {
    if (activeCategoryId === 'all') return null;
    return categories.find(c => c.id === activeCategoryId) || null;
  }, [categories, activeCategoryId]);

  const groupedSections = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];
    
    return categories
      .map(cat => {
        const items = filteredFoodItems.filter(item => item.categoryId === cat.id);
        return {
          category: cat,
          items
        };
      })
      .filter(group => group.items.length > 0);
  }, [categories, filteredFoodItems]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error && isBrandLoaderFinished) {
    return (
      <div className="min-h-screen bg-[#0D0D10] text-[#E8E8ED] flex flex-col justify-between">
        <header className="h-16 sm:h-20 bg-[#0E0E11] border-b border-[#222228] flex items-center px-6">
          <span className="font-royal font-bold text-white text-lg">KING'S PLATTER</span>
        </header>
        <ErrorState onRetry={loadMenuData} message={error || undefined} />
        <div className="h-12" />
      </div>
    );
  }

  return (
    <>
      {!isBrandLoaderFinished && (
        <BrandLoader
          isLoading={isLoading}
          variant="customer"
          restaurantName={business?.name || "KING'S PLATTER"}
          subName={business?.subName || "RESTAURANT & CAFE"}
          tagline={business?.tagline || "Great Food · Royal Experience"}
          error={error}
          onRetry={loadMenuData}
          onExitComplete={() => setIsBrandLoaderFinished(true)}
        />
      )}

      {business ? (
        <div className="min-h-screen bg-[#0D0D10] text-[#E8E8ED] flex flex-col selection:bg-[#E5A93C]/30 selection:text-[#FBBF24]">
          <BusinessHeader
            business={business}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenAboutModal={() => setIsAboutOpen(true)}
            activeNavTab={activeNavTab}
            onNavTabChange={(tab) => {
              setActiveNavTab(tab);
              if (tab === 'home') {
                handleSelectCategory('all');
                setSearchQuery('');
                setDietaryFilter('all');
                scrollToTop();
              } else if (tab === 'about') {
                setIsAboutOpen(true);
              }
            }}
            onOpenShowcaseMenu={() => setIsShowcaseOpen(true)}
            cartCount={selectedItems.length}
            onOpenCart={() => setIsCartOpen(true)}
          />

          <main className="flex-1 w-full px-2 sm:px-4 lg:px-8 pt-3 sm:pt-6 pb-24 lg:pb-12">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
              
              <div className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-24 z-30 self-start">
                <div className="bg-[#131317] border border-[#24242C] rounded-2xl p-3 shadow-xl max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
                  <div className="px-3 py-2 border-b border-[#24242C] mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A0A0AD]">
                      Royal Menu
                    </span>
                    <span className="text-[10px] text-[#E5A93C] font-semibold bg-[#E5A93C]/10 px-2 py-0.5 rounded-full border border-[#E5A93C]/20">
                      {categories.length} Categories
                    </span>
                  </div>
                  <CategoryNavigation
                    variant="sidebar"
                    categories={categories}
                    activeCategoryId={activeCategoryId}
                    onSelectCategory={handleSelectCategory}
                    onOpenShowcaseMenu={() => setIsShowcaseOpen(true)}
                  />
                </div>
              </div>

              <div className="lg:col-span-9 xl:col-span-9">
                <div className="mb-4 sm:mb-6">
                  <SearchAndFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    dietaryFilter={dietaryFilter}
                    onDietaryFilterChange={setDietaryFilter}
                    totalResultsCount={filteredFoodItems.length}
                  />
                </div>

                {(searchQuery || dietaryFilter !== 'all') && (
                  <div className="flex items-center justify-between bg-[#17171D] px-4 py-2.5 rounded-xl border border-[#262630] mb-6 text-xs text-[#A2A2B0]">
                    <span>
                      Showing <strong className="text-white">{filteredFoodItems.length}</strong> {filteredFoodItems.length === 1 ? 'dish' : 'dishes'}
                      {searchQuery && <> for "<span className="text-[#E5A93C]">{searchQuery}</span>"</>}
                      {dietaryFilter !== 'all' && <> in <span className="text-[#E5A93C] capitalize">{dietaryFilter}</span></>}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setDietaryFilter('all');
                      }}
                      className="text-xs font-semibold text-[#E5A93C] hover:underline cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {filteredFoodItems.length === 0 && (
                  <EmptySearchState
                    query={searchQuery || (dietaryFilter !== 'all' ? dietaryFilter : 'selection')}
                    onReset={() => {
                      setSearchQuery('');
                      setDietaryFilter('all');
                      handleSelectCategory('all');
                    }}
                  />
                )}

                {activeCategoryId !== 'all' && currentCategory && filteredFoodItems.length > 0 && (
                  <CategoryDedicatedView
                    category={currentCategory}
                    categories={categories}
                    items={filteredFoodItems}
                    onBackToAll={() => handleSelectCategory('all')}
                    onSelectCategory={handleSelectCategory}
                    onSelectItem={handleSelectFoodItem}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                  />
                )}

                {activeCategoryId === 'all' && filteredFoodItems.length > 0 && (
                  <>
                    <div className="lg:hidden mb-4 sm:mb-6">
                      <CategoryNavigation
                        variant="horizontal"
                        categories={categories}
                        activeCategoryId={activeCategoryId}
                        onSelectCategory={handleSelectCategory}
                        onOpenShowcaseMenu={() => setIsShowcaseOpen(true)}
                      />
                    </div>

                    {!searchQuery && dietaryFilter === 'all' && (
                      <HeroFoodBanner
                        onExploreClick={() => {
                          const firstCat = document.querySelector('section[id^="category-"]');
                          if (firstCat) firstCat.scrollIntoView({ behavior: 'smooth' });
                        }}
                      />
                    )}

                    {!searchQuery && dietaryFilter === 'all' && popularItems.length > 0 && (
                      <CategorySection
                        id="popular-items"
                        title="Popular Items"
                        description="King's Platter royal customer favorites & chef signatures"
                        items={popularItems}
                        onSelectItem={handleSelectFoodItem}
                        selectedIds={selectedIds}
                        onToggleSelect={handleToggleSelect}
                        showViewAll={true}
                        onViewAll={() => setDietaryFilter('popular')}
                      />
                    )}

                    {groupedSections.map(({ category, items }) => (
                      <CategorySection
                        key={category.id}
                        id={`category-${category.id}`}
                        title={category.name}
                        description={category.description}
                        items={items}
                        onSelectItem={handleSelectFoodItem}
                        selectedIds={selectedIds}
                        onToggleSelect={handleToggleSelect}
                        showViewAll={true}
                        onViewAll={() => handleSelectCategory(category.id)}
                      />
                    ))}
                  </>
                )}

              </div>
            </div>
          </main>

          <FoodDetailModal
            item={selectedFoodItem}
            onClose={() => handleSelectFoodItem(null)}
            isSelected={selectedFoodItem ? selectedIds.has(selectedFoodItem.id) : false}
            onToggleSelect={handleToggleSelect}
          />

          <ShowcaseMenuDrawer
            isOpen={isShowcaseOpen}
            onClose={() => setIsShowcaseOpen(false)}
            categories={categories}
            foodItems={foodItems}
            activeCategoryId={activeCategoryId}
            onSelectCategory={(catId) => {
              handleSelectCategory(catId);
              setIsShowcaseOpen(false);
            }}
          />

          <CartTrayDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            selectedItems={selectedItems}
            onRemoveItem={handleRemoveSelectedItem}
            onClearAll={handleClearAllSelected}
            onOpenReview={() => setIsReviewModalOpen(true)}
          />

          <MobileSearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            foodItems={foodItems}
            categories={categories}
            onSelectItem={(item) => {
              setIsSearchModalOpen(false);
              handleSelectFoodItem(item);
            }}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />

          {business && (
            <GoogleReviewModal
              isOpen={isReviewModalOpen}
              onClose={() => setIsReviewModalOpen(false)}
              business={business}
            />
          )}

          <MobileBottomNav
            activeTab={mobileActiveTab}
            cartCount={selectedItems.length}
            hasReview={Boolean(business?.googleReviewUrl?.trim())}
            onTabChange={(tab) => {
              setMobileActiveTab(tab);
              if (tab === 'home') {
                handleSelectCategory('all');
                setSearchQuery('');
                setDietaryFilter('all');
                scrollToTop();
              } else if (tab === 'menu') {
                setIsShowcaseOpen(true);
              } else if (tab === 'search') {
                setIsSearchModalOpen(true);
              } else if (tab === 'cart') {
                setIsCartOpen(true);
              } else if (tab === 'review') {
                setIsReviewModalOpen(true);
              }
            }}
          />

          <AboutModal
            business={business}
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
          />
        </div>
      ) : null}
    </>
  );
}
