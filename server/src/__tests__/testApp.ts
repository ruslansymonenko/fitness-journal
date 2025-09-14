import express from 'express';
import cors from 'cors';
import entriesRouter from '@/routes/entries';
import authRouter from '@/routes/auth';

export function createTestApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRouter);
  app.use('/entries', entriesRouter);

  app.use(
    (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    },
  );

  return app;
}
