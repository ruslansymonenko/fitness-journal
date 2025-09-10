"use client";

import { useState } from "react";
import { createEntry } from "../../lib/api";
import { useI18n } from "../../lib/i18n";

export default function AddEntryPage() {
  const { t } = useI18n();
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
      });
      
      // Reset form after successful submission
      setDate(new Date().toISOString().slice(0, 10));
      setWorkoutType("");
      setDuration("");
      setNotes("");
      
      alert(t("entrySaved"));
    } catch (error) {
      console.error("Failed to create entry:", error);
      alert(t("entryFailed"));
    }
  }

  return (
    <section className="max-w-xl">
      <h2 className="mb-6 text-2xl font-medium">{t("addEntry")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-white/70">{t("date")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand.accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">{t("workoutType")}</label>
          <input
            type="text"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="Run, Strength, Yoga..."
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand.accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">{t("durationMinutes")}</label>
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand.accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">{t("notes")}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand.accent"
            rows={4}
            placeholder={t("optional")}
          />
        </div>
        <button type="submit" className="rounded-md bg-brand.accent px-4 py-2 text-black transition hover:opacity-90">{t("save")}</button>
      </form>
    </section>
  );
}


