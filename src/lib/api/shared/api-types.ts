export type ApiHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message?: string;
  code?: string;
  details?: unknown;
};

export type ApiRequestOptions = Omit<
  RequestInit,
  'method' | 'body' | 'headers'
> & {
  method?: ApiHttpMethod;
  baseURL?: string;
  headers?: HeadersInit;
  body?: unknown;
  token?: string;
  redirectOnError?: boolean;
  redirectTo?: string;
};
