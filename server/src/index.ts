import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import entriesRouter from "@/routes/entries";
import authRouter from "@/routes/auth";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/entries", entriesRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


