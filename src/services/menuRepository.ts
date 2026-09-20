import { BusinessProfile, Category, FoodItem, DietaryFilter } from '../types/menu';
import { adminAuth } from './adminAuth';

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface IMenuRepository {
  getBusinessProfile(): Promise<BusinessProfile>;
  updateBusinessProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile>;

  getCategories(includeInactive?: boolean): Promise<Category[]>;
  getCategory(id: string): Promise<Category | null>;
  createCategory(data: Omit<Category, 'id' | 'itemCount'>): Promise<Category>;
  addCategory(data: Omit<Category, 'id' | 'itemCount'>): Promise<Category>;
  updateCategory(id: string, data: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<DeleteResult>;

  getFoodItems(): Promise<FoodItem[]>;
  getFoodItem(id: string): Promise<FoodItem | null>;
  getPopularFoodItems(): Promise<FoodItem[]>;
  getFoodItemsByCategory(categoryId: string): Promise<FoodItem[]>;
  searchFoodItems(query: string, dietaryFilter?: DietaryFilter): Promise<FoodItem[]>;
  createFoodItem(data: Omit<FoodItem, 'id' | 'finalPrice'>): Promise<FoodItem>;
  addFoodItem(data: Omit<FoodItem, 'id' | 'finalPrice'>): Promise<FoodItem>;
  updateFoodItem(id: string, data: Partial<FoodItem>): Promise<FoodItem>;
  deleteFoodItem(id: string): Promise<DeleteResult>;

  subscribe(listener: () => void): () => void;
}

const STORAGE_KEYS = {
  PROFILE: 'kp_stored_business_profile',
  CATEGORIES: 'kp_stored_categories',
  FOOD_ITEMS: 'kp_stored_food_items',
};

const DEFAULT_PROFILE: BusinessProfile = {
  id: 'kings-platter-sivakasi',
  name: "KING'S PLATTER",
  subName: 'RESTAURANT',
  tagline: 'Great Food | Royal Experience',
  location: 'Sivakasi',
  address: 'Housing Board, Srivilliputhur Main Rd, opposite to Abdul Kalam Library, Sivakasi, Tamil Nadu',
  phone: '+91 89259 54227',
  email: 'info@kingsplatter.com',
  whatsapp: '+918925954227',
  mapUrl: 'https://share.google/xkdrn68kXF2LODuKo',
  openingHours: '11:30 AM - 11:00 PM (All 7 Days)',
  currency: '₹',
  logoUrl: '/kings_platter_logo.jpg',
};

export class PersistentMenuRepository implements IMenuRepository {
  private businessProfile: BusinessProfile;
  private categories: Category[] = [];
  private foodItems: FoodItem[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    try {
      const savedProfile = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.PROFILE) : null;
      this.businessProfile = savedProfile ? JSON.parse(savedProfile) : { ...DEFAULT_PROFILE };
    } catch {
      this.businessProfile = { ...DEFAULT_PROFILE };
    }

    try {
      const savedCategories = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CATEGORIES) : null;
      this.categories = savedCategories ? JSON.parse(savedCategories) : [];
    } catch {
      this.categories = [];
    }

    try {
      const savedFoodItems = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS) : null;
      this.foodItems = savedFoodItems ? JSON.parse(savedFoodItems) : [];
    } catch {
      this.foodItems = [];
    }
  }

  private saveCacheOnly() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(this.businessProfile));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(this.foodItems));
    } catch (e) {
      console.warn('Failed to update local cache:', e);
    }
  }

  private persist() {
    this.saveCacheOnly();
    this.notify();
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Error notifying listener:', err);
      }
    });
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = adminAuth.getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private checkAuthError(status: number, resData: { error?: { code?: string; message?: string } }) {
    if (status === 401 || resData.error?.code === 'SESSION_EXPIRED') {
      adminAuth.notifySessionExpired();
      throw new Error('Your session has expired. Please sign in again.');
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // --- Business Profile ---
  async getBusinessProfile(): Promise<BusinessProfile> {
    try {
      const res = await fetch('/api/business');
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        this.businessProfile = data.data;
        this.saveCacheOnly();
        return { ...this.businessProfile };
      }
    } catch {
      // fallback to cached
    }
    return { ...this.businessProfile };
  }

  async updateBusinessProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const res = await fetch('/api/business', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    this.checkAuthError(res.status, resData);

    if (!res.ok || !resData.success) {
      throw new Error(resData.error?.message || "We couldn't save your changes. Please try again.");
    }

    this.businessProfile = resData.data;
    this.persist();
    return { ...this.businessProfile };
  }

  // --- Categories ---
  async getCategories(includeInactive = false): Promise<Category[]> {
    try {
      const res = await fetch(`/api/categories?includeInactive=${includeInactive}`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        this.categories = data.data;
        this.saveCacheOnly();
      }
    } catch {
      // fallback to cached
    }

    const list = includeInactive
      ? [...this.categories]
      : this.categories.filter(c => c.isActive);

    const sorted = list.sort((a, b) => a.displayOrder - b.displayOrder);

    return sorted.map(cat => ({
      ...cat,
      itemCount: this.foodItems.filter(item => item.categoryId === cat.id).length
    }));
  }

  async getCategory(id: string): Promise<Category | null> {
    const categories = await this.getCategories(true);
    const cat = categories.find(c => c.id === id);
    if (!cat) return null;
    return {
      ...cat,
      itemCount: this.foodItems.filter(item => item.categoryId === cat.id).length
    };
  }

  async createCategory(data: Omit<Category, 'id' | 'itemCount'>): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    this.checkAuthError(res.status, resData);

    if (!res.ok || !resData.success) {
      throw new Error(resData.error?.message || "We couldn't save the category. Please try again.");
    }

    this.categories.push(resData.data);
    this.persist();
    return resData.data;
  }

  async addCategory(data: Omit<Category, 'id' | 'itemCount'>): Promise<Category> {
    return this.createCategory(data);
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    this.checkAuthError(res.status, resData);

    if (!res.ok || !resData.success) {
      throw new Error(resData.error?.message || "We couldn't save the category. Please try again.");
    }

    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = resData.data;
    }
    this.persist();
    return resData.data;
  }

  async deleteCategory(id: string): Promise<DeleteResult> {
    const associatedItems = this.foodItems.filter(item => item.categoryId === id);
    if (associatedItems.length > 0) {
      return {
        success: false,
        error: `Cannot delete this category because it contains ${associatedItems.length} food item(s). Please move or delete those food items first.`
      };
    }

    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    const resData = await res.json();
    this.checkAuthError(res.status, resData);

    if (!res.ok || !resData.success) {
      return {
        success: false,
        error: resData.error?.message || "We couldn't delete this category. Please try again.",
      };
    }

    this.categories = this.categories.filter(c => c.id !== id);
    this.persist();
    return { success: true };
  }

  // --- Food Items ---
  async getFoodItems(): Promise<FoodItem[]> {
    try {
      const res = await fetch('/api/food-items');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        this.foodItems = data.data;
        this.saveCacheOnly();
      }
    } catch {
      // fallback
    }
    return [...this.foodItems].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getFoodItem(id: string): Promise<FoodItem | null> {
    const items = await this.getFoodItems();
    const item = items.find(f => f.id === id);
    return item ? { ...item } : null;
  }

  async getPopularFoodItems(): Promise<FoodItem[]> {
    const items = await this.getFoodItems();
    return items
      .filter(item => item.isPopular && item.isAvailable)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getFoodItemsByCategory(categoryId: string): Promise<FoodItem[]> {
    const items = await this.getFoodItems();
    return items
      .filter(item => item.categoryId === categoryId && item.isAvailable)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async searchFoodItems(query: string, dietaryFilter: DietaryFilter = 'all'): Promise<FoodItem[]> {
    const items = await this.getFoodItems();
    const cleanQuery = query.trim().toLowerCase();

    return items.filter(item => {
      if (dietaryFilter === 'veg' && item.dietary !== 'veg' && item.dietary !== 'vegan') {
        return false;
      }
      if (dietaryFilter === 'non-veg' && item.dietary !== 'non-veg') {
        return false;
      }
      if (dietaryFilter === 'popular' && !item.isPopular) {
        return false;
      }

      if (!cleanQuery) return true;

      const matchesName = item.name.toLowerCase().includes(cleanQuery);
      const matchesDesc = (item.description || '').toLowerCase().includes(cleanQuery);
      const matchesCategory = (item.categoryName || '').toLowerCase().includes(cleanQuery);
      const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(cleanQuery)) || false;

      return matchesName || matchesDesc || matchesCategory || matchesTags;
    });
  }

  async createFoodItem(data: Omit<FoodItem, 'id' | 'finalPrice'>): Promise<FoodItem> {
    const res = await fetch('/api/food-items', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    this.checkAuthError(res.status, resData);

    if (!res.ok || !resData.success) {
      throw new Error(resData.error?.message || "We couldn't save the food item. Please try again.");
    }

    this.foodItems.push(resData.data);
    this.persist();
    return resData.data;
  }

  async addFoodItem(data: Omit<FoodItem, 'id' | 'finalPrice'>): Promise<FoodItem> {
    return this.createFoodItem(data);
  }

  async updateFoodItem(id: string, data: Partial<FoodItem>): Promise<FoodItem> {
    const res = await fetch(`/api/food-items/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    this.checkAuthError(res.status, resData);

    if (!res.ok || !resData.success) {
      throw new Error(resData.error?.message || "We couldn't save the food item. Please try again.");
    }

    const index = this.foodItems.findIndex(f => f.id === id);
    if (index !== -1) {
      this.foodItems[index] = resData.data;
    }
    this.persist();
    return resData.data;
  }

  async deleteFoodItem(id: string): Promise<DeleteResult> {
    const res = await fetch(`/api/food-items/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    const resData = await res.json();
    this.checkAuthError(res.status, resData);

    if (!res.ok || !resData.success) {
      return { success: false, error: resData.error?.message || "We couldn't delete this food item. Please try again." };
    }

    this.foodItems = this.foodItems.filter(f => f.id !== id);
    this.persist();
    return { success: true };
  }
}

export const menuRepository: IMenuRepository = new PersistentMenuRepository();
