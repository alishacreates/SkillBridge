import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { UserRole } from "./generated/prisma/client.js";
import { createApp } from "./app.js";
import type { AppConfig } from "./config/env.js";
import { hashPassword } from "./utils/password.js";
import { createAccessToken } from "./utils/token.js";

const prismaMocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  userCreate: vi.fn(),
  studentProfileCreate: vi.fn(),
  recruiterProfileCreate: vi.fn(),
  userFindUnique: vi.fn(),
}));

vi.mock("./lib/prisma.js", () => ({
  getPrisma: () => ({
    $transaction: prismaMocks.transaction,
    user: { findUnique: prismaMocks.userFindUnique },
  }),
}));

const config: AppConfig = {
  nodeEnv: "test",
  port: 3000,
  databaseUrl: "postgresql://test:test@localhost:5432/skillbridge_test",
  jwtSecret: "12345678901234567890123456789012",
  jwtExpiresIn: "15m",
  frontendUrl: undefined,
};
const timestamps = {
  createdAt: new Date("2026-09-14T00:00:00.000Z"),
  updatedAt: new Date("2026-09-14T00:00:00.000Z"),
};
let loginPasswordHash: string;

beforeAll(async () => {
  loginPasswordHash = await hashPassword("password123");
});

describe("authentication API registration", () => {
  const app = createApp(config);

  beforeEach(() => {
    vi.clearAllMocks();
    prismaMocks.transaction.mockImplementation(async (operation) =>
      operation({
        user: { create: prismaMocks.userCreate },
        studentProfile: { create: prismaMocks.studentProfileCreate },
        recruiterProfile: { create: prismaMocks.recruiterProfileCreate },
      }),
    );
  });

  it("registers a student and returns only safe user/profile data", async () => {
    const user = {
      id: "46b9d2ab-9b98-4e8c-a91e-341a7b264ca9",
      name: "Student Name",
      email: "student@example.com",
      role: UserRole.STUDENT,
      ...timestamps,
    };
    const profile = {
      id: "52c6a16e-7768-4c24-9e27-0762685b9d89",
      university: "Example University",
      degree: "B.Tech",
      graduationYear: 2027,
      cgpa: null,
      targetRole: null,
      bio: null,
    };
    prismaMocks.userCreate.mockResolvedValue(user);
    prismaMocks.studentProfileCreate.mockResolvedValue(profile);

    const response = await request(app).post("/api/auth/register").send({
      name: "Student Name",
      email: "STUDENT@example.com",
      password: "password123",
      role: "STUDENT",
      university: "Example University",
      degree: "B.Tech",
      graduationYear: 2027,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        user: { ...user, createdAt: timestamps.createdAt.toISOString(), updatedAt: timestamps.updatedAt.toISOString() },
        profile,
      },
    });
    expect(JSON.stringify(response.body)).not.toMatch(/password|accessToken/i);
  });

  it("registers a recruiter with its role-specific profile", async () => {
    const user = {
      id: "5ad6b425-3b4d-48f7-a130-58c80d2fb8b8",
      name: "Recruiter Name",
      email: "recruiter@example.com",
      role: UserRole.RECRUITER,
      ...timestamps,
    };
    const profile = {
      id: "c38db577-70d9-4f65-b086-d349f8dd93f5",
      company: "SkillBridge Labs",
      designation: "Talent Partner",
    };
    prismaMocks.userCreate.mockResolvedValue(user);
    prismaMocks.recruiterProfileCreate.mockResolvedValue(profile);

    const response = await request(app).post("/api/auth/register").send({
      name: "Recruiter Name",
      email: "recruiter@example.com",
      password: "password123",
      role: "RECRUITER",
      company: "SkillBridge Labs",
      designation: "Talent Partner",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.profile).toEqual(profile);
  });

  it("rejects public ADMIN registration", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
      role: "ADMIN",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(prismaMocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects an invalid role-specific payload", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Student",
      email: "student@example.com",
      password: "password123",
      role: "STUDENT",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("authentication API login", () => {
  const app = createApp(config);
  const safeUser = {
    id: "46b9d2ab-9b98-4e8c-a91e-341a7b264ca9",
    name: "Student Name",
    email: "student@example.com",
    role: UserRole.STUDENT,
    ...timestamps,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an access token and safe user fields after successful login", async () => {
    prismaMocks.userFindUnique.mockResolvedValue({ ...safeUser, passwordHash: loginPasswordHash });

    const response = await request(app).post("/api/auth/login").send({
      email: "  STUDENT@Example.COM ",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        accessToken: expect.any(String),
        tokenType: "Bearer",
        expiresIn: "15m",
        user: {
          ...safeUser,
          createdAt: timestamps.createdAt.toISOString(),
          updatedAt: timestamps.updatedAt.toISOString(),
        },
      },
    });
    expect(prismaMocks.userFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "student@example.com" } }),
    );
    expect(JSON.stringify(response.body)).not.toContain("passwordHash");
  });

  it.each([
    ["wrong password", true, "wrongpass"],
    ["nonexistent email", false, "password123"],
  ])("returns the same error for %s", async (_case, userExists, password) => {
    prismaMocks.userFindUnique.mockResolvedValue(
      userExists ? { ...safeUser, passwordHash: loginPasswordHash } : null,
    );

    const response = await request(app).post("/api/auth/login").send({
      email: "student@example.com",
      password,
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      },
    });
  });

  it("rejects an invalid login payload", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "not-an-email",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("authentication API current user", () => {
  const app = createApp(config);
  const userId = "46b9d2ab-9b98-4e8c-a91e-341a7b264ca9";

  beforeEach(() => vi.clearAllMocks());

  async function getMe(role: UserRole, currentUser: object | null) {
    const token = await createAccessToken(userId, config);
    prismaMocks.userFindUnique
      .mockResolvedValueOnce({ id: userId, role })
      .mockResolvedValueOnce(currentUser);

    return request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
  }

  const safeUser = {
    id: userId,
    name: "Current User",
    email: "current@example.com",
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };

  it("returns the current student and profile", async () => {
    const profile = {
      id: "52c6a16e-7768-4c24-9e27-0762685b9d89",
      university: "Example University",
      degree: "B.Tech",
      graduationYear: 2027,
      cgpa: null,
      targetRole: null,
      bio: null,
    };
    const response = await getMe(UserRole.STUDENT, {
      ...safeUser,
      role: UserRole.STUDENT,
      studentProfile: profile,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.profile).toEqual(profile);
    expect(JSON.stringify(response.body)).not.toMatch(/password/i);
  });

  it("returns the current recruiter and profile", async () => {
    const profile = {
      id: "c38db577-70d9-4f65-b086-d349f8dd93f5",
      company: "SkillBridge Labs",
      designation: "Talent Partner",
    };
    const response = await getMe(UserRole.RECRUITER, {
      ...safeUser,
      role: UserRole.RECRUITER,
      recruiterProfile: profile,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.profile).toEqual(profile);
  });

  it("returns profile null for an admin", async () => {
    const response = await getMe(UserRole.ADMIN, {
      ...safeUser,
      role: UserRole.ADMIN,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.profile).toBeNull();
  });

  it("requires authentication", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("does not expose missing-profile integrity details", async () => {
    const response = await getMe(UserRole.STUDENT, {
      ...safeUser,
      role: UserRole.STUDENT,
      studentProfile: null,
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toEqual({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  });
});
