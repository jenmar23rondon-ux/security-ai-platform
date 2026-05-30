import { Request, Response } from "express";
import { loginSchema } from "../utils/validators";
import * as authService from "../services/auth.service";

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  try {
    const result = await authService.login(data.email, data.password);
    return res.json(result);
  } catch {
    return res.status(401).json({ message: "Credenciales invalidas" });
  }
}

