import { Router } from "express";
import * as auditController from "../controllers/audit.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/roles.middleware";

export const auditRoutes = Router();

auditRoutes.use(requireAuth, requireRole("admin", "analyst"));
auditRoutes.get("/", auditController.listAudit);
