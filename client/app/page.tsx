import { fetchEntries, calculateStats } from "../lib/api";

/**
 * Format duration in minutes to hours and minutes
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return `${hours}h ${mins}m`;
}

export default async function HomePage() {
  const entries = await fetchEntries();
  const stats = calculateStats(entries);
  
  return (
    <section className="space-y-6">
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/60 via-orange-500/30 to-transparent" />
        <div className="relative z-[1]">
          <h2 className="text-2xl font-semibold">Track Your Daily Activities</h2>
          <p className="mt-1 text-sm text-white/70">Stay consistent and visualize your progress over time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="card-title">This week</div>
          <div className="metric">{stats.thisWeekSessions} sessions</div>
        </div>
        <div className="card">
          <div className="card-title">Total duration</div>
          <div className="metric">{formatDuration(stats.totalDurationMinutes)}</div>
        </div>
        <div className="card">
          <div className="card-title">Streak</div>
          <div className="metric">{stats.streakDays} days</div>
        </div>
      </div>
    </section>
  );
}


