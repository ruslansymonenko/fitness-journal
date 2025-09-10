import { Router } from "express";
import { EntriesController } from "../controllers/entries.controller";

const router = Router();

router.get("/", EntriesController.list);
router.post("/", EntriesController.create);
router.get("/:id", EntriesController.getById);

export default router;


