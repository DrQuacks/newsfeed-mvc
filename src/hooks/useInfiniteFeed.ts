// src/hooks/useInfiniteFeed.ts
// Controller: orchestrates fetching paginated feed data
// using the Model (postRepo) and Model's cache (QueryClient).
import { useInfiniteQuery } from '@tanstack/react-query';
import { postRepo } from '@/repositories/postRepo';
import type { FeedCursor, FeedPage } from '@/models/post';

const FEED_QUERY_KEY = ['feed'] as const;

export function useInfiniteFeed() {
  return useInfiniteQuery<
    FeedPage,              // TData
    Error,                 // TError
    FeedPage,              // TQueryFnData
    typeof FEED_QUERY_KEY, // TQueryKey
    FeedCursor | undefined // TPageParam
  >({
    queryKey: FEED_QUERY_KEY,
    queryFn: ({ pageParam }) => postRepo.getFeedPage(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
