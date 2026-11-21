export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

type ApiErrorResponse = {
  success: false;
  message?: string;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    value.success === false
  );
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    throw new ApiRequestError('پاسخ سرور قابل خواندن نیست', response.status);
  }

  if (!response.ok) {
    const message = isApiErrorResponse(result)
      ? result.message
      : undefined;

    throw new ApiRequestError(
      message || 'در ارتباط با سرور خطایی رخ داد',
      response.status,
    );
  }

  if (isApiErrorResponse(result)) {
    throw new ApiRequestError(
      result.message || 'در پردازش درخواست خطایی رخ داد',
      response.status,
    );
  }

  if (
    typeof result !== 'object' ||
    result === null ||
    !('success' in result) ||
    result.success !== true ||
    !('data' in result)
  ) {
    throw new ApiRequestError('ساختار پاسخ سرور معتبر نیست', response.status);
  }

  return result.data as T;
}
