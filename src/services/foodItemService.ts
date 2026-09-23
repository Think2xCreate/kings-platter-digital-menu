import { QueryDocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
import { serverDb, hasAdminCredentials } from '../lib/firebase/admin-firestore';
import { FoodItem } from '../types/menu';

export const foodItemService = {
  async getAllFoodItems(): Promise<FoodItem[]> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    const snapshot = await serverDb.collection('foodItems').get();
    const items: FoodItem[] = [];
    snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      items.push({ id: doc.id, ...doc.data() } as FoodItem);
    });
    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getFoodItemById(id: string): Promise<FoodItem | null> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    const doc = await serverDb.collection('foodItems').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as FoodItem;
  },

  async createFoodItem(data: Omit<FoodItem, 'id' | 'finalPrice'>): Promise<FoodItem> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    const id = `food-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    
    const price = Number(data.price);
    const discount = Number(data.discountPercentage || 0);
    const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

    const newItem: FoodItem = {
      ...data,
      id,
      price,
      discountPercentage: discount,
      finalPrice,
      displayOrder: data.displayOrder ?? 1,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await serverDb.collection('foodItems').doc(id).set(newItem);
    return newItem;
  },

  async updateFoodItem(id: string, data: Partial<FoodItem>): Promise<FoodItem> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    const current = await this.getFoodItemById(id);
    if (!current) {
      throw new Error(`Food item with ID ${id} not found`);
    }

    const price = data.price !== undefined ? Number(data.price) : current.price;
    const discount = data.discountPercentage !== undefined ? Number(data.discountPercentage) : (current.discountPercentage || 0);
    const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

    const updatedData = {
      ...data,
      price,
      discountPercentage: discount,
      finalPrice,
      updatedAt: new Date().toISOString(),
    };

    await serverDb.collection('foodItems').doc(id).update(updatedData);
    const updated = await this.getFoodItemById(id);
    return updated || { ...current, ...updatedData };
  },

  async deleteFoodItem(id: string): Promise<{ success: boolean; error?: string }> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    try {
      await serverDb.collection('foodItems').doc(id).delete();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete food item.';
      return { success: false, error: message };
    }
  },
};

