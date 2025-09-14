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

export type UpdateEntryData = {
  date?: string;
  workoutType?: string;
  duration?: number;
  notes?: string | null;
};

export type FetchEntriesParams = {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'workoutType' | 'duration' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  workoutType?: string;
  dateFrom?: string;
  dateTo?: string;
  minDuration?: number;
  maxDuration?: number;
};

export type EntriesResponse = {
  entries: Entry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function normalizeError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof Error) return error;
  if (typeof error === 'string') return new Error(error);

  return new Error(fallbackMessage);
}

export async function fetchEntries(params?: FetchEntriesParams): Promise<EntriesResponse> {
  try {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.workoutType) searchParams.append('workoutType', params.workoutType);
    if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.append('dateTo', params.dateTo);
    if (params?.minDuration) searchParams.append('minDuration', params.minDuration.toString());
    if (params?.maxDuration) searchParams.append('maxDuration', params.maxDuration.toString());

    const url = `${API_BASE_URL}/entries${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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

export async function updateEntry(id: string, data: UpdateEntryData): Promise<Entry> {
  try {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update entry');
    }

    return result;
  } catch (e) {
    throw normalizeError(e, 'Failed to update entry. Please try again later.');
  }
}

export async function deleteEntry(id: string): Promise<void> {
  try {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete entry');
    }
  } catch (e) {
    throw normalizeError(e, 'Failed to delete entry. Please try again later.');
  }
}
