import type { UserRole } from "../generated/prisma/client.js";

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

export interface AuthLocals {
  auth: AuthenticatedUser;
}

export interface OptionalAuthLocals {
  auth?: AuthenticatedUser;
}
