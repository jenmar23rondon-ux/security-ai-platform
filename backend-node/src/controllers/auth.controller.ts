import { Request, Response } from "express";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from "../utils/validators";
import * as authService from "../services/auth.service";

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  try {
    const result = await authService.login(data.email, data.password, req.ip, req.headers["user-agent"]);
    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Credenciales invalidas";
    return res.status(message.includes("bloqueada") ? 423 : 401).json({ message });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const data = forgotPasswordSchema.parse(req.body);
  const result = await authService.forgotPassword(data.email, req.ip);
  res.json(result);
}

export async function resetPassword(req: Request, res: Response) {
  const data = resetPasswordSchema.parse(req.body);

  try {
    const result = await authService.resetPassword(data.token, data.password, req.ip);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Token invalido o expirado";
    res.status(400).json({ message });
  }
}
