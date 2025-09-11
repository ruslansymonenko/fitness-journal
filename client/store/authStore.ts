import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

// Helper to read persisted auth directly from localStorage. Persist middleware
// stores the state under the key 'auth-storage' (see above) and wraps it with
// a `state` property. This utility is safe to call from client components
// during initial mount to avoid redirecting before rehydration completes.
export function getStoredAuth(): { user: User | null; token: string | null } | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Persist middleware stores { state: { ... } } — prefer that if present.
    const state = parsed?.state ?? parsed;
    if (!state) return null;
    return { user: state.user ?? null, token: state.token ?? null };
  } catch (e) {
    return null;
  }
}
