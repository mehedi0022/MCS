import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import clientRoutes from "./routes/clients.routes.js";
import clientSectorRoutes from "./routes/client-sectors.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import deliveryApproachRoutes from "./routes/delivery-approach.routes.js";
import faqRoutes from "./routes/faqs.routes.js";
import heroSlideRoutes from "./routes/hero-slides.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import serviceRoutes from "./routes/services.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import usersRoutes from "./routes/users.routes.js";
import whatWeDoRoutes from "./routes/what-we-do.routes.js";
import journeyRoutes from "./routes/journey.routes.js";
import ourStoryRoutes from "./routes/our-story.routes.js";
import trainingRoutes from "./routes/training.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(
  ["/api/auth/login", "/api/auth/forgot-password", "/api/auth/reset-password"],
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
app.use("/api/delivery-approach", deliveryApproachRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/hero-slides", heroSlideRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/client-sectors", clientSectorRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/what-we-do", whatWeDoRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/our-story", ourStoryRoutes);
app.use("/api/training", trainingRoutes);

app.use(errorHandler);
