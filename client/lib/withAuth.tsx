"use client";

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

      if (user || stored?.user) {
        setRehydrated(true);
        return;
      }

      setRehydrated(true);
    }, [user]);

    useEffect(() => {
      if (!rehydrated) return;
      if (!user) {
        router.push('/auth/login');
      }
    }, [rehydrated, user, router]);

    if (!rehydrated) return null; 

    if (!user) return null;

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
      if (user || stored?.user) {
        setRehydrated(true);
        return;
      }
      setRehydrated(true);
    }, [user]);

    useEffect(() => {
      if (!rehydrated) return;
      if (user) {
        router.push('/');
      }
    }, [rehydrated, user, router]);

    if (!rehydrated) return null;
    if (user) return null;

    return <Component {...props} />;
  };
}
