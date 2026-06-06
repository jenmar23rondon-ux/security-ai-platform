import fs from "fs";
import path from "path";
import winston from "winston";

const logsDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, "app.log") }),
    new winston.transports.File({ filename: path.join(logsDir, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logsDir, "security.log"), level: "warn" }),
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  ]
});

export function logInfo(message: string, meta?: unknown) {
  logger.info(message, meta);
}

export function logWarning(message: string, meta?: unknown) {
  logger.warn(message, meta);
}

export function logError(message: string, meta?: unknown) {
  logger.error(message, meta);
}
