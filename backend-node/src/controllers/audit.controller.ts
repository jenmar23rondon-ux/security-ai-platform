import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { listAuditLogs } from "../services/audit.service";

export async function listAudit(_req: AuthRequest, res: Response) {
  const logs = await listAuditLogs();
  res.json(logs);
}
