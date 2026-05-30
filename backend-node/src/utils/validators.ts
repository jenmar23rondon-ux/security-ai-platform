import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "analyst", "viewer"]).default("viewer")
});

export const createEventSchema = z.object({
  type: z.enum([
    "login_success",
    "login_failed",
    "api_abuse",
    "suspicious_activity",
    "unknown_ip",
    "geo_anomaly",
    "system"
  ]),
  description: z.string().min(3),
  ip: z.string().min(3),
  country: z.string().optional(),
  userAgent: z.string().optional(),
  failedAttempts: z.number().int().min(0).default(0),
  requestCount: z.number().int().min(0).default(0),
  metadata: z.record(z.unknown()).optional(),
  userId: z.number().int().optional()
});

export const updateAlertSchema = z.object({
  status: z.enum(["abierta", "investigando", "resuelta"])
});

