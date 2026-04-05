export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ValidationFieldError = {
  field: string;
  message: string;
};

export type ApiErrorPayload = {
  message: string;
  errors?: ValidationFieldError[];
};

export type ApiFailureEnvelope = {
  success: false;
  error: ApiErrorPayload;
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailureEnvelope;

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function isApiSuccessEnvelope<T>(
  value: unknown,
): value is ApiSuccess<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    (value as { success: unknown }).success === true &&
    'data' in value
  );
}

export function isApiFailureEnvelope(value: unknown): value is ApiFailureEnvelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    (value as { success: unknown }).success === false &&
    'error' in value &&
    typeof (value as { error: unknown }).error === 'object' &&
    (value as { error: { message?: unknown } }).error !== null &&
    typeof (value as { error: { message: unknown } }).error.message === 'string'
  );
}
