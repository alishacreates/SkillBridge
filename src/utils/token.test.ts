import { SignJWT, decodeJwt } from "jose";
import { describe, expect, it } from "vitest";
import { createAccessToken, verifyAccessToken } from "./token.js";

const userId = "46b9d2ab-9b98-4e8c-a91e-341a7b264ca9";
const tokenConfig = {
  jwtSecret: "12345678901234567890123456789012",
  jwtExpiresIn: "15m" as const,
};

async function signCustomToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("skillbridge-api")
    .setAudience("skillbridge-api")
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(tokenConfig.jwtSecret));
}

describe("access-token utilities", () => {
  it("issues a minimal token and verifies its UUID subject", async () => {
    const token = await createAccessToken(userId, tokenConfig);
    const payload = decodeJwt(token);

    expect(payload.sub).toBe(userId);
    expect(payload).not.toHaveProperty("role");
    expect(payload.iss).toBe("skillbridge-api");
    expect(payload.aud).toBe("skillbridge-api");
    await expect(verifyAccessToken(token, tokenConfig)).resolves.toEqual({ userId });
  });

  it("rejects a token signed with another secret", async () => {
    const token = await createAccessToken(userId, {
      ...tokenConfig,
      jwtSecret: "abcdefghijklmnopqrstuvwxyz123456",
    });

    await expect(verifyAccessToken(token, tokenConfig)).rejects.toMatchObject({
      statusCode: 401,
      code: "INVALID_TOKEN",
    });
  });

  it("rejects expired tokens", async () => {
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuer("skillbridge-api")
      .setAudience("skillbridge-api")
      .setIssuedAt(0)
      .setExpirationTime(1)
      .sign(new TextEncoder().encode(tokenConfig.jwtSecret));

    await expect(verifyAccessToken(token, tokenConfig)).rejects.toMatchObject({
      code: "INVALID_TOKEN",
    });
  });

  it.each([{}, { sub: "not-a-uuid" }])("rejects a missing or invalid subject", async (payload) => {
    const token = await signCustomToken(payload);

    await expect(verifyAccessToken(token, tokenConfig)).rejects.toMatchObject({
      code: "INVALID_TOKEN",
    });
  });
});
