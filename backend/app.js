import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(apiLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "School Management System API",
  });
});

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
