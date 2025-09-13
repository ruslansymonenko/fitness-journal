import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('Authentication required')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys factory
export const queryKeys = {
  entries: {
    all: ['entries'] as const,
    lists: () => [...queryKeys.entries.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.entries.lists(), { filters }] as const,
    details: () => [...queryKeys.entries.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.entries.details(), id] as const,
  },
  stats: {
    all: ['stats'] as const,
  },
  auth: {
    user: ['auth', 'user'] as const,
  },
} as const;
