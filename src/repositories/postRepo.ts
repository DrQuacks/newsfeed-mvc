// Model: repository for feed data.
// Milestone 6: now backed by a real HTTP API with cursor pagination.

import { http } from '@/lib/http';
import type { FeedCursor, FeedPage } from '@/models/post';

const API_BASE_URL = 'http://localhost:3000';

export const postRepo = {
  async getFeedPage(cursor?: FeedCursor): Promise<FeedPage> {
    const query = cursor
      ? `?cursor=${encodeURIComponent(JSON.stringify(cursor))}`
      : '';

    return http<FeedPage>(`${API_BASE_URL}/api/feed${query}`);
  },
};