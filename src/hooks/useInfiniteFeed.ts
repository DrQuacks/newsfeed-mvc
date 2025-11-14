// src/hooks/useInfiniteFeed.ts
// Controller: orchestrates fetching paginated feed data
// using the Model (postRepo) and Model's cache (QueryClient).
import { useInfiniteQuery } from '@tanstack/react-query';
import { postRepo } from '@/repositories/postRepo';
import type { FeedCursor, FeedPage } from '@/models/post';
import type { FeedFilter } from '@/stores/uiStore';

export function useInfiniteFeed(filter: FeedFilter) {
  return useInfiniteQuery({
    queryKey: ['feed', filter],
    // queryFn returns a Promise<FeedPage>
    queryFn: ({ pageParam }: { pageParam?: FeedCursor }) =>
      postRepo.getFeedPage(filter,pageParam),
    initialPageParam: undefined as FeedCursor | undefined,
    getNextPageParam: (lastPage: FeedPage) => lastPage.nextCursor,
  });
}