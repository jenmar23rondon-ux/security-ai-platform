import { prisma } from "../config/prisma";

export async function getDashboard() {
  const [totalEvents, openAlerts, criticalAlerts, activeUsers, recentEvents, recentAlerts, risks, auditCount] = await Promise.all([
    prisma.securityEvent.count(),
    prisma.alert.count({ where: { status: { in: ["abierta", "investigando"] } } }),
    prisma.alert.count({ where: { level: { in: ["alto", "critico"] }, status: { not: "resuelta" } } }),
    prisma.user.count({ where: { active: true } }),
    prisma.securityEvent.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { riskScore: true }
    }),
    prisma.alert.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { event: true }
    }),
    prisma.riskScore.groupBy({
      by: ["level"],
      _count: { level: true }
    }),
    prisma.auditLog.count()
  ]);

  const eventsByType = await prisma.securityEvent.groupBy({
    by: ["type"],
    _count: { type: true }
  });

  const suspiciousIps = await prisma.securityEvent.groupBy({
    by: ["ip"],
    where: {
      OR: [
        { type: "login_failed" },
        { type: "api_abuse" },
        { type: "suspicious_activity" },
        { riskScore: { is: { level: { in: ["alto", "critico"] } } } }
      ]
    },
    _count: { ip: true },
    _sum: { failedAttempts: true, requestCount: true },
    orderBy: { _count: { ip: "desc" } },
    take: 8
  });

  return {
    stats: { totalEvents, openAlerts, criticalAlerts, activeUsers, auditCount },
    recentEvents,
    recentAlerts,
    suspiciousIps: suspiciousIps.map((item) => ({
      ip: item.ip,
      events: item._count.ip,
      failedAttempts: item._sum.failedAttempts ?? 0,
      requestCount: item._sum.requestCount ?? 0,
      status: (item._sum.failedAttempts ?? 0) >= 10 || item._count.ip >= 5 ? "Sospechoso" : "Vigilancia"
    })),
    charts: {
      risks: risks.map((item) => ({ name: item.level, value: item._count.level })),
      eventsByType: eventsByType.map((item) => ({ name: item.type, value: item._count.type }))
    }
  };
}
