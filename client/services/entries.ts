export type Entry = {
  id: string;
  date: string;
  workoutType: string;
  duration: number;
  notes?: string | null;
};

export type CreateEntryData = {
  date: string;
  workoutType: string;
  duration: number;
  notes?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Fetch all journal entries from the server.
 */
export async function fetchEntries(): Promise<Entry[]> {
  const response = await fetch(`${API_BASE_URL}/entries`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch entries: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Create a new journal entry on the server and return it.
 */
export async function createEntry(data: CreateEntryData): Promise<Entry> {
  const response = await fetch(`${API_BASE_URL}/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create entry: ${error.error || response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a single journal entry by its id.
 */
export async function fetchEntryById(id: string): Promise<Entry> {
  const response = await fetch(`${API_BASE_URL}/entries/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch entry: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Calculate client-side statistics for a list of entries.
 */
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


