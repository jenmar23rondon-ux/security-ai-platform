import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export type AuthRequest = Request & {
  user?: {
    id: number;
    email: string;
    role: string;
  };
};

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    return res.status(401).json({ message: "Token invalido" });
  }
}

