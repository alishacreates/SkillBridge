export interface AppErrorOptions {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  isOperational?: boolean;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: unknown;
  readonly isOperational: boolean;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = "AppError";
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;
  }
}
