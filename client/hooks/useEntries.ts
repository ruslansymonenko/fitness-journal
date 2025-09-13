import { useQuery } from '@tanstack/react-query';
import { fetchEntries, fetchEntryById, Entry } from '@/services/entries';
import { calculateStats, Stats } from '@/services/statistic';
import { queryKeys } from '@/lib/queryClient';

export function useEntries() {
  return useQuery({
    queryKey: queryKeys.entries.lists(),
    queryFn: fetchEntries,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useEntry(id: string) {
  return useQuery({
    queryKey: queryKeys.entries.detail(id),
    queryFn: () => fetchEntryById(id),
    enabled: !!id, // Only run the query if id is truthy
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useStats() {
  const entriesQuery = useQuery({
    queryKey: queryKeys.entries.lists(),
    queryFn: fetchEntries,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return useQuery({
    queryKey: queryKeys.stats.all,
    queryFn: (): Stats => {
      if (!entriesQuery.data) {
        return {
          thisWeekSessions: 0,
          totalDurationMinutes: 0,
          thisWeekDurationMinutes: 0,
          streakDays: 0,
        };
      }
      return calculateStats(entriesQuery.data);
    },
    enabled: !!entriesQuery.data,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useEntriesWithStats() {
  const entriesQuery = useEntries();
  const statsQuery = useStats();

  return {
    entries: entriesQuery.data,
    stats: statsQuery.data,
    isLoading: entriesQuery.isLoading || statsQuery.isLoading,
    isError: entriesQuery.isError || statsQuery.isError,
    error: entriesQuery.error || statsQuery.error,
    refetch: () => {
      entriesQuery.refetch();
      statsQuery.refetch();
    },
  };
}
