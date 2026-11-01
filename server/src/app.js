import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorHandler } from "./middlewares/Error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
import { startRankTrackingCron } from "./corn/rankTrackingCorn.js";

//  --------------- routes declaration --------------------

app.use("/api/v1/users", userRouter);
app.use("/api/v1/rank", rankRouter);
app.use("/api/v1/analysis", analysisRouter);

// Start cron jobs
startRankTrackingCron();

app.use(ErrorHandler);

export { app };
