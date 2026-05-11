import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import heroSlideRoutes from "./routes/hero-slides.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import serviceRoutes from "./routes/services.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import usersRoutes from "./routes/users.routes.js";
import whatWeDoRoutes from "./routes/what-we-do.routes.js";
import journeyRoutes from "./routes/journey.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Welcome to the MCS API" });
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "MCS API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hero-slides", heroSlideRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/what-we-do", whatWeDoRoutes);
app.use("/api/journey", journeyRoutes);

app.use(errorHandler);
