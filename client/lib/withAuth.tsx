'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, getStoredAuth } from '@/store/authStore';

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [rehydrated, setRehydrated] = useState(false);

    useEffect(() => {
      const stored = getStoredAuth();
      if (!user && stored?.user) {
        useAuthStore.getState().setAuth(stored.user, stored.token);
      }
      setRehydrated(true);
    }, [user]);

    useEffect(() => {
      if (!rehydrated) return;
      if (!user) router.replace('/');
    }, [rehydrated, user, router]);

    if (!rehydrated || !user) return null;
    return <Component {...props} />;
  };
}

export function withoutAuth(Component: React.ComponentType) {
  return function UnauthenticatedComponent(props: any) {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [rehydrated, setRehydrated] = useState(false);

    useEffect(() => {
      const stored = getStoredAuth();
      if (!user && stored?.user) {
        useAuthStore.getState().setAuth(stored.user, stored.token);
      }
      setRehydrated(true);
    }, [user]);

    useEffect(() => {
      if (!rehydrated) return;
      if (user) router.replace('/dashboard');
    }, [rehydrated, user, router]);

    if (!rehydrated || user) return null;
    return <Component {...props} />;
  };
}
