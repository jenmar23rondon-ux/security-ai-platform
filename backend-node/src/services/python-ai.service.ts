import { env } from "../config/env";
import { logError } from "../utils/logger";

export type AiRiskResponse = {
  riesgo: "bajo" | "medio" | "alto" | "critico";
  score: number;
  reasons: string[];
  model: string;
};

export type AiRiskInput = {
  ip: string;
  hour: number;
  failedAttempts: number;
  requestCount: number;
  eventType: string;
  country?: string | null;
};

export async function analyzeRisk(input: AiRiskInput): Promise<AiRiskResponse> {
  try {
    const response = await fetch(`${env.aiServiceUrl}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error(`AI service responded ${response.status}`);
    }

    return (await response.json()) as AiRiskResponse;
  } catch (error) {
    logError("AI service unavailable, using fallback rules", error);

    const score = Math.min(100, input.failedAttempts * 8 + input.requestCount * 2 + (input.hour < 5 ? 20 : 0));
    const riesgo = score >= 85 ? "critico" : score >= 70 ? "alto" : score >= 40 ? "medio" : "bajo";

    return {
      riesgo,
      score,
      reasons: ["Analisis local de respaldo por servicio IA no disponible"],
      model: "node-fallback-v1"
    };
  }
}

