import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosHeaders,
} from 'axios';

import { apiClient } from '@/shared/api/client';
import { ApiError } from '@/shared/api/errors';
import { isApiFailureEnvelope, isApiSuccessEnvelope } from '@/shared/api/types';

function throwFromAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    if (isApiFailureEnvelope(data)) {
      throw new ApiError(data.error.message, status, {
        fieldErrors: data.error.errors,
        rawBody: data,
      });
    }

    const message =
      (typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as { message: unknown }).message === 'string' &&
        (data as { message: string }).message) ||
      error.message ||
      'Request failed';

    throw new ApiError(message, status, { rawBody: data });
  }

  throw error;
}

function parseEnvelope<T>(payload: unknown, status: number): T {
  if (isApiSuccessEnvelope<T>(payload)) {
    return payload.data;
  }
  if (isApiFailureEnvelope(payload)) {
    throw new ApiError(payload.error.message, status, {
      fieldErrors: payload.error.errors,
      rawBody: payload,
    });
  }
  throw new ApiError('Unexpected response shape from server', status, {
    rawBody: payload,
  });
}

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<unknown> = await apiClient.request(config);
    const { data, status } = response;
    return parseEnvelope<T>(data, status);
  } catch (error) {
    throwFromAxiosError(error);
  }
}

/** DELETE / other routes that return 204 with no JSON body */
export async function apiRequestNoContent(config: AxiosRequestConfig): Promise<void> {
  try {
    const response = await apiClient.request<unknown>(config);
    if (response.status === 204) {
      return;
    }
    const { data, status } = response;
    if (
      data === '' ||
      data === undefined ||
      data === null
    ) {
      return;
    }
    parseEnvelope<unknown>(data, status);
  } catch (error) {
    throwFromAxiosError(error);
  }
}

export async function apiPostMultipart<T>(
  url: string,
  formData: FormData,
  config?: Omit<AxiosRequestConfig, 'data' | 'url' | 'method'>,
): Promise<T> {
  return apiRequest<T>({
    ...config,
    method: 'POST',
    url,
    data: formData,
    transformRequest: [
      (data, headers) => {
        if (headers instanceof AxiosHeaders) {
          headers.delete('Content-Type');
        }
        return data;
      },
    ],
  });
}
