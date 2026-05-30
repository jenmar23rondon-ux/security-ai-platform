import { Router } from "express";
import * as eventsController from "../controllers/events.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/roles.middleware";

export const eventsRoutes = Router();

eventsRoutes.use(requireAuth);
eventsRoutes.get("/", eventsController.listEvents);
eventsRoutes.post("/", requireRole("admin", "analyst"), eventsController.createEvent);

