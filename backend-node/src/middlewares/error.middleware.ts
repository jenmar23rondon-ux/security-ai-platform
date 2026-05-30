import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logError } from "../utils/logger";

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Datos invalidos", errors: error.flatten() });
  }

  logError("Unhandled error", error);
  return res.status(500).json({ message: "Error interno del servidor" });
}

