import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { z } from "zod";

export type ValidatedHandler<Schema extends z.ZodType> = (
  request: Request,
  response: Response,
  next: NextFunction,
  validated: z.output<Schema>,
) => void | Promise<void>;

export function validateRequest<Schema extends z.ZodType>(
  schema: Schema,
  handler: ValidatedHandler<Schema>,
): RequestHandler {
  return async (request, response, next) => {
    const validated = await schema.parseAsync({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    await handler(request, response, next, validated);
  };
}
