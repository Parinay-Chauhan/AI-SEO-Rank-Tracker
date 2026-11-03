import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorHandler } from "./middlewares/Error.middleware.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/+$/, "");
      if (
        allowedOrigins.includes(normalized) ||
        allowedOrigins.includes("*") ||
        normalized.endsWith(".vercel.app") ||
        normalized.startsWith("http://localhost:")
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // HTMl form se data aayega
app.use(express.static("public")); // file, folder, pdf, images ko server per store kerna
app.use(cookieParser());

// --------- routes -----------------

// Root and Health check endpoints for UptimeRobot / ping services
app.get("/", (req, res) => {
  res.status(200).json({
    status: "active",
    service: "Rank Pilot API",
    message: "Server is live and running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "Server is healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

//  ------------------- import routes ----------------------

import healthRouter from "./routes/health.route.js";
import userRouter from "./routes/user.route.js";
import rankRouter from "./routes/rank.route.js";
import analysisRouter from "./routes/analysis.route.js";
import { startRankTrackingCron } from "./cron/rankTrackingCron.js";

//  --------------- routes declaration --------------------

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/rank", rankRouter);
app.use("/api/v1/analysis", analysisRouter);

// Start cron jobs
startRankTrackingCron();

app.use(ErrorHandler);

export { app };
