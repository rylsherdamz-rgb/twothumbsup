import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  userId: string | null;
  userRole: 'admin' | 'member' | null;
  setAuth: (userId: string, role: 'admin' | 'member') => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      userRole: null,
      setAuth: (userId, role) => set({ isAuthenticated: true, userId, userRole: role }),
      clearAuth: () => set({ isAuthenticated: false, userId: null, userRole: null }),
    }),
    { name: 'auth-storage' }
  )
);

interface UIStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui-storage' }
  )
);