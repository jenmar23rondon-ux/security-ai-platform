import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../config/prisma";
import { signToken } from "../utils/jwt";
import { createAuditLog } from "./audit.service";
import { createEvent } from "./events.service";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const RESET_TOKEN_MINUTES = 30;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function login(email: string, password: string, ip?: string, userAgent?: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.active) {
    await createEvent({
      type: "login_failed",
      description: `Intento de login fallido para ${email}`,
      ip: ip ?? "unknown",
      userAgent,
      failedAttempts: 1,
      requestCount: 1,
      metadata: { reason: "unknown_or_inactive_user", email }
    });
    throw new Error("Credenciales invalidas");
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    await createAuditLog({
      action: "login_blocked",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      ip,
      details: { lockedUntil: user.lockedUntil }
    });
    throw new Error("Cuenta bloqueada temporalmente");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const failedLoginAttempts = user.failedLoginAttempts + 1;
    const lockedUntil =
      failedLoginAttempts >= MAX_LOGIN_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts, lockedUntil }
    });

    await createAuditLog({
      action: lockedUntil ? "login_locked" : "login_failed",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      ip,
      details: { failedLoginAttempts, lockedUntil }
    });

    await createEvent({
      type: "login_failed",
      description: lockedUntil
        ? `Cuenta bloqueada por ${failedLoginAttempts} intentos fallidos`
        : `Login fallido para ${user.email}`,
      ip: ip ?? "unknown",
      userAgent,
      failedAttempts: failedLoginAttempts,
      requestCount: 1,
      userId: user.id,
      metadata: { email: user.email, locked: Boolean(lockedUntil) }
    });

    throw new Error("Credenciales invalidas");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null }
  });

  await createAuditLog({
    action: "login_success",
    entity: "User",
    entityId: user.id,
    userId: user.id,
    ip,
    details: { email: user.email }
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  const { password: _password, resetTokenHash: _resetTokenHash, ...safeUser } = user;

  return { token, user: safeUser };
}

export async function createUser(
  data: { name: string; email: string; password: string; role: "admin" | "analyst" | "viewer" },
  actor?: { userId?: number; ip?: string }
) {
  const password = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: { ...data, password }
  });

  await createAuditLog({
    action: "user_created",
    entity: "User",
    entityId: user.id,
    userId: actor?.userId,
    ip: actor?.ip,
    details: { email: user.email, role: user.role }
  });

  const { password: _password, resetTokenHash: _resetTokenHash, ...safeUser } = user;
  return safeUser;
}

export async function forgotPassword(email: string, ip?: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) {
    return { message: "Si el correo existe, se genero un token temporal" };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetTokenHash: hashToken(resetToken),
      resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000)
    }
  });

  await createAuditLog({
    action: "password_reset_requested",
    entity: "User",
    entityId: user.id,
    userId: user.id,
    ip,
    details: { email: user.email }
  });

  return {
    message: "Token temporal generado",
    resetToken,
    expiresInMinutes: RESET_TOKEN_MINUTES
  };
}

export async function resetPassword(token: string, password: string, ip?: string) {
  const tokenHash = hashToken(token);
  const user = await prisma.user.findFirst({
    where: {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: { gt: new Date() },
      active: true
    }
  });

  if (!user) {
    throw new Error("Token invalido o expirado");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(password, 10),
      failedLoginAttempts: 0,
      lockedUntil: null,
      resetTokenHash: null,
      resetTokenExpiresAt: null
    }
  });

  await createAuditLog({
    action: "password_reset_completed",
    entity: "User",
    entityId: user.id,
    userId: user.id,
    ip,
    details: { email: user.email }
  });

  return { message: "Contrasena actualizada" };
}
