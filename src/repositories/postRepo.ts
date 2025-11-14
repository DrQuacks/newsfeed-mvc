// Model: repository for feed data.
// Milestone 6: now backed by a real HTTP API with cursor pagination.

import { http } from '@/lib/http';
import type { FeedCursor, FeedPage } from '@/models/post';
import type { FeedFilter } from '@/stores/uiStore';

const API_BASE_URL = 'http://localhost:3000';

export const postRepo = {
  async getFeedPage(filter: FeedFilter, cursor?: FeedCursor): Promise<FeedPage> {
    const searchParams = new URLSearchParams();

    if (cursor) {
      searchParams.set('cursor', JSON.stringify(cursor));
    }

    // Only send filter if it isn't the default
    if (filter && filter !== 'all') {
      searchParams.set('filter', filter);
    }

    const qs = searchParams.toString();
    const url = `${API_BASE_URL}/api/feed${qs ? `?${qs}` : ''}`;

    return http<FeedPage>(url);
  },
};