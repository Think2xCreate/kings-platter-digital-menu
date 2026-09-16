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
  id: 'kings-platter-tirunelveli',
  name: "KING'S PLATTER",
  subName: 'RESTAURANT & CAFE',
  tagline: 'Great Food | Royal Experience',
  location: 'Tirunelveli',
  address: 'No. 42, Royal Avenue, South Bypass Road, Tirunelveli, Tamil Nadu 627005',
  phone: '+91 98765 43210',
  email: 'info@kingsplatter.com',
  whatsapp: '+919876543210',
  mapUrl: 'https://maps.google.com/?q=Tirunelveli+Kings+Platter',
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
      // ignore network errors and fallback to cached
    }
    return { ...this.businessProfile };
  }

  async updateBusinessProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    try {
      const res = await fetch('/api/business', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success && resData.data) {
        this.businessProfile = resData.data;
        this.persist();
        return { ...this.businessProfile };
      }
    } catch {
      // ignore
    }

    this.businessProfile = { ...this.businessProfile, ...data };
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
      // ignore network failure
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
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success && resData.data) {
        this.categories.push(resData.data);
        this.persist();
        return resData.data;
      }
    } catch {
      // fallback
    }

    const newId = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCategory: Category = {
      ...data,
      id: newId,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      iconName: data.iconName || 'Soup',
      displayOrder: data.displayOrder ?? (this.categories.length + 1),
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    this.categories.push(newCategory);
    this.persist();
    return { ...newCategory, itemCount: 0 };
  }

  async addCategory(data: Omit<Category, 'id' | 'itemCount'>): Promise<Category> {
    return this.createCategory(data);
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success && resData.data) {
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = resData.data;
        }
        this.persist();
        return resData.data;
      }
    } catch {
      // fallback
    }

    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }

    const updated: Category = {
      ...this.categories[index],
      ...data,
    };

    if (data.name && data.name !== this.categories[index].name) {
      this.foodItems = this.foodItems.map(item => 
        item.categoryId === id ? { ...item, categoryName: data.name! } : item
      );
    }

    this.categories[index] = updated;
    this.persist();
    return {
      ...updated,
      itemCount: this.foodItems.filter(item => item.categoryId === id).length
    };
  }

  async deleteCategory(id: string): Promise<DeleteResult> {
    const associatedItems = this.foodItems.filter(item => item.categoryId === id);
    if (associatedItems.length > 0) {
      return {
        success: false,
        error: `Cannot delete this category because it contains ${associatedItems.length} food item(s). Please move or delete those food items first.`
      };
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return {
          success: false,
          error: resData.error?.message || 'Failed to delete category.',
        };
      }
    } catch {
      // fallback
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
    try {
      const res = await fetch('/api/food-items', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success && resData.data) {
        this.foodItems.push(resData.data);
        this.persist();
        return resData.data;
      }
    } catch {
      // fallback
    }

    const newId = `food-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const discount = data.discountPercentage || 0;
    const finalPrice = discount > 0 ? Math.round(data.price * (1 - discount / 100)) : data.price;

    const newItem: FoodItem = {
      ...data,
      id: newId,
      finalPrice,
      displayOrder: data.displayOrder ?? (this.foodItems.length + 1),
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    };

    this.foodItems.push(newItem);
    this.persist();
    return { ...newItem };
  }

  async addFoodItem(data: Omit<FoodItem, 'id' | 'finalPrice'>): Promise<FoodItem> {
    return this.createFoodItem(data);
  }

  async updateFoodItem(id: string, data: Partial<FoodItem>): Promise<FoodItem> {
    try {
      const res = await fetch(`/api/food-items/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success && resData.data) {
        const index = this.foodItems.findIndex(f => f.id === id);
        if (index !== -1) {
          this.foodItems[index] = resData.data;
        }
        this.persist();
        return resData.data;
      }
    } catch {
      // fallback
    }

    const index = this.foodItems.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error(`Food item with ID ${id} not found`);
    }

    const current = this.foodItems[index];
    const price = data.price !== undefined ? data.price : current.price;
    const discount = data.discountPercentage !== undefined ? data.discountPercentage : (current.discountPercentage || 0);
    const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

    const updated: FoodItem = {
      ...current,
      ...data,
      price,
      discountPercentage: discount,
      finalPrice,
    };

    this.foodItems[index] = updated;
    this.persist();
    return { ...updated };
  }

  async deleteFoodItem(id: string): Promise<DeleteResult> {
    try {
      const res = await fetch(`/api/food-items/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error?.message || 'Failed to delete food item.' };
      }
    } catch {
      // fallback
    }

    const initialLength = this.foodItems.length;
    this.foodItems = this.foodItems.filter(f => f.id !== id);

    if (this.foodItems.length === initialLength) {
      return { success: false, error: 'Food item not found.' };
    }

    this.persist();
    return { success: true };
  }
}

export const menuRepository: IMenuRepository = new PersistentMenuRepository();
