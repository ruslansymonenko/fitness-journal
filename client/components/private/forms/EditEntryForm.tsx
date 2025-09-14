import { useI18n } from '@/lib/i18n';
import { useUpdateEntry } from '@/hooks';
import { useAppStore } from '@/store/store';
import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import { type Entry } from '@/services/entries';

interface Props {
  entry: Entry;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditEntryForm: React.FC<Props> = ({ entry, onSuccess, onCancel }) => {
  const { t } = useI18n();
  const { setError } = useAppStore();
  const [date, setDate] = useState<string>(entry.date.slice(0, 10));
  const [workoutType, setWorkoutType] = useState<string>(entry.workoutType);
  const [duration, setDuration] = useState<string>(entry.duration.toString());
  const [notes, setNotes] = useState<string>(entry.notes || '');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const updateEntryMutation = useUpdateEntry();

  // Hide success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const updateData = {
      date,
      workoutType,
      duration: Number(duration),
      notes: notes || null,
    };

    updateEntryMutation.mutate(
      {
        id: entry.id,
        data: updateData,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          if (onSuccess) {
            onSuccess();
          }
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Failed to update entry';
          setError(message);
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      {updateEntryMutation.isError && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
          {updateEntryMutation.error?.message || 'Failed to update entry'}
        </div>
      )}

      {showSuccess && (
        <div className="rounded-md border border-green-300 bg-green-50 p-3 text-green-700">
          Entry updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm opacity-70">{t('date')}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">{t('workoutType')}</label>
          <input
            type="text"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="Run, Strength, Yoga..."
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">{t('durationMinutes')}</label>
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">{t('notes')}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
            rows={4}
            placeholder={t('optional')}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="secondary" disabled={updateEntryMutation.isPending}>
            {updateEntryMutation.isPending ? 'Updating...' : 'Update Entry'}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditEntryForm;
