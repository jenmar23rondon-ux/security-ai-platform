import { EventType, Prisma, RiskLevel } from "@prisma/client";
import { prisma } from "../config/prisma";
import { calculateRisk } from "./risk.service";

export async function listEvents() {
  return prisma.securityEvent.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } }, riskScore: true, alerts: true }
  });
}

export async function createEvent(data: {
  type: EventType;
  description: string;
  ip: string;
  country?: string;
  userAgent?: string;
  failedAttempts: number;
  requestCount: number;
  metadata?: Prisma.InputJsonValue;
  userId?: number;
}) {
  const event = await prisma.securityEvent.create({ data });
  const risk = await calculateRisk({
    ip: event.ip,
    failedAttempts: event.failedAttempts,
    requestCount: event.requestCount,
    eventType: event.type,
    country: event.country
  });

  const riskScore = await prisma.riskScore.create({
    data: {
      eventId: event.id,
      score: risk.score,
      level: risk.level,
      reasons: risk.reasons,
      model: risk.model
    }
  });

  let alert = null;
  if (["alto", "critico"].includes(risk.level)) {
    alert = await prisma.alert.create({
      data: {
        eventId: event.id,
        level: risk.level as RiskLevel,
        title: risk.level === "critico" ? "Riesgo critico detectado" : "Riesgo alto detectado",
        message: `${event.description}. Score: ${risk.score}. ${risk.reasons.join(" ")}`
      }
    });
  }

  return { ...event, riskScore, alerts: alert ? [alert] : [] };
}

