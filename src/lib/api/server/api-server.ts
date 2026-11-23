import 'server-only';

import { redirect } from 'next/navigation';

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

export async function apiServerRequest<T>(
  input: RequestInfo | URL,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    baseURL = process.env.API_BASE_URL ?? '',
    redirectOnError = true,
    redirectTo,
  } = options;

  const requestUrl = resolveApiUrl(input, baseURL);

  if (
    typeof requestUrl === 'string' &&
    !/^https?:\/\//i.test(requestUrl) &&
    !baseURL
  ) {
    throw new ApiError(
      'برای درخواست‌های Server باید متغیر API_BASE_URL تنظیم شود',
      0,
    );
  }

  const requestInit = buildApiRequestInit(options, 'same-origin');

  let response: Response;

  try {
    response = await fetch(requestUrl, requestInit);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('ارتباط با سرور مقصد برقرار نشد', 0, {
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
      redirect(getApiErrorRedirectPath(error, redirectTo));
    }

    throw error;
  }
}

export function apiServerGet<T>(
  input: RequestInfo | URL,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiServerRequest<T>(input, { ...options, method: 'GET' });
}

export function apiServerPost<T>(
  input: RequestInfo | URL,
  body?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiServerRequest<T>(input, { ...options, method: 'POST', body });
}

export function apiServerPut<T>(
  input: RequestInfo | URL,
  body?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiServerRequest<T>(input, { ...options, method: 'PUT', body });
}

export function apiServerPatch<T>(
  input: RequestInfo | URL,
  body?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiServerRequest<T>(input, { ...options, method: 'PATCH', body });
}

export function apiServerDelete<T>(
  input: RequestInfo | URL,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) {
  return apiServerRequest<T>(input, { ...options, method: 'DELETE' });
}
