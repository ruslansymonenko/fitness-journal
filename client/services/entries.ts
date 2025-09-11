import { useAuthStore } from '@/store/authStore';

export type Entry = {
  id: string;
  date: string;
  workoutType: string;
  duration: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type CreateEntryData = {
  date: string;
  workoutType: string;
  duration: number;
  notes?: string;
  userId: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function normalizeError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof Error) return error;
  if (typeof error === 'string') return new Error(error);

  return new Error(fallbackMessage);
}


export async function fetchEntries(): Promise<Entry[]> {
  try {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/entries`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch entries: ${response.statusText}`);
    }

    return data;
  } catch (e) {
    throw normalizeError(e, 'Failed to fetch entries. Server may be unavailable.');
  }
}

export async function createEntry(data: CreateEntryData): Promise<Entry> {
  try {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create entry');
    }

    return result;
  } catch (e) {
    throw normalizeError(e, 'Failed to create entry. Please try again later.');
  }
}

export async function fetchEntryById(id: string): Promise<Entry> {
  try {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch entry: ${response.statusText}`);
    }

    return data;
  } catch (e) {
    throw normalizeError(e, 'Failed to fetch entry.');
  }
}



