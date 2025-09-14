'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, getStoredAuth } from '@/store/authStore';

export function withAuth<T extends object = {}>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
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
    return <Component {...(props as T & JSX.IntrinsicAttributes)} />;
  };
}

export function withoutAuth<T extends object = {}>(Component: React.ComponentType<T>) {
  return function UnauthenticatedComponent(props: T) {
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
    return <Component {...(props as T & JSX.IntrinsicAttributes)} />;
  };
}
