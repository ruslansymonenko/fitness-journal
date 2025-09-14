import { Router } from 'express';
import { EntriesController } from '@/controllers/entries.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', EntriesController.list);
router.post('/', EntriesController.create);
router.get('/:id', EntriesController.getById);
router.put('/:id', EntriesController.update);
router.delete('/:id', EntriesController.delete);

export default router;
