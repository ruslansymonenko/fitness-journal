'use client';

import { fetchEntries, type Entry } from '@/services/entries';
import JournalHeader from '@/components/JournalHeader';
import { withAuth } from '@/lib/withAuth';

import { useEffect, useState } from 'react';

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
      <ul className="space-y-3">
        {entries.map((e) => (
          <li
            key={e.id}
            className="flex items-center justify-between rounded-lg border border-[color:var(--panel-border)] bg-[var(--panel)] p-4"
          >
            <div>
              <div className="text-sm opacity-60">{new Date(e.date).toDateString()}</div>
              <div className="text-lg font-medium">{e.workoutType}</div>
              <div className="text-sm opacity-70">
                {e.duration} min{e.duration !== 1 ? 's' : ''}
              </div>
            </div>
            {e.notes ? (
              <div className="max-w-xs text-right text-sm opacity-60">{e.notes}</div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default withAuth(JournalPage);
