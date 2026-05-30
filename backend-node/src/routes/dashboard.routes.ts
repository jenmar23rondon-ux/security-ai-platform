import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", requireAuth, dashboardController.dashboard);

