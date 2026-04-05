import { ApiError } from '@/shared/api/errors';

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Primary message suitable for toast or alert */
export function getDisplayMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isApiError(error)) {
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}

function normalizeFieldKey(field: string): string {
  const trimmed = field.trim();
  if (trimmed.startsWith('body.')) {
    return trimmed.slice(5);
  }
  if (trimmed.startsWith('query.')) {
    return trimmed.slice(6);
  }
  return trimmed;
}

/**
 * Map validation field errors to a single message per field (first wins).
 * Keys are normalized (e.g. `body.email` → `email`).
 */
export function getFieldErrorsRecord(error: unknown): Record<string, string> {
  if (!isApiError(error) || !error.fieldErrors?.length) {
    return {};
  }
  const out: Record<string, string> = {};
  for (const { field, message } of error.fieldErrors) {
    const key = normalizeFieldKey(field);
    if (!(key in out)) {
      out[key] = message;
    }
  }
  return out;
}
