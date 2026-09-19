import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import type { AppConfig } from "../config/env.js";
import { AppError } from "./app-error.js";

const JWT_ALGORITHM = "HS256";
const JWT_ISSUER = "skillbridge-api";
const JWT_AUDIENCE = "skillbridge-api";
const subjectSchema = z.string().uuid();

export type TokenConfig = Pick<AppConfig, "jwtSecret" | "jwtExpiresIn">;

function signingKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function createAccessToken(
  userId: string,
  config: TokenConfig,
): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(userId)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(config.jwtExpiresIn)
    .sign(signingKey(config.jwtSecret));
}

export async function verifyAccessToken(
  token: string,
  config: TokenConfig,
): Promise<{ userId: string }> {
  try {
    const { payload } = await jwtVerify(token, signingKey(config.jwtSecret), {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return { userId: subjectSchema.parse(payload.sub) };
  } catch {
    throw new AppError({
      statusCode: 401,
      code: "INVALID_TOKEN",
      message: "Invalid or expired access token",
    });
  }
}
