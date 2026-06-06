ALTER TABLE "users"
ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lockedUntil" TIMESTAMP(3),
ADD COLUMN "resetTokenHash" TEXT,
ADD COLUMN "resetTokenExpiresAt" TIMESTAMP(3);

ALTER TABLE "audit_logs"
ADD COLUMN "ip" TEXT;

CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
