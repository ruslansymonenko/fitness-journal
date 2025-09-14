import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEntry,
  updateEntry,
  deleteEntry,
  CreateEntryData,
  UpdateEntryData,
  Entry,
} from '@/services/entries';
import { queryKeys } from '@/lib/queryClient';

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEntryData) => createEntry(data),
    onSuccess: (newEntry: Entry) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.all,
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
    mutationFn: async ({ id, data }: { id: string; data: UpdateEntryData }) => {
      return updateEntry(id, data);
    },
    onSuccess: (updatedEntry: Entry, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });

      queryClient.setQueryData(queryKeys.entries.detail(id), updatedEntry);

      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.all,
      });
    },
    onError: (error) => {
      console.error('Failed to update entry:', error);
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteEntry(id);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });

      queryClient.removeQueries({
        queryKey: queryKeys.entries.detail(deletedId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.all,
      });
    },
    onError: (error) => {
      console.error('Failed to delete entry:', error);
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
