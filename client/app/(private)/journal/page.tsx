'use client';

import JournalHeader from '@/components/JournalHeader';
import { withAuth } from '@/lib/withAuth';
import EntriesList from '@/components/private/EntriesList';
import { useEntries } from '@/hooks/useEntries';

function JournalPage() {
  const { data, isLoading, isError, error, refetch } = useEntries();

  if (isLoading) {
    return (
      <section>
        <JournalHeader />
        <div>Loading...</div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <JournalHeader />
        <div className="rounded-md border border-yellow-800/40 bg-yellow-900/30 p-4 text-yellow-100">
          {error instanceof Error ? error.message : 'Failed to load entries'}
        </div>
      </section>
    );
  }

  return (
    <section>
      <JournalHeader />
      <EntriesList entries={data ?? []} />
    </section>
  );
}

export default withAuth(JournalPage);
