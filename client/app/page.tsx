'use client';

import { fetchEntries } from "@/services/entries";
import { calculateStats } from "@/services/statistic";
import HomeContent from "@/components/HomeContent";
import { withAuth } from "@/lib/withAuth";
import { useEffect, useState } from "react";
import { Stats } from "@/services/statistic";

function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const entries = await fetchEntries();
        setStats(calculateStats(entries));
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return stats ? <HomeContent stats={stats} /> : null;
}

export default withAuth(HomePage);


