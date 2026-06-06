import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createUserSchema } from "../utils/validators";
import { createUser as createUserService } from "../services/auth.service";
import { createAuditLog } from "../services/audit.service";

export async function listUsers(_req: AuthRequest, res: Response) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }
  });

  res.json(users);
}

export async function createUser(req: AuthRequest, res: Response) {
  const data = createUserSchema.parse(req.body);
  const user = await createUserService(data, { userId: req.user?.id, ip: req.ip });
  res.status(201).json(user);
}

export async function deleteUser(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "ID invalido" });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { active: false },
    select: { id: true, name: true, email: true, role: true, active: true }
  });

  await createAuditLog({
    action: "user_deleted",
    entity: "User",
    entityId: user.id,
    userId: req.user?.id,
    ip: req.ip,
    details: { email: user.email, role: user.role, softDelete: true }
  });

  res.json(user);
}
