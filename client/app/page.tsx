export default function HomePage() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-medium">Welcome back</h2>
      <p className="text-white/70">Track your workouts, stay consistent, and see progress over time.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">This week</div>
          <div className="mt-2 text-3xl font-semibold">3 sessions</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Total duration</div>
          <div className="mt-2 text-3xl font-semibold">4h 20m</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Streak</div>
          <div className="mt-2 text-3xl font-semibold">5 days</div>
        </div>
      </div>
    </section>
  );
}


