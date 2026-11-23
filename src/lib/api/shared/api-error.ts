import type { ApiErrorResponse } from './api-types';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    status: number,
    options?: {
      code?: string;
      details?: unknown;
    },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return isRecord(value) && value.success === false;
}

function getErrorMessage(payload: unknown): string | undefined {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (!isRecord(payload)) {
    return undefined;
  }

  if (typeof payload.message === 'string') {
    return payload.message;
  }

  if (typeof payload.error === 'string') {
    return payload.error;
  }

  return undefined;
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();
  let payload: unknown;

  if (!responseText) {
    payload = undefined;
  } else {
    try {
      payload = JSON.parse(responseText) as unknown;
    } catch {
      payload = responseText;
    }
  }

  if (!response.ok || isApiErrorResponse(payload)) {
    const errorPayload = isApiErrorResponse(payload) ? payload : undefined;

    throw new ApiError(
      getErrorMessage(payload) || 'در ارتباط با سرور خطایی رخ داد',
      response.status,
      {
        code: errorPayload?.code,
        details: errorPayload?.details,
      },
    );
  }

  // Supports both this project's { success: true, data } format
  // and APIs that return the data directly (for example, many PHP APIs).
  if (
    isRecord(payload) &&
    payload.success === true &&
    'data' in payload
  ) {
    return payload.data as T;
  }

  return payload as T;
}

export function shouldRedirectOnApiError(error: ApiError): boolean {
  // Validation and business-rule errors should normally stay on the current page.
  return (
    error.status === 401 ||
    error.status === 403 ||
    error.status === 404 ||
    error.status >= 500
  );
}

export function getApiErrorRedirectPath(
  error: ApiError,
  redirectTo?: string,
): string {
  return redirectTo || \`/error?status=\${error.status}\`;
}
