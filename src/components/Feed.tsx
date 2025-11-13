import React from 'react';
import type { Post } from '@/models/post';
import { postRepo } from '@/repositories/postRepo';

// View + tiny bit of Controller for Milestone 1–3:
// We deliberately keep things simple here and will move the
// data-loading concerns into a dedicated hook in later milestones.

type FeedState =
  | { status: 'idle'; posts: Post[] }
  | { status: 'loading'; posts: Post[] }
  | { status: 'loaded'; posts: Post[] }
  | { status: 'error'; posts: Post[]; error: string };

export const Feed: React.FC = () => {
  const [state, setState] = React.useState<FeedState>({ status: 'idle', posts: [] });

  const load = async () => {
    try {
      setState((prev) => ({ ...prev, status: 'loading' }));
      const page = await postRepo.getFeedPage();
      setState({ status: 'loaded', posts: page.items });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setState((prev) => ({ ...prev, status: 'error', error: message }));
    }
  };

  const disabled = state.status === 'loading';

  return (
    <section className="feed-card">
      <h2>Newsfeed</h2>
      <p className="feed-small">
        Milestones 1–3: We have <strong>domain types</strong>, an <strong>HTTP wrapper</strong>, and a{" "}
        <strong>repository stub</strong>. Pagination, caching, and websockets come later.
      </p>

      <div className="feed-controls">
        <button className="feed-button" onClick={load} disabled={disabled}>
          {state.status === 'loading' ? 'Loading…' : 'Load posts from repository'}
        </button>
        <span className="feed-small">
          Status: <strong>{state.status}</strong>
        </span>
      </div>

      <div className="feed-post-list">
        {state.posts.map((post) => (
          <article key={post.id} className="feed-post">
            <div className="feed-post-title">{post.authorName}</div>
            <div>{post.body}</div>
            <div className="feed-small">
              {new Date(post.createdAt).toLocaleString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </article>
        ))}

        {state.posts.length === 0 && (
          <p className="feed-small">Click the button above to load posts from the repository stub.</p>
        )}
      </div>
    </section>
  );
};
