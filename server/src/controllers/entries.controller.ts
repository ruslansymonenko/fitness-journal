import { Response } from "express";
import { z } from "zod";
import { EntryService } from "@/services/entries.service";
import { AuthRequest } from "@/middleware/auth.middleware";

const createEntrySchema = z.object({
  date: z.string().transform((s) => new Date(s)),
  workoutType: z.string().min(1),
  duration: z.number().int().positive(),
  notes: z.string().optional().nullable(),
});


export class EntriesController {
  /** GET /entries */
  static async list(req: AuthRequest, res: Response) {
    const entries = await EntryService.listAll(req.user!.userId);
    res.json(entries);
  }

  /** POST /entries */
  static async create(req: AuthRequest, res: Response) {
    const parse = createEntrySchema.safeParse(req.body);

    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

    const created = await EntryService.create({
      ...parse.data,
      userId: req.user!.userId
    });

    res.status(201).json(created);
  }

  /** GET /entries/:id */
  static async getById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const entry = await EntryService.getById(id, req.user!.userId);

    if (!entry) return res.status(404).json({ error: "Not found" });

    res.json(entry);
  }
}


