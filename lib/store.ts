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

interface EngagementStore {
  lastVisit: string | null;
  visitStreak: number;
  longestStreak: number;
  totalVisits: number;
  totalReadTime: number;
  postsRead: string[];
  updateVisit: () => void;
  addPostRead: (postId: string) => void;
  addReadTime: (minutes: number) => void;
}

export const useEngagementStore = create<EngagementStore>()(
  persist(
    (set, get) => ({
      lastVisit: null,
      visitStreak: 0,
      longestStreak: 0,
      totalVisits: 0,
      totalReadTime: 0,
      postsRead: [],
      updateVisit: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastVisit = get().lastVisit?.split('T')[0];
        
        if (lastVisit !== today) {
          let newStreak = get().visitStreak;
          
          if (lastVisit) {
            const lastDate = new Date(lastVisit);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
          } else {
            newStreak = 1;
          }
          
          set({
            lastVisit: new Date().toISOString(),
            visitStreak: newStreak,
            longestStreak: Math.max(newStreak, get().longestStreak),
            totalVisits: get().totalVisits + 1,
          });
        }
      },
      addPostRead: (postId) => {
        const postsRead = get().postsRead;
        if (!postsRead.includes(postId)) {
          set({ postsRead: [...postsRead, postId] });
        }
      },
      addReadTime: (minutes) => set((state) => ({ totalReadTime: state.totalReadTime + minutes })),
    }),
    { name: 'engagement-storage' }
  )
);