import { serverDb, hasAdminCredentials } from '../lib/firebase/server';
import { BusinessProfile } from '../types/menu';
import { seedInitialDataIfEmpty } from './seedService';

export const businessService = {
  async getBusinessProfile(): Promise<BusinessProfile> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    await seedInitialDataIfEmpty();
    const doc = await serverDb.collection('businessProfile').doc('kings-platter-tirunelveli').get();
    if (!doc.exists) {
      throw new Error('Business profile document not found in Firestore.');
    }
    return { id: doc.id, ...doc.data() } as BusinessProfile;
  },

  async updateBusinessProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await serverDb.collection('businessProfile').doc('kings-platter-tirunelveli').set(updateData, { merge: true });
    return this.getBusinessProfile();
  },
};

