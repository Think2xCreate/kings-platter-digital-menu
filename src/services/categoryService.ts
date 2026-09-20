import { Query, QueryDocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
import { serverDb, hasAdminCredentials } from '../lib/firebase/server';
import { Category } from '../types/menu';

export const categoryService = {
  async getAllCategories(includeInactive = false): Promise<Category[]> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    let query: Query = serverDb.collection('categories');
    if (!includeInactive) {
      query = query.where('isActive', '==', true);
    }
    
    const snapshot = await query.get();
    const categories: Category[] = [];

    snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });

    categories.sort((a, b) => a.displayOrder - b.displayOrder);

    const foodSnap = await serverDb.collection('foodItems').select('categoryId').get();
    const categoryCounts = new Map<string, number>();
    foodSnap.docs.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
      const catId = d.data().categoryId;
      if (catId) {
        categoryCounts.set(catId, (categoryCounts.get(catId) || 0) + 1);
      }
    });

    return categories.map(cat => ({
      ...cat,
      itemCount: categoryCounts.get(cat.id) || 0,
    }));
  },

  async getCategoryById(id: string): Promise<Category | null> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    const doc = await serverDb.collection('categories').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Category;
  },

  async createCategory(data: Omit<Category, 'id' | 'itemCount'>): Promise<Category> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    const id = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCategory: Category = {
      ...data,
      id,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      iconName: data.iconName || 'Soup',
      displayOrder: data.displayOrder ?? 1,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await serverDb.collection('categories').doc(id).set(newCategory);
    return { ...newCategory, itemCount: 0 };
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await serverDb.collection('categories').doc(id).update(updateData);
    
    if (data.name) {
      const foodSnap = await serverDb.collection('foodItems').where('categoryId', '==', id).get();
      if (!foodSnap.empty) {
        const batch = serverDb.batch();
        foodSnap.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          batch.update(doc.ref, { categoryName: data.name });
        });
        await batch.commit();
      }
    }

    const updated = await this.getCategoryById(id);
    if (!updated) {
      throw new Error(`Category with ID ${id} not found.`);
    }
    return updated;
  },

  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    try {
      const foodSnap = await serverDb.collection('foodItems').where('categoryId', '==', id).get();
      if (!foodSnap.empty) {
        return {
          success: false,
          error: `Cannot delete category because it contains ${foodSnap.size} food item(s). Please reassign or remove them first.`,
        };
      }

      await serverDb.collection('categories').doc(id).delete();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete category.';
      return { success: false, error: message };
    }
  },
};

