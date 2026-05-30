import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createUserSchema } from "../utils/validators";
import { createUser as createUserService } from "../services/auth.service";

export async function listUsers(_req: AuthRequest, res: Response) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }
  });

  res.json(users);
}

export async function createUser(req: AuthRequest, res: Response) {
  const data = createUserSchema.parse(req.body);
  const user = await createUserService(data);
  res.status(201).json(user);
}

