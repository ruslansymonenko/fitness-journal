import { fetchEntries, type Entry } from "../../lib/api";
import JournalHeader from "../../components/JournalHeader";

export default async function JournalPage() {
  const entries = await fetchEntries();
  return (
    <section>
      <JournalHeader />
      <ul className="space-y-3">
        {entries.map((e) => (
          <li key={e.id} className="flex items-center justify-between rounded-lg border border-[color:var(--panel-border)] bg-[var(--panel)] p-4">
            <div>
              <div className="text-sm opacity-60">{new Date(e.date).toDateString()}</div>
              <div className="text-lg font-medium">{e.workoutType}</div>
              <div className="text-sm opacity-70">{e.duration} min{e.duration !== 1 ? "s" : ""}</div>
            </div>
            {e.notes ? <div className="max-w-xs text-right text-sm opacity-60">{e.notes}</div> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}


