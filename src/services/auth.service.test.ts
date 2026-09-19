import { Prisma, UserRole } from "../generated/prisma/client.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUser, login, registerUser } from "./auth.service.js";
import { hashPassword } from "../utils/password.js";
import { verifyAccessToken } from "../utils/token.js";

const prismaMocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  userCreate: vi.fn(),
  studentProfileCreate: vi.fn(),
  recruiterProfileCreate: vi.fn(),
  userFindUnique: vi.fn(),
}));

vi.mock("../lib/prisma.js", () => ({
  getPrisma: () => ({
    $transaction: prismaMocks.transaction,
    user: { findUnique: prismaMocks.userFindUnique },
  }),
}));

const createdAt = new Date("2026-09-14T00:00:00.000Z");
const updatedAt = new Date("2026-09-14T00:00:00.000Z");
const safeStudent = {
  id: "46b9d2ab-9b98-4e8c-a91e-341a7b264ca9",
  name: "Student Name",
  email: "student@example.com",
  role: UserRole.STUDENT,
  createdAt,
  updatedAt,
};
const studentProfile = {
  id: "52c6a16e-7768-4c24-9e27-0762685b9d89",
  university: "Example University",
  degree: "B.Tech",
  graduationYear: 2027,
  cgpa: null,
  targetRole: null,
  bio: null,
};

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMocks.transaction.mockImplementation(async (operation) =>
      operation({
        user: { create: prismaMocks.userCreate },
        studentProfile: { create: prismaMocks.studentProfileCreate },
        recruiterProfile: { create: prismaMocks.recruiterProfileCreate },
      }),
    );
    prismaMocks.userCreate.mockResolvedValue(safeStudent);
    prismaMocks.studentProfileCreate.mockResolvedValue(studentProfile);
  });

  it("uses the transaction client for both writes and stores only a bcrypt hash", async () => {
    const result = await registerUser({
      name: "Student Name",
      email: "student@example.com",
      password: "password123",
      role: "STUDENT",
      university: "Example University",
      degree: "B.Tech",
      graduationYear: 2027,
    });

    expect(prismaMocks.transaction).toHaveBeenCalledOnce();
    expect(prismaMocks.userCreate).toHaveBeenCalledOnce();
    const createInput = prismaMocks.userCreate.mock.calls[0]?.[0];
    expect(createInput.data.passwordHash).toMatch(/^\$2[aby]\$12\$/);
    expect(createInput.data).not.toHaveProperty("password");
    expect(prismaMocks.studentProfileCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: safeStudent.id }) }),
    );
    expect(result).toEqual({ user: safeStudent, profile: studentProfile });
  });

  it("propagates a profile failure from inside the transaction callback", async () => {
    const profileFailure = new Error("profile write failed");
    prismaMocks.studentProfileCreate.mockRejectedValue(profileFailure);

    await expect(
      registerUser({
        name: "Student Name",
        email: "student@example.com",
        password: "password123",
        role: "STUDENT",
        university: "Example University",
        degree: "B.Tech",
        graduationYear: 2027,
      }),
    ).rejects.toBe(profileFailure);

    expect(prismaMocks.userCreate).toHaveBeenCalledOnce();
    expect(prismaMocks.studentProfileCreate).toHaveBeenCalledOnce();
  });

  it("maps a unique email race to EMAIL_ALREADY_EXISTS", async () => {
    prismaMocks.transaction.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "7.10.0",
        meta: { target: ["email"] },
      }),
    );

    await expect(
      registerUser({
        name: "Student Name",
        email: "student@example.com",
        password: "password123",
        role: "STUDENT",
        university: "Example University",
        degree: "B.Tech",
        graduationYear: 2027,
      }),
    ).rejects.toMatchObject({ statusCode: 409, code: "EMAIL_ALREADY_EXISTS" });
  });
});

describe("login", () => {
  const tokenConfig = {
    jwtSecret: "12345678901234567890123456789012",
    jwtExpiresIn: "15m" as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("verifies the password and returns the exact safe token response", async () => {
    const passwordHash = await hashPassword("password123");
    prismaMocks.userFindUnique.mockResolvedValue({ ...safeStudent, passwordHash });

    const result = await login(
      { email: "student@example.com", password: "password123" },
      tokenConfig,
    );

    expect(result).toMatchObject({
      tokenType: "Bearer",
      expiresIn: "15m",
      user: safeStudent,
    });
    expect(result).not.toHaveProperty("passwordHash");
    await expect(verifyAccessToken(result.accessToken, tokenConfig)).resolves.toEqual({
      userId: safeStudent.id,
    });
  });

  it("uses the same error for a wrong password and nonexistent email", async () => {
    const passwordHash = await hashPassword("password123");
    prismaMocks.userFindUnique.mockResolvedValueOnce({ ...safeStudent, passwordHash });

    await expect(
      login({ email: "student@example.com", password: "wrongpass" }, tokenConfig),
    ).rejects.toMatchObject({ statusCode: 401, code: "INVALID_CREDENTIALS" });

    prismaMocks.userFindUnique.mockResolvedValueOnce(null);
    await expect(
      login({ email: "missing@example.com", password: "wrongpass" }, tokenConfig),
    ).rejects.toMatchObject({ statusCode: 401, code: "INVALID_CREDENTIALS" });
  });
});

describe("getCurrentUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a student with the required student profile", async () => {
    prismaMocks.userFindUnique.mockResolvedValue({
      ...safeStudent,
      studentProfile,
    });

    await expect(getCurrentUser(safeStudent.id, UserRole.STUDENT)).resolves.toEqual({
      user: safeStudent,
      profile: studentProfile,
    });
  });

  it("returns a recruiter with the required recruiter profile", async () => {
    const recruiter = { ...safeStudent, role: UserRole.RECRUITER };
    const profile = {
      id: "c38db577-70d9-4f65-b086-d349f8dd93f5",
      company: "SkillBridge Labs",
      designation: "Talent Partner",
    };
    prismaMocks.userFindUnique.mockResolvedValue({
      ...recruiter,
      recruiterProfile: profile,
    });

    await expect(getCurrentUser(recruiter.id, UserRole.RECRUITER)).resolves.toEqual({
      user: recruiter,
      profile,
    });
  });

  it("returns a stable null profile for an admin", async () => {
    const admin = { ...safeStudent, role: UserRole.ADMIN };
    prismaMocks.userFindUnique.mockResolvedValue(admin);

    await expect(getCurrentUser(admin.id, UserRole.ADMIN)).resolves.toEqual({
      user: admin,
      profile: null,
    });
  });

  it("returns USER_NOT_FOUND if the user disappears after authentication", async () => {
    prismaMocks.userFindUnique.mockResolvedValue(null);

    await expect(
      getCurrentUser(safeStudent.id, UserRole.STUDENT),
    ).rejects.toMatchObject({ statusCode: 401, code: "USER_NOT_FOUND" });
  });

  it.each([
    UserRole.STUDENT,
    UserRole.RECRUITER,
  ])("treats a missing %s profile as a non-operational integrity error", async (role) => {
    prismaMocks.userFindUnique.mockResolvedValue({
      ...safeStudent,
      role,
      ...(role === UserRole.STUDENT
        ? { studentProfile: null }
        : { recruiterProfile: null }),
    });

    await expect(getCurrentUser(safeStudent.id, role)).rejects.toMatchObject({
      statusCode: 500,
      code: "PROFILE_INTEGRITY_ERROR",
      isOperational: false,
    });
  });
});
