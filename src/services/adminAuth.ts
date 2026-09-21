import { signInWithEmailAndPassword, signOut, onAuthStateChanged, onIdTokenChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase/client';

export interface AdminUser {
  id: string;
  uid?: string;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
}

const AUTH_STORAGE_KEY = 'kp_admin_auth_user';
const TOKEN_STORAGE_KEY = 'kp_admin_auth_token';

let sessionExpiredCallback: (() => void) | null = null;

export const adminAuth = {
  onSessionExpired(callback: () => void) {
    sessionExpiredCallback = callback;
  },

  notifySessionExpired() {
    this.logout();
    if (sessionExpiredCallback) {
      sessionExpiredCallback();
    }
  },

  getStoredUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  },

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  async getFreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    if (auth.currentUser) {
      try {
        const freshToken = await auth.currentUser.getIdToken();
        if (freshToken) {
          const isLocal = !!localStorage.getItem(TOKEN_STORAGE_KEY);
          const storage = isLocal ? localStorage : sessionStorage;
          storage.setItem(TOKEN_STORAGE_KEY, freshToken);
          return freshToken;
        }
      } catch (err) {
        console.warn('[adminAuth] Failed to fetch fresh token from auth:', err);
      }
    }
    return this.getStoredToken();
  },

  getCurrentUser(): AdminUser | null {
    return this.getStoredUser();
  },

  isAuthenticated(): boolean {
    return !!this.getStoredUser() && !!auth.currentUser;
  },

  async login(identifier: string, password: string, rememberMe = true): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    if (!identifier || !identifier.trim()) {
      return { success: false, error: 'Please enter your admin email.' };
    }
    if (!password || password.trim().length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const email = identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@kingsplatter.com`;

    try {
      let idToken: string;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        idToken = await userCredential.user.getIdToken(true);
      } catch (clientAuthErr: unknown) {
        const authMsg = clientAuthErr instanceof Error ? clientAuthErr.message : 'Authentication failed';
        if (
          authMsg.includes('auth/invalid-credential') ||
          authMsg.includes('auth/user-not-found') ||
          authMsg.includes('auth/wrong-password') ||
          authMsg.includes('auth/invalid-email')
        ) {
          return { success: false, error: 'Invalid email or password.' };
        }
        return { success: false, error: authMsg || 'Firebase authentication failed.' };
      }

      // Verify token & Firestore admin document with server API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        await signOut(auth);
        return {
          success: false,
          error: resData.error?.message || 'Admin authentication failed.',
        };
      }

      const user: AdminUser = {
        id: resData.data.user.uid,
        uid: resData.data.user.uid,
        name: resData.data.user.name || 'Admin',
        role: resData.data.user.role || 'Admin',
        email: resData.data.user.email || email,
      };

      const token = resData.data.token;

      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      }

      return { success: true, user };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Server communication error during login.';
      return { success: false, error: msg };
    }
  },

  async logout(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      await signOut(auth).catch(() => {});
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {
      // ignore
    }
  },

  initAuthListener(onAuthUpdate?: (user: User | null) => void) {
    if (typeof window === 'undefined') return () => {};

    const unsubIdToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const newToken = await firebaseUser.getIdToken();
          const storage = localStorage.getItem(TOKEN_STORAGE_KEY) ? localStorage : sessionStorage;
          storage.setItem(TOKEN_STORAGE_KEY, newToken);
        } catch {
          this.notifySessionExpired();
        }
      } else {
        if (this.getStoredUser()) {
          this.notifySessionExpired();
        }
      }
      if (onAuthUpdate) onAuthUpdate(firebaseUser);
    });

    return unsubIdToken;
  }
};


