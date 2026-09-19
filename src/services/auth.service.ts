import { Prisma, UserRole } from "../generated/prisma/client.js";
import { getPrisma } from "../lib/prisma.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import { AppError } from "../utils/app-error.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { createAccessToken, type TokenConfig } from "../utils/token.js";

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const studentProfileSelect = {
  id: true,
  university: true,
  degree: true,
  graduationYear: true,
  cgpa: true,
  targetRole: true,
  bio: true,
} satisfies Prisma.StudentProfileSelect;

const recruiterProfileSelect = {
  id: true,
  company: true,
  designation: true,
} satisfies Prisma.RecruiterProfileSelect;

export type SafeUser = Prisma.UserGetPayload<{ select: typeof safeUserSelect }>;
export type StudentProfileResponse = Prisma.StudentProfileGetPayload<{
  select: typeof studentProfileSelect;
}>;
export type RecruiterProfileResponse = Prisma.RecruiterProfileGetPayload<{
  select: typeof recruiterProfileSelect;
}>;

const loginUserSelect = {
  ...safeUserSelect,
  passwordHash: true,
} satisfies Prisma.UserSelect;

function invalidCredentials(): AppError {
  return new AppError({
    statusCode: 401,
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password",
  });
}

export async function registerUser(input: RegisterInput) {
  const passwordHash = await hashPassword(input.password);
  const prisma = getPrisma();

  try {
    return await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          role: input.role,
        },
        select: safeUserSelect,
      });

      if (input.role === UserRole.STUDENT) {
        const profile = await transaction.studentProfile.create({
          data: {
            userId: user.id,
            university: input.university,
            degree: input.degree,
            graduationYear: input.graduationYear,
          },
          select: studentProfileSelect,
        });

        return { user, profile };
      }

      const profile = await transaction.recruiterProfile.create({
        data: {
          userId: user.id,
          company: input.company,
          designation: input.designation,
        },
        select: recruiterProfileSelect,
      });

      return { user, profile };
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError({
        statusCode: 409,
        code: "EMAIL_ALREADY_EXISTS",
        message: "An account with this email already exists",
      });
    }

    throw error;
  }
}

export async function login(input: LoginInput, config: TokenConfig) {
  const databaseUser = await getPrisma().user.findUnique({
    where: { email: input.email },
    select: loginUserSelect,
  });

  if (!databaseUser) {
    throw invalidCredentials();
  }

  const passwordMatches = await verifyPassword(input.password, databaseUser.passwordHash);

  if (!passwordMatches) {
    throw invalidCredentials();
  }

  const { passwordHash: _passwordHash, ...user } = databaseUser;
  const accessToken = await createAccessToken(user.id, config);

  return {
    accessToken,
    tokenType: "Bearer" as const,
    expiresIn: config.jwtExpiresIn,
    user,
  };
}

function userNotFound(): AppError {
  return new AppError({
    statusCode: 401,
    code: "USER_NOT_FOUND",
    message: "The authenticated user no longer exists",
  });
}

function profileIntegrityError(userId: string, role: UserRole): AppError {
  return new AppError({
    statusCode: 500,
    code: "PROFILE_INTEGRITY_ERROR",
    message: `${role} profile missing for user ${userId}`,
    isOperational: false,
  });
}

export async function getCurrentUser(userId: string, role: UserRole) {
  const prisma = getPrisma();

  if (role === UserRole.STUDENT) {
    const record = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...safeUserSelect,
        studentProfile: { select: studentProfileSelect },
      },
    });

    if (!record) throw userNotFound();

    const { studentProfile, ...user } = record;
    if (!studentProfile) throw profileIntegrityError(userId, role);

    return { user, profile: studentProfile };
  }

  if (role === UserRole.RECRUITER) {
    const record = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...safeUserSelect,
        recruiterProfile: { select: recruiterProfileSelect },
      },
    });

    if (!record) throw userNotFound();

    const { recruiterProfile, ...user } = record;
    if (!recruiterProfile) throw profileIntegrityError(userId, role);

    return { user, profile: recruiterProfile };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: safeUserSelect,
  });

  if (!user) throw userNotFound();

  return { user, profile: null };
}
