// src/hooks/useInfiniteFeed.ts
// Controller: orchestrates fetching paginated feed data
// using the Model (postRepo) and Model's cache (QueryClient).
import { useInfiniteQuery } from '@tanstack/react-query';
import { postRepo } from '@/repositories/postRepo';
import type { FeedPage } from '@/models/post';

const FEED_QUERY_KEY = ['feed'] as const;

export function useInfiniteFeed() {
  return useInfiniteQuery<FeedPage>({
    queryKey: FEED_QUERY_KEY,
    // Milestone 4–5: our repository stub only returns a single page
    // and ignores the pageParam. We wire the API as if it were
    // cursor-based so we can extend it later without changing the View.
    queryFn: () => postRepo.getFeedPage(),
    initialPageParam: undefined,
    getNextPageParam: () => undefined,
  });
}
