import { serverDb, hasAdminCredentials } from '../lib/firebase/server';
import { mockBusinessProfile, mockCategories, mockFoodItems } from '../data/mock-menu';

let isSeedingPerformed = false;

function sanitizeImage(url?: string): string {
  if (!url || url.includes('unsplash.com') || url.includes('pexels.com')) {
    return '';
  }
  return url;
}

export async function seedInitialDataIfEmpty() {
  if (isSeedingPerformed) return;
  if (!hasAdminCredentials()) {
    isSeedingPerformed = true;
    return;
  }

  try {
    const profileRef = serverDb.collection('businessProfile').doc('kings-platter-tirunelveli');
    const profileSnap = await profileRef.get();

    if (!profileSnap.exists) {
      await profileRef.set({
        ...mockBusinessProfile,
        logoUrl: sanitizeImage(mockBusinessProfile.logoUrl) || '/kings_platter_logo.jpg',
        instagram: '',
        facebook: '',
        website: '',
        whatsappNumber: '+91 98765 43210',
        whatsapp: 'https://wa.me/919876543210',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const categoriesSnap = await serverDb.collection('categories').limit(1).get();
    if (categoriesSnap.empty) {
      const batch = serverDb.batch();
      for (const cat of mockCategories) {
        const docRef = serverDb.collection('categories').doc(cat.id);
        batch.set(docRef, {
          ...cat,
          imageUrl: sanitizeImage(cat.imageUrl),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      await batch.commit();
    }

    const foodSnap = await serverDb.collection('foodItems').limit(1).get();
    if (foodSnap.empty) {
      for (let i = 0; i < mockFoodItems.length; i += 400) {
        const batch = serverDb.batch();
        const chunk = mockFoodItems.slice(i, i + 400);
        for (const item of chunk) {
          const docRef = serverDb.collection('foodItems').doc(item.id);
          batch.set(docRef, {
            ...item,
            imageUrl: sanitizeImage(item.imageUrl),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        await batch.commit();
      }
    }
    isSeedingPerformed = true;
  } catch (error) {
    console.warn('Skipping automatic Firestore seed check:', error);
    isSeedingPerformed = true;
  }
}


