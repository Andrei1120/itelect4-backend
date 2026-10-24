import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.js";
import { courseRouter } from "./routes/courses.js";
import { submissionRouter } from "./routes/submissions.js";
import { itemRouter } from "./routes/items.js";

// This file builds the app and stops. It never opens a port and never
// touches the database, so anything that wants an app -- server.ts, or
// a test -- can have one without starting a server.
export const app = express();

// ===== SESSION 10: only the origins this app is actually served from =
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin !== "");

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

// ===== SESSION 10: the line that makes this work on Vercel ===========
// On your laptop, server.ts connects to MongoDB and only then starts
// listening, so a request cannot arrive before the connection exists.
// Deployed there is no server.ts step -- the app IS the function, and
// a request is the first thing that happens. So the waiting moves
// here, in front of every route.
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/submissions", submissionRouter);
app.use("/api/items", itemRouter);
app.use("/api/lost-found-items", itemRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `No route for ${req.method} ${req.originalUrl}`,
  });
});

// Central error handler
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
      return;
    }

    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        message: `"${err.value}" is not a valid id`,
      });
      return;
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  },
);

export default app;
