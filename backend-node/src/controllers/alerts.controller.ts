import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { updateAlertSchema } from "../utils/validators";
import * as alertsService from "../services/alerts.service";

export async function listAlerts(_req: AuthRequest, res: Response) {
  const alerts = await alertsService.listAlerts();
  res.json(alerts);
}

export async function updateAlert(req: AuthRequest, res: Response) {
  const data = updateAlertSchema.parse(req.body);
  const alert = await alertsService.updateAlert(Number(req.params.id), data.status);
  res.json(alert);
}

