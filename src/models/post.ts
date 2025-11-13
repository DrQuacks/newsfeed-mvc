// Model: domain types for the newsfeed.
// Milestone 1–3: kept deliberately small and focused.

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string; // ISO timestamp
};

export type FeedPage = {
  items: Post[];
  // For now we omit cursor details. We'll extend this in later milestones.
  nextCursor?: unknown;
};
