import { prisma } from "../db";

export type CreateEntryInput = {
  date: Date;
  workoutType: string;
  duration: number;
  notes?: string | null;
};


export class EntryService {
  static async listAll() {
    return prisma.entry.findMany({ orderBy: { date: "desc" } });
  }

  static async getById(id: string) {
    return prisma.entry.findUnique({ where: { id } });
  }

  static async create(data: CreateEntryInput) {
    const { date, workoutType, duration, notes } = data;
    return prisma.entry.create({ data: { date, workoutType, duration, notes: notes ?? null } });
  }
}


