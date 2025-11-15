/**
 * Client-side query client setup using React Query.
 * 
 * This module configures the QueryClient with default options
 * for queries and mutations, including error handling and
 * fetch strategies.
 * 
 * Architectural Decision: Centralized query client for consistent
 * data fetching behavior across the application.
 * it manages caching, background updates, and stale data example 
 * why? because it improves loading, catching, and error handling. 
 * and also provides React Query decouples components from direct 
 * fetch calls and ensures data consistency.
 * Makes the app scalable and easier to maintain.
 */
// manages frontend state  for that data ensuring mu app reacts correctly to API responses


import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method : string, url : string, data ?: unknown) {
  const fullUrl = import.meta.env.VITE_API_URL + "/api" + url || "http://localhost:5000/api" + url;
  const res = await fetch(fullUrl, {
    method,
    headers: data ? {
      "Content-Type": "application/json",
    } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
