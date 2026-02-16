import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface ApiOptions {
  method?: string;
  body?: any;
}

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const request = useCallback(
    async <T>(url: string, options: ApiOptions = {}): Promise<T> => {
      const token = await getAccessTokenSilently();

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    },
    [getAccessTokenSilently]
  );

  const get = useCallback(
    <T>(url: string) => request<T>(url, { method: 'GET' }),
    [request]
  );

  const post = useCallback(
    <T>(url: string, body?: any) => request<T>(url, { method: 'POST', body }),
    [request]
  );

  return { get, post, request };
}
