import { fetchEntries, calculateStats } from "../lib/api";
import HomeContent from "../components/HomeContent";

/**
 * Format duration in minutes to hours and minutes
 */
export default async function HomePage() {
  const entries = await fetchEntries();
  const stats = calculateStats(entries);
  
  return <HomeContent stats={stats} />;
}


