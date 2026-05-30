import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { signToken } from "../utils/jwt";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.active) {
    throw new Error("Credenciales invalidas");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Credenciales invalidas");
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  const { password: _password, ...safeUser } = user;

  return { token, user: safeUser };
}

export async function createUser(data: { name: string; email: string; password: string; role: "admin" | "analyst" | "viewer" }) {
  const password = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: { ...data, password }
  });

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

