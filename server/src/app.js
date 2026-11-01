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
      if (allowedOrigins.includes(normalized) || allowedOrigins.includes("*")) {
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

//  ------------------- import routes ----------------------

import userRouter from "./routes/user.route.js";
import rankRouter from "./routes/rank.route.js";
import analysisRouter from "./routes/analysis.route.js";
import { startRankTrackingCron } from "./cron/rankTrackingCron.js";

//  --------------- routes declaration --------------------

app.use("/api/v1/users", userRouter);
app.use("/api/v1/rank", rankRouter);
app.use("/api/v1/analysis", analysisRouter);

// Start cron jobs
startRankTrackingCron();

app.use(ErrorHandler);

export { app };
