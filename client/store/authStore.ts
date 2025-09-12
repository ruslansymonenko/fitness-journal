'use client';
import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    set({ user, token });
    localStorage.setItem('auth', JSON.stringify({ user, token }));
    document.cookie = `auth_token=${token}; path=/; max-age=604800`; // 7 дней
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('auth');
    document.cookie = `auth_token=; path=/; max-age=0`;
  },
}));

export const getStoredAuth = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('auth');
  return stored ? JSON.parse(stored) : null;
};
