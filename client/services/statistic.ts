import { Entry } from '@/services/entries';

export interface Stats {
  thisWeekSessions: number;
  totalDurationMinutes: number;
  thisWeekDurationMinutes: number;
  streakDays: number;
}

export function calculateStats(entries: Entry[]) {
  const now = new Date();
  const startOfWeek = new Date(now);
  
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const thisWeekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startOfWeek;
  });
  
  const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
  const thisWeekDuration = thisWeekEntries.reduce((sum, entry) => sum + entry.duration, 0);
  
  let streak = 0;
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    entryDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
    return {
    thisWeekSessions: thisWeekEntries.length,
    totalDurationMinutes: totalDuration,
    thisWeekDurationMinutes: thisWeekDuration,
    streakDays: streak,
    };
}