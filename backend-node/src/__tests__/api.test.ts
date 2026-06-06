import bcrypt from "bcryptjs";
import request from "supertest";
import { signToken } from "../utils/jwt";

const mockPrisma = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn()
  },
  auditLog: {
    create: jest.fn(),
    count: jest.fn()
  },
  securityEvent: {
    create: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn()
  },
  riskScore: {
    create: jest.fn(),
    groupBy: jest.fn()
  },
  alert: {
    create: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn()
  }
};

jest.mock("../config/prisma", () => ({ prisma: mockPrisma }));

import { app } from "../app";

describe("Security AI API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET / responds with API health", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("POST /auth/login authenticates valid credentials", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      name: "Admin",
      email: "admin@test.com",
      password: bcrypt.hashSync("Admin1234", 10),
      role: "admin",
      active: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    mockPrisma.user.update.mockResolvedValue({});
    mockPrisma.auditLog.create.mockResolvedValue({});

    const res = await request(app).post("/auth/login").send({ email: "admin@test.com", password: "Admin1234" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe("admin@test.com");
  });

  it("POST /users creates a user for admins", async () => {
    const token = signToken({ id: 1, email: "admin@test.com", role: "admin" });
    mockPrisma.user.create.mockResolvedValue({
      id: 2,
      name: "Analyst",
      email: "analyst@test.com",
      password: "hashed",
      role: "analyst",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    mockPrisma.auditLog.create.mockResolvedValue({});

    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Analyst", email: "analyst@test.com", password: "Analyst1234", role: "analyst" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("analyst@test.com");
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
  });

  it("GET /users lists users for admins", async () => {
    const token = signToken({ id: 1, email: "admin@test.com", role: "admin" });
    mockPrisma.user.findMany.mockResolvedValue([
      { id: 1, name: "Admin", email: "admin@test.com", role: "admin", active: true, createdAt: new Date() }
    ]);

    const res = await request(app).get("/users").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
