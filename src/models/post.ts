// Model: domain types for the newsfeed.
// Milestone 1–3: kept deliberately small and focused.

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string; // ISO timestamp
};

// Cursor for pagination: uniquely identifies a position in the feed.
export type FeedCursor = {
  createdAt: string;
  id: string;
};

export type FeedPage = {
  items: Post[];
  // For now we omit cursor details. We'll extend this in later milestones.
  nextCursor?: FeedCursor;
};
