"use client";

import { useState } from "react";
import { createEntry } from "@/services/entries";
import { useI18n } from "@/lib/i18n";
import { useAppStore } from "@/store/store";
import { withAuth } from "@/lib/withAuth";

function AddEntryPage() {
  const { t } = useI18n();
  const { setError } = useAppStore();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [workoutType, setWorkoutType] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      await createEntry({
        date,
        workoutType,
        duration: Number(duration),
        notes: notes || undefined,
        userId: "" // userId will be set server-side based on the auth token
      });
      
      setDate(new Date().toISOString().slice(0, 10));
      setWorkoutType("");
      setDuration("");
      setNotes("");
      
      
    } catch (error) {
      const message = error instanceof Error ? error.message : t("entryFailed");
      setError(message);
    }
  }

  return (
    <section className="max-w-xl">
      <h2 className="mb-6 text-2xl font-medium">{t("addEntry")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm opacity-70">{t("date")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">{t("workoutType")}</label>
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
          <label className="mb-1 block text-sm opacity-70">{t("durationMinutes")}</label>
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
          <label className="mb-1 block text-sm opacity-70">{t("notes")}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
            rows={4}
            placeholder={t("optional")}
          />
        </div>
        <button type="submit" className="rounded-md bg-brand.accent px-4 py-2 text-black transition hover:opacity-90">{t("save")}</button>
      </form>
    </section>
  );
}

export default withAuth(AddEntryPage);

