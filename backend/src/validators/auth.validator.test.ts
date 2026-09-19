import { describe, expect, it } from "vitest";
import { loginRequestSchema, registerRequestSchema } from "./auth.validator.js";

function requestWithBody(body: unknown) {
  return { body, params: {}, query: {} };
}

describe("registerRequestSchema", () => {
  it("normalizes a valid student registration without changing the password", () => {
    const password = "  pass word  ";
    const result = registerRequestSchema.parse(
      requestWithBody({
        name: "  Student Name  ",
        email: "  STUDENT@Example.COM ",
        password,
        role: "STUDENT",
        university: "  Example University ",
        degree: " B.Tech ",
        graduationYear: 2027,
      }),
    );

    expect(result.body).toEqual({
      name: "Student Name",
      email: "student@example.com",
      password,
      role: "STUDENT",
      university: "Example University",
      degree: "B.Tech",
      graduationYear: 2027,
    });
  });

  it("accepts the required recruiter profile fields", () => {
    expect(
      registerRequestSchema.parse(
        requestWithBody({
          name: "Recruiter Name",
          email: "recruiter@example.com",
          password: "password123",
          role: "RECRUITER",
          company: "SkillBridge Labs",
          designation: "Talent Partner",
        }),
      ).body,
    ).toMatchObject({ role: "RECRUITER", company: "SkillBridge Labs" });
  });

  it("rejects public ADMIN registration", () => {
    expect(() =>
      registerRequestSchema.parse(
        requestWithBody({
          name: "Admin",
          email: "admin@example.com",
          password: "password123",
          role: "ADMIN",
        }),
      ),
    ).toThrow();
  });

  it("rejects a student without required profile fields", () => {
    expect(() =>
      registerRequestSchema.parse(
        requestWithBody({
          name: "Student",
          email: "student@example.com",
          password: "password123",
          role: "STUDENT",
        }),
      ),
    ).toThrow();
  });

  it("enforces the bcrypt limit using UTF-8 bytes", () => {
    const base = {
      name: "Student",
      email: "student@example.com",
      role: "STUDENT",
      university: "University",
      degree: "Degree",
      graduationYear: 2027,
    };

    expect(() =>
      registerRequestSchema.parse(requestWithBody({ ...base, password: "🔐".repeat(18) })),
    ).not.toThrow();
    expect(() =>
      registerRequestSchema.parse(requestWithBody({ ...base, password: "🔐".repeat(19) })),
    ).toThrow();
  });
});

describe("loginRequestSchema", () => {
  it("normalizes email without changing the supplied password", () => {
    const password = "  password  ";
    const result = loginRequestSchema.parse(
      requestWithBody({ email: "  USER@Example.COM ", password }),
    );

    expect(result.body).toEqual({ email: "user@example.com", password });
  });

  it("rejects an invalid login payload", () => {
    expect(() => loginRequestSchema.parse(requestWithBody({ email: "not-email" }))).toThrow();
  });

  it("enforces bcrypt's UTF-8 byte limit for login passwords", () => {
    expect(() =>
      loginRequestSchema.parse(
        requestWithBody({ email: "user@example.com", password: "🔐".repeat(19) }),
      ),
    ).toThrow();
  });
});
