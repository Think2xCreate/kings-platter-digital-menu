import { serverDb, hasAdminCredentials } from '../lib/firebase/admin-firestore';
import { BusinessProfile } from '../types/menu';

export const businessService = {
  async getBusinessProfile(): Promise<BusinessProfile | null> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    let doc = await serverDb.collection('businessProfile').doc('kings-platter-sivakasi').get();
    if (!doc.exists) {
      doc = await serverDb.collection('businessProfile').doc('kings-platter-tirunelveli').get();
    }
    if (!doc.exists) {
      const snap = await serverDb.collection('businessProfile').limit(1).get();
      if (!snap.empty) {
        doc = snap.docs[0];
      }
    }

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as BusinessProfile;
  },

  async updateBusinessProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile | null> {
    if (!hasAdminCredentials()) {
      throw new Error('Firebase Admin credentials not configured on server.');
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    let docRef = serverDb.collection('businessProfile').doc('kings-platter-sivakasi');
    const existingSnap = await serverDb.collection('businessProfile').limit(1).get();
    if (!existingSnap.empty) {
      docRef = existingSnap.docs[0].ref;
    }

    await docRef.set(updateData, { merge: true });
    return this.getBusinessProfile();
  },
};
