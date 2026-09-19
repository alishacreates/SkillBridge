import { z } from "zod";
import { UserRole } from "../generated/prisma/client.js";

const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(320);

function withinBcryptLimit(password: string): boolean {
  return Buffer.byteLength(password, "utf8") <= 72;
}

const passwordSchema = z.string().min(8).refine(withinBcryptLimit, {
    message: "Password must not exceed 72 UTF-8 bytes",
  });

const commonRegistrationFields = {
  name: z.string().trim().min(1).max(120),
  email: normalizedEmailSchema,
  password: passwordSchema,
};

const studentRegistrationSchema = z.object({
  ...commonRegistrationFields,
  role: z.literal(UserRole.STUDENT),
  university: z.string().trim().min(1).max(200),
  degree: z.string().trim().min(1).max(160),
  graduationYear: z.number().int(),
});

const recruiterRegistrationSchema = z.object({
  ...commonRegistrationFields,
  role: z.literal(UserRole.RECRUITER),
  company: z.string().trim().min(1).max(200),
  designation: z.string().trim().min(1).max(120),
});

export const registerBodySchema = z.discriminatedUnion("role", [
  studentRegistrationSchema,
  recruiterRegistrationSchema,
]);

export const registerRequestSchema = z.object({
  body: registerBodySchema,
  params: z.object({}),
  query: z.object({}),
});

export const loginBodySchema = z.object({
  email: normalizedEmailSchema,
  password: z.string().min(1).refine(withinBcryptLimit, {
    message: "Password must not exceed 72 UTF-8 bytes",
  }),
});

export const loginRequestSchema = z.object({
  body: loginBodySchema,
  params: z.object({}),
  query: z.object({}),
});

export type RegisterInput = z.output<typeof registerBodySchema>;
export type RegisterRequest = z.output<typeof registerRequestSchema>;
export type LoginInput = z.output<typeof loginBodySchema>;
export type LoginRequest = z.output<typeof loginRequestSchema>;
