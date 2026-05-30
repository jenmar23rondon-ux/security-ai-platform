import { Router } from "express";
import * as alertsController from "../controllers/alerts.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/roles.middleware";

export const alertsRoutes = Router();

alertsRoutes.use(requireAuth);
alertsRoutes.get("/", alertsController.listAlerts);
alertsRoutes.patch("/:id", requireRole("admin", "analyst"), alertsController.updateAlert);

