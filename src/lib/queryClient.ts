// src/lib/queryClient.ts
// Model: Query cache configuration for the newsfeed.
// This is our client-side "data cache" layer.
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30s: data considered fresh
      gcTime: 5 * 60_000, // 5min: garbage-collect unused queries
      retry: 1,
    },
  },
});
