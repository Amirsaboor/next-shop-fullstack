'use client';

import {
  ApiError,
  getApiErrorRedirectPath,
  parseApiResponse,
  shouldRedirectOnApiError,
} from '@/lib/api/shared/api-error';
import { buildApiRequestInit, resolveApiUrl } from '@/lib/api/shared/api-utils';
import type { ApiRequestOptions } from '@/lib/api/shared/api-types';

export { ApiError as ApiRequestError };
export type { ApiSuccessResponse } from '@/lib/api/shared/api-types';

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function apiRequest<T>(
  input: RequestInfo | URL,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    baseURL = DEFAULT_BASE_URL,
    redirectOnError = true,
    redirectTo,
  } = options;

  const requestUrl = resolveApiUrl(input, baseURL);
  const requestInit = buildApiRequestInit(options, 'same-origin');

  let response: Response;

  try {
    response = await fetch(requestUrl, requestInit);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('ارتباط با سرور برقرار نشد', 0, {
      details: error,
    });
  }

  try {
    return await parseApiResponse<T>(response);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (redirectOnError && shouldRedirectOnApiError(error)) {
      window.location.assign(getApiErrorRedirectPath(error, redirectTo));
    }

    throw error;
  }
}

export function apiGet<T>(
  input: RequestInfo | URL,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiRequest<T>(input, { ...options, method: 'GET' });
}

export function apiPost<T>(
  input: RequestInfo | URL,
  body?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiRequest<T>(input, { ...options, method: 'POST', body });
}

export function apiPut<T>(
  input: RequestInfo | URL,
  body?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiRequest<T>(input, { ...options, method: 'PUT', body });
}

export function apiPatch<T>(
  input: RequestInfo | URL,
  body?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiRequest<T>(input, { ...options, method: 'PATCH', body });
}

export function apiDelete<T>(
  input: RequestInfo | URL,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiRequest<T>(input, { ...options, method: 'DELETE' });
}
