import { prisma } from '@/db';
import { Prisma } from '@prisma/client';

export type CreateEntryInput = {
  date: Date;
  workoutType: string;
  duration: number;
  notes?: string | null;
  userId: string;
};

export type UpdateEntryInput = {
  date?: Date;
  workoutType?: string;
  duration?: number;
  notes?: string | null;
};

export type ListEntriesOptions = {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'workoutType' | 'duration' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  workoutType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minDuration?: number;
  maxDuration?: number;
};

export class EntryService {
  static async listAll(options: ListEntriesOptions) {
    const {
      userId,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      workoutType,
      dateFrom,
      dateTo,
      minDuration,
      maxDuration,
    } = options;

    // Build where clause for filtering
    const where: Prisma.EntryWhereInput = {
      userId,
      ...(workoutType && { workoutType: { contains: workoutType, mode: 'insensitive' } }),
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        },
      }),
      ...((minDuration !== undefined || maxDuration !== undefined) && {
        duration: {
          ...(minDuration !== undefined && { gte: minDuration }),
          ...(maxDuration !== undefined && { lte: maxDuration }),
        },
      }),
    };

    // Build orderBy clause
    const orderBy: Prisma.EntryOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get entries with pagination
    const [entries, total] = await Promise.all([
      prisma.entry.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.entry.count({ where }),
    ]);

    return {
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  static async getById(id: string, userId: string) {
    return prisma.entry.findFirst({
      where: {
        id,
        userId,
      },
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
        userId,
      },
    });
  }

  static async update(id: string, userId: string, data: UpdateEntryInput) {
    // First check if the entry exists and belongs to the user
    const existingEntry = await prisma.entry.findFirst({
      where: { id, userId },
    });

    if (!existingEntry) {
      return null;
    }

    return prisma.entry.update({
      where: { id },
      data: {
        ...data,
        notes: data.notes === undefined ? undefined : (data.notes ?? null),
      },
    });
  }

  static async delete(id: string, userId: string) {
    // First check if the entry exists and belongs to the user
    const existingEntry = await prisma.entry.findFirst({
      where: { id, userId },
    });

    if (!existingEntry) {
      return null;
    }

    await prisma.entry.delete({
      where: { id },
    });

    return true;
  }
}
