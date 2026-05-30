import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getDashboard } from "../services/dashboard.service";

export async function dashboard(_req: AuthRequest, res: Response) {
  res.json(await getDashboard());
}

