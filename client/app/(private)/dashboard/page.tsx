'use client';

import HomeContent from '@/components/private/HomeContent';
import { withAuth } from '@/lib/withAuth';
import { useStats } from '@/hooks/useEntries';

function HomePage() {
  const { data, isLoading, isError, error, refetch } = useStats();

  if (isError) {
    return (
      <div className="rounded-md border border-yellow-800/40 bg-yellow-900/30 p-4 text-yellow-100">
        {error instanceof Error ? error.message : 'Failed to load stats'}
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return data ? <HomeContent stats={data} /> : null;
}

export default withAuth(HomePage);
