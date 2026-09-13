import { z } from "zod";

export const healthRequestSchema = z.object({
  body: z.unknown(),
  params: z.object({}),
  query: z.object({
    details: z.enum(["true", "false"]).optional(),
  }),
});

export type HealthRequest = z.output<typeof healthRequestSchema>;
