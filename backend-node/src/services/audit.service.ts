import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export async function createAuditLog(data: {
  action: string;
  entity: string;
  entityId?: number;
  userId?: number;
  ip?: string;
  details?: Prisma.InputJsonValue;
}) {
  return prisma.auditLog.create({
    data: {
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      userId: data.userId,
      ip: data.ip,
      details: data.details
    }
  });
}

export async function listAuditLogs() {
  return prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true, role: true } } }
  });
}
