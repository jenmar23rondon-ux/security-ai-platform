import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "change_me_in_production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  aiServiceUrl: process.env.AI_SERVICE_URL ?? "http://localhost:8000",
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};

export function isAllowedOrigin(origin?: string) {
  if (!origin) return true;
  return env.allowedOrigins.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}
