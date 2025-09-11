import { prisma } from "@/db";

export type CreateEntryInput = {
  date: Date;
  workoutType: string;
  duration: number;
  notes?: string | null;
  userId: string;
};


export class EntryService {
  static async listAll(userId: string) {
    return prisma.entry.findMany({
      where: { userId },
      orderBy: { date: "desc" }
    });
  }

  static async getById(id: string, userId: string) {
    return prisma.entry.findFirst({
      where: {
        id,
        userId
      }
    });
  }

  static async create(data: CreateEntryInput) {
    const { date, workoutType, duration, notes, userId } = data;
    return prisma.entry.create({
      data: {
        date,
        workoutType,
        duration,
        notes: notes ?? null,
        userId
      }
    });
  }
}


