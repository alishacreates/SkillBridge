import type { Response } from "express";

export function sendSuccess<T>(
  response: Response,
  data: T,
  statusCode = 200,
  message?: string,
): Response {
  if (message) {
    return response.status(statusCode).json({ success: true, message, data });
  }

  return response.status(statusCode).json({ success: true, data });
}

export function sendError(
  response: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
): Response {
  const error = details === undefined ? { code, message } : { code, message, details };

  return response.status(statusCode).json({ success: false, error });
}
