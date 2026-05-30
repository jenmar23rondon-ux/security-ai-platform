import { prisma } from "../config/prisma";

export async function getDashboard() {
  const [totalEvents, openAlerts, criticalAlerts, activeUsers, recentEvents, recentAlerts, risks] = await Promise.all([
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
    })
  ]);

  const eventsByType = await prisma.securityEvent.groupBy({
    by: ["type"],
    _count: { type: true }
  });

  return {
    stats: { totalEvents, openAlerts, criticalAlerts, activeUsers },
    recentEvents,
    recentAlerts,
    charts: {
      risks: risks.map((item) => ({ name: item.level, value: item._count.level })),
      eventsByType: eventsByType.map((item) => ({ name: item.type, value: item._count.type }))
    }
  };
}

