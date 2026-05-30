import { RiskLevel } from "@prisma/client";
import { analyzeRisk } from "./python-ai.service";

const riskMap: Record<string, RiskLevel> = {
  bajo: "bajo",
  medio: "medio",
  alto: "alto",
  critico: "critico"
};

export async function calculateRisk(input: {
  ip: string;
  failedAttempts: number;
  requestCount: number;
  eventType: string;
  country?: string | null;
}) {
  const now = new Date();
  const ai = await analyzeRisk({
    ...input,
    hour: now.getHours()
  });

  return {
    score: Math.max(0, Math.min(100, ai.score)),
    level: riskMap[ai.riesgo] ?? "bajo",
    reasons: ai.reasons,
    model: ai.model
  };
}

