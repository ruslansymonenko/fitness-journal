'use client';

import { fetchEntries, type Entry } from '@/services/entries';
import JournalHeader from '@/components/JournalHeader';
import { withAuth } from '@/lib/withAuth';

import { useEffect, useState } from 'react';
import EntriesList from '@/components/private/EntriesList';

function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await fetchEntries();
        setEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entries');
      } finally {
        setLoading(false);
      }
    }

    loadEntries();
  }, []);
  if (loading) {
    return (
      <section>
        <JournalHeader />
        <div>Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <JournalHeader />
        <div className="rounded-md border border-yellow-800/40 bg-yellow-900/30 p-4 text-yellow-100">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section>
      <JournalHeader />
      <EntriesList entries={entries} />
    </section>
  );
}

export default withAuth(JournalPage);
