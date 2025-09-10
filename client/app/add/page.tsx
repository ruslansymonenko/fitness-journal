"use client";

import { useState } from "react";

export default function AddEntryPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [workoutType, setWorkoutType] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: post to server API
    console.log({ date, workoutType, duration: Number(duration), notes });
    alert("Entry submitted (mock)");
  }

  return (
    <section className="max-w-xl">
      <h2 className="mb-6 text-2xl font-medium">Add Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-white/70">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand.accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Workout type</label>
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
          <label className="mb-1 block text-sm text-white/70">Duration (minutes)</label>
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
          <label className="mb-1 block text-sm text-white/70">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand.accent"
            rows={4}
            placeholder="Optional"
          />
        </div>
        <button type="submit" className="rounded-md bg-brand.accent px-4 py-2 text-black transition hover:opacity-90">Save</button>
      </form>
    </section>
  );
}


