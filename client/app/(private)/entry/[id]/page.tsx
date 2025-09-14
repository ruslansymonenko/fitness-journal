'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEntry, useDeleteEntry } from '@/hooks';
import { useAppStore } from '@/store/store';
import Button from '@/components/common/Button';
import EditEntryForm from '@/components/private/forms/EditEntryForm';
import { useI18n } from '@/lib/i18n';

const EntryDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const { setError } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const entryId = Array.isArray(id) ? id[0] : id;
  const { data: entry, isLoading, isError, error } = useEntry(entryId!);
  const deleteEntryMutation = useDeleteEntry();

  const handleDelete = async () => {
    if (!entry) return;

    if (window.confirm(`Are you sure you want to delete the "${entry.workoutType}" entry?`)) {
      setIsDeleting(true);
      try {
        await deleteEntryMutation.mutateAsync(entry.id);
        router.push('/journal');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete entry';
        setError(message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg opacity-70">Loading entry...</div>
      </div>
    );
  }

  if (isError || !entry) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="text-lg text-red-600">
          {error instanceof Error ? error.message : 'Entry not found'}
        </div>
        <Button onClick={() => router.push('/journal')} variant="secondary">
          Back to Journal
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={() => router.push('/journal')} variant="ghost" className="text-sm">
          ← Back to Journal
        </Button>

        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button onClick={() => setIsEditing(true)} variant="secondary" className="text-sm">
                Edit Entry
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                disabled={isDeleting}
                className="text-sm"
              >
                {isDeleting ? 'Deleting...' : 'Delete Entry'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Entry Details or Edit Form */}
      <div className="rounded-lg border border-[color:var(--panel-border)] bg-[var(--panel)] p-6">
        {isEditing ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Edit Entry</h2>
            <EditEntryForm
              entry={entry}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{entry.workoutType}</h1>
              <div className="text-sm opacity-60">
                {new Date(entry.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm opacity-70">Duration</div>
                <div className="text-lg font-medium">
                  {entry.duration} minute{entry.duration !== 1 ? 's' : ''}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70">Date</div>
                <div className="text-lg font-medium">{new Date(entry.date).toDateString()}</div>
              </div>
            </div>

            {entry.notes && (
              <div>
                <div className="text-sm opacity-70 mb-2">Notes</div>
                <div className="rounded-md border border-[color:var(--panel-border)] bg-[var(--background)] p-3">
                  <div className="whitespace-pre-wrap">{entry.notes}</div>
                </div>
              </div>
            )}

            <div className="flex justify-between text-xs opacity-50 pt-4 border-t border-[color:var(--panel-border)]">
              <div>Created: {new Date(entry.createdAt).toLocaleString()}</div>
              <div>Updated: {new Date(entry.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryDetailPage;
