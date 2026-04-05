import type { ValidationFieldError } from '@/shared/api/types';

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: ValidationFieldError[];
  readonly rawBody?: unknown;

  constructor(
    message: string,
    status: number,
    options?: { fieldErrors?: ValidationFieldError[]; rawBody?: unknown },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = options?.fieldErrors;
    this.rawBody = options?.rawBody;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
