"use client";

import { useI18n } from "../lib/i18n";

type Stats = {
  thisWeekSessions: number;
  totalDurationMinutes: number;
  streakDays: number;
};

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

/**
 * Client-rendered home content to allow language switching without full reload.
 */
export default function HomeContent({ stats }: { stats: Stats }) {
  const { t } = useI18n();
  return (
    <section className="space-y-6">
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/60 via-orange-500/30 to-transparent" />
        <div className="relative z-[1]">
          <h2 className="text-2xl font-semibold">{t("heroTitle")}</h2>
          <p className="mt-1 text-sm text-white/70">{t("heroSubtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="card-title">{t("thisWeek")}</div>
          <div className="metric">{stats.thisWeekSessions} {t("sessions")}</div>
        </div>
        <div className="card">
          <div className="card-title">{t("totalDuration")}</div>
          <div className="metric">{formatDuration(stats.totalDurationMinutes)}</div>
        </div>
        <div className="card">
          <div className="card-title">{t("streak")}</div>
          <div className="metric">{stats.streakDays} {t("days")}</div>
        </div>
      </div>
    </section>
  );
}


