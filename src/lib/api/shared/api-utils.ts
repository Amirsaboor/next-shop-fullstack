import type { ApiRequestOptions } from './api-types';

export function resolveApiUrl(
  input: RequestInfo | URL,
  baseURL?: string,
): RequestInfo | URL {
  if (input instanceof Request) {
    return input;
  }

  const inputUrl = input.toString();

  // Absolute URLs do not need a Base URL.
  if (/^https?:\/\//i.test(inputUrl)) {
    return inputUrl;
  }

  if (!baseURL) {
    return inputUrl;
  }

  const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
  const normalizedPath = inputUrl.replace(/^\/+/, '');

  return new URL(normalizedPath, normalizedBaseURL);
}

export function buildApiRequestInit(
  options: ApiRequestOptions,
  defaultCredentials: RequestCredentials,
): RequestInit {
  const {
    baseURL: _baseURL,
    redirectOnError: _redirectOnError,
    redirectTo: _redirectTo,
    token,
    body,
    headers,
    ...fetchOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  let requestBody: BodyInit | null | undefined;

  if (body === undefined || body === null) {
    requestBody = body;
  } else if (
    typeof body === 'string' ||
    (typeof FormData !== 'undefined' && body instanceof FormData) ||
    (typeof Blob !== 'undefined' && body instanceof Blob) ||
    (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream)
  ) {
    requestBody = body as BodyInit;
  } else {
    requestBody = JSON.stringify(body);

    if (!requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }
  }

  return {
    ...fetchOptions,
    ...(options.method ? { method: options.method } : {}),
    headers: requestHeaders,
    body: requestBody,
    credentials: options.credentials ?? defaultCredentials,
  };
}
