"use client";

import { useRouter } from 'next/navigation';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: unknown;
};

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type RequestClientOptions = {
  method?: RequestMethod;
  url: string;
  data?: unknown;
  errorTitle?: string;
};

type RequestClientError = Error & {
  status?: number;
  responseData?: unknown;
};

export const useRequestClient = () => {
  const router = useRouter();

  const requestClient = async <T,>({
    method = 'get',
    url,
    data,
    errorTitle = '',
  }: RequestClientOptions): Promise<ApiResponse<T> | undefined> => {
    try {
      const headers = new Headers();
      let body: BodyInit | undefined;

      if (data !== undefined) {
        if (data instanceof FormData) {
          body = data;
        } else {
          headers.set('Content-Type', 'application/json');
          body = JSON.stringify(data);
        }
      }

      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers,
        body,
        credentials: 'same-origin',
      });

      const result = (await response.json().catch(() => null)) as ApiResponse<T> | null;

      if (!response.ok || !result?.success) {
        const requestError = new Error(
          result?.message ?? 'در ارتباط با سرور خطایی رخ داد',
        ) as RequestClientError;

        requestError.status = response.status;
        requestError.responseData = result;

        throw requestError;
      }

      return result;
    } catch (error) {
      const requestError = error as RequestClientError;
      const status = requestError.status;

      console.error(
        `خطا در ${errorTitle || url}:`,
        requestError.responseData ?? requestError.message,
      );

      if (status === 404 || status === 403 || status === 419 || (status !== undefined && status >= 500)) {
        router.push(`/error?status=${status}`);
        return undefined;
      }

      throw error;
    }
  };

  return requestClient;
};
