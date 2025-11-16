// src/hooks/useLiveUpdates.ts
import { useEffect } from 'react';
import { connectWebSocket, type ServerEvent } from '@/services/wsService';
import { queryClient } from '@/lib/queryClient';
import type { InfiniteData } from '@tanstack/react-query';
import type { FeedPage, Post } from '@/models/post';
import type { FeedFilter } from '@/stores/uiStore';

function prependNewPostInCache(filter: FeedFilter, newPost: Post) {
  queryClient.setQueryData<InfiniteData<FeedPage>>(['feed', filter], (old) => {
    if (!old) return old;

    const [firstPage, ...restPages] = old.pages;
    if (!firstPage) return old;

    const updatedFirstPage: FeedPage = {
      ...firstPage,
      items: [newPost, ...firstPage.items],
    };

    return {
      ...old,
      pages: [updatedFirstPage, ...restPages],
    };
  });
}

export function useLiveUpdates() {
  useEffect(() => {
    const disconnect = connectWebSocket((event: ServerEvent) => {
      if (event.type === 'post:new') {
        console.log('[WS] post:new -> optimistic cache update + invalidate');

        const now = new Date();
        const newPost: Post = {
          id: event.postId,
          authorId: 'u1',
          authorName: 'Live User',
          body: `Live post from WebSocket at ${now.toLocaleTimeString()}`,
          createdAt: now.toISOString(),
        };

        // 1) Optimistically add to UI cache for both filters
        const filters: FeedFilter[] = ['all', 'mine'];
        filters.forEach((filter) => prependNewPostInCache(filter, newPost));

        // 2) Then, after a short moment, reconcile with backend truth
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['feed'] });
        }, 2000);
      }
    });

    return () => {
      disconnect();
    };
  }, []);
}
