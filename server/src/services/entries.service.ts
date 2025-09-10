import { prisma } from "../db";

export type CreateEntryInput = {
  date: Date;
  workoutType: string;
  duration: number;
  notes?: string | null;
};

/**
 * Provides data-access operations for journal entries.
 */
export class EntryService {
  /** Returns all entries ordered by date desc. */
  static async listAll() {
    return prisma.entry.findMany({ orderBy: { date: "desc" } });
  }

  /** Returns an entry by id or null. */
  static async getById(id: string) {
    return prisma.entry.findUnique({ where: { id } });
  }

  /** Creates a new entry. */
  static async create(data: CreateEntryInput) {
    const { date, workoutType, duration, notes } = data;
    return prisma.entry.create({ data: { date, workoutType, duration, notes: notes ?? null } });
  }
}


