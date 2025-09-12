import { getStoredAuth } from '@/store/authStore';

export interface User {
  id: string;
  email: string;
  name: string;
}

export const getCurrentUser = (): User | null => {
  const auth = getStoredAuth();

  if (!auth || !auth.token || !auth.user) {
    return null;
  }

  return auth.user;
};
