import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEntry, CreateEntryData, Entry } from '@/services/entries';
import { queryKeys } from '@/lib/queryClient';

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEntryData) => createEntry(data),
    onSuccess: (newEntry: Entry) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.all,
      });

      queryClient.setQueryData<Entry[]>(queryKeys.entries.lists(), (oldEntries) => {
        if (!oldEntries) return [newEntry];
        return [...oldEntries, newEntry];
      });
    },
    onError: (error) => {
      console.error('Failed to create entry:', error);
    },
  });
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateEntryData> }) => {
      throw new Error('Update functionality not implemented yet');
    },
    onSuccess: (updatedEntry: Entry, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.lists(),
      });

      queryClient.setQueryData(queryKeys.entries.detail(id), updatedEntry);

      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.all,
      });
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      throw new Error('Delete functionality not implemented yet');
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Entry[]>(queryKeys.entries.lists(), (oldEntries) => {
        if (!oldEntries) return [];
        return oldEntries.filter((entry) => entry.id !== deletedId);
      });

      queryClient.removeQueries({
        queryKey: queryKeys.entries.detail(deletedId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.all,
      });
    },
  });
}

// Hook for bulk operations or refresh
export function useRefreshEntries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Force refetch entries
      return queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
    onSuccess: () => {
      // Also refresh stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.all,
      });
    },
  });
}
