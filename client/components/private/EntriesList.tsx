import React, { useState } from 'react';
import { type Entry } from '@/services/entries';
import { useDeleteEntry } from '@/hooks';
import { useAppStore } from '@/store/store';
import Button from '@/components/common/Button';
import Link from 'next/link';

interface Props {
  entries: Entry[];
  onEdit?: (entry: Entry) => void;
}

const EntriesList: React.FC<Props> = ({ entries, onEdit }) => {
  const { setError } = useAppStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteEntryMutation = useDeleteEntry();

  const handleDelete = async (id: string, workoutType: string) => {
    if (window.confirm(`Are you sure you want to delete the "${workoutType}" entry?`)) {
      setDeletingId(id);
      try {
        await deleteEntryMutation.mutateAsync(id);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete entry';
        setError(message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <ul className="space-y-3">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex items-center justify-between rounded-lg border border-[color:var(--panel-border)] bg-[var(--panel)] p-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="text-sm opacity-60">{new Date(e.date).toDateString()}</div>
              <Link
                href={`/entry/${e.id}`}
                className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
              >
                View Details
              </Link>
            </div>
            <div className="text-lg font-medium">{e.workoutType}</div>
            <div className="text-sm opacity-70">
              {e.duration} min{e.duration !== 1 ? 's' : ''}
            </div>
            {e.notes && <div className="mt-1 text-sm opacity-60 line-clamp-2">{e.notes}</div>}
          </div>

          <div className="flex gap-2 ml-4">
            {onEdit && (
              <Button variant="ghost" onClick={() => onEdit(e)} className="text-xs px-2 py-1">
                Edit
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => handleDelete(e.id, e.workoutType)}
              disabled={deletingId === e.id}
              className="text-xs px-2 py-1"
            >
              {deletingId === e.id ? '...' : 'Delete'}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EntriesList;
