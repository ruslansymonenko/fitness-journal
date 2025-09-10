type Entry = {
  id: string;
  date: string;
  workoutType: string;
  duration: number;
  notes?: string | null;
};

async function fetchEntries(): Promise<Entry[]> {
  // TODO: connect to real API endpoint
  return [
    { id: "1", date: "2025-01-01", workoutType: "Run", duration: 45, notes: "Morning jog" },
    { id: "2", date: "2025-01-03", workoutType: "Strength", duration: 60, notes: "Upper body" },
  ];
}

export default async function JournalPage() {
  const entries = await fetchEntries();
  return (
    <section>
      <h2 className="mb-6 text-2xl font-medium">Journal</h2>
      <ul className="space-y-3">
        {entries.map((e) => (
          <li key={e.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
            <div>
              <div className="text-sm text-white/60">{new Date(e.date).toDateString()}</div>
              <div className="text-lg font-medium">{e.workoutType}</div>
              <div className="text-sm text-white/70">{e.duration} min{e.duration !== 1 ? "s" : ""}</div>
            </div>
            {e.notes ? <div className="max-w-xs text-right text-sm text-white/60">{e.notes}</div> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}


