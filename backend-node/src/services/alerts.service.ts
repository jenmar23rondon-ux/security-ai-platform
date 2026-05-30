import { AlertStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

export async function listAlerts() {
  return prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: true }
  });
}

export async function updateAlert(id: number, status: AlertStatus) {
  return prisma.alert.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === "resuelta" ? new Date() : null
    },
    include: { event: true }
  });
}

