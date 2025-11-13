// Model: repository for feed data.
// Milestone 1–3 implementation is a stub that returns mock data.
// Later milestones will swap this to use the real HTTP API + cursor pagination.

import type { FeedPage, Post } from '@/models/post';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'u1',
    authorName: 'Alice Example',
    body: 'Welcome to your newsfeed interview prep project.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    authorId: 'u2',
    authorName: 'Bob Sample',
    body: 'This data is coming from the repository stub (Model layer).',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    authorId: 'u3',
    authorName: 'Carol Demo',
    body: 'Later we will swap this for a real HTTP-backed implementation.',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
];

export const postRepo = {
  // For now we ignore cursor and always return the same page.
  async getFeedPage(): Promise<FeedPage> {
    // A small delay makes it easier to see loading states later.
    await new Promise((resolve) => setTimeout(resolve, 350));

    const page: FeedPage = {
      items: MOCK_POSTS,
      nextCursor: undefined,
    };

    return page;
  },
};
