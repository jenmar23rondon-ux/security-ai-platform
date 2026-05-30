import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiRateLimit } from "./middlewares/rateLimit.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { authRoutes } from "./routes/auth.routes";
import { usersRoutes } from "./routes/users.routes";
import { eventsRoutes } from "./routes/events.routes";
import { alertsRoutes } from "./routes/alerts.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";

export const app = express();

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS no permitido: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(apiRateLimit);

app.get("/", (_req, res) => res.json({ name: "Security AI Platform API", status: "ok" }));
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/events", eventsRoutes);
app.use("/alerts", alertsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use(errorMiddleware);

