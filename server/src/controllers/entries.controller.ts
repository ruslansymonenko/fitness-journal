import { Response } from 'express';
import { z } from 'zod';
import { EntryService } from '@/services/entries.service';
import { AuthRequest } from '@/middleware/auth.middleware';

const createEntrySchema = z.object({
  date: z.string().transform((s) => new Date(s)),
  workoutType: z.string().min(1),
  duration: z.number().int().positive(),
  notes: z.string().optional().nullable(),
});

const updateEntrySchema = z.object({
  date: z
    .string()
    .transform((s) => new Date(s))
    .optional(),
  workoutType: z.string().min(1).optional(),
  duration: z.number().int().positive().optional(),
  notes: z.string().nullable().optional(),
});

const listEntriesQuerySchema = z.object({
  page: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional()
    .default('1'),
  limit: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional()
    .default('10'),
  sortBy: z.enum(['date', 'workoutType', 'duration', 'createdAt']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  workoutType: z.string().optional(),
  dateFrom: z
    .string()
    .transform((s) => new Date(s))
    .optional(),
  dateTo: z
    .string()
    .transform((s) => new Date(s))
    .optional(),
  minDuration: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional(),
  maxDuration: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional(),
});

export class EntriesController {
  /** GET /entries */
  static async list(req: AuthRequest, res: Response) {
    try {
      const queryParse = listEntriesQuerySchema.safeParse(req.query);

      if (!queryParse.success) {
        return res.status(400).json({ error: queryParse.error.flatten() });
      }

      const result = await EntryService.listAll({
        userId: req.user!.userId,
        ...queryParse.data,
      });

      res.json(result);
    } catch (error) {
      console.error('Error listing entries:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /** POST /entries */
  static async create(req: AuthRequest, res: Response) {
    try {
      const parse = createEntrySchema.safeParse(req.body);

      if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

      const created = await EntryService.create({
        ...parse.data,
        userId: req.user!.userId,
      });

      res.status(201).json(created);
    } catch (error) {
      console.error('Error creating entry:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /** GET /entries/:id */
  static async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const entry = await EntryService.getById(id, req.user!.userId);

      if (!entry) return res.status(404).json({ error: 'Entry not found' });

      res.json(entry);
    } catch (error) {
      console.error('Error getting entry:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /** PUT /entries/:id */
  static async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const parse = updateEntrySchema.safeParse(req.body);

      if (!parse.success) {
        return res.status(400).json({ error: parse.error.flatten() });
      }

      const updated = await EntryService.update(id, req.user!.userId, parse.data);

      if (!updated) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.json(updated);
    } catch (error) {
      console.error('Error updating entry:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /** DELETE /entries/:id */
  static async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await EntryService.delete(id, req.user!.userId);

      if (!deleted) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting entry:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
