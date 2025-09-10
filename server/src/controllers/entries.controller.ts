import { Request, Response } from "express";
import { z } from "zod";
import { EntryService } from "../services/entries.service";

const createEntrySchema = z.object({
  date: z.string().transform((s) => new Date(s)),
  workoutType: z.string().min(1),
  duration: z.number().int().positive(),
  notes: z.string().optional().nullable(),
});

/**
 * HTTP handlers for entries resources.
 */
export class EntriesController {
  /** GET /entries */
  static async list(_req: Request, res: Response) {
    const entries = await EntryService.listAll();
    res.json(entries);
  }

  /** POST /entries */
  static async create(req: Request, res: Response) {
    const parse = createEntrySchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const created = await EntryService.create(parse.data);
    res.status(201).json(created);
  }

  /** GET /entries/:id */
  static async getById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const entry = await EntryService.getById(id);
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json(entry);
  }
}


