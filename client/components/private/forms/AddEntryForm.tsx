import { useI18n } from '@/lib/i18n';
import { useCreateEntry } from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/store';
import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';

interface Props {}

const AddEntryForm: React.FC<Props> = (props) => {
  const { t } = useI18n();
  const { setError } = useAppStore();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [workoutType, setWorkoutType] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const userId = useAuthStore.getState().user?.id;

  const createEntryMutation = useCreateEntry();

  // Hide success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    createEntryMutation.mutate(
      {
        date,
        workoutType,
        duration: Number(duration),
        notes: notes || undefined,
        userId: userId,
      },
      {
        onSuccess: () => {
          // Reset form on success
          setDate(new Date().toISOString().slice(0, 10));
          setWorkoutType('');
          setDuration('');
          setNotes('');
          setShowSuccess(true);
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : t('entryFailed');
          setError(message);
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      {createEntryMutation.isError && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
          {createEntryMutation.error?.message || t('entryFailed')}
        </div>
      )}

      {showSuccess && (
        <div className="rounded-md border border-green-300 bg-green-50 p-3 text-green-700">
          Entry created successfully!
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
        <Button type="submit" variant="secondary" disabled={createEntryMutation.isPending}>
          {createEntryMutation.isPending ? 'Saving...' : t('save')}
        </Button>
      </form>
    </div>
  );
};

export default AddEntryForm;
