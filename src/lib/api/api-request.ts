type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: unknown;
};

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    credentials: options.credentials ?? 'same-origin',
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? 'در ارتباط با سرور خطایی رخ داد');
  }

  return result;
}
