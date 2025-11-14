// src/components/Feed.tsx
import React from 'react';
import { useInfiniteFeed } from '@/hooks/useInfiniteFeed';
import type { Post } from '@/models/post';
import { useUIStore } from '@/stores/uiStore';
import { Toolbar } from './Toolbar';

// View: now consumes the Controller hook (useInfiniteFeed)
// instead of calling the repository directly.

const renderPost = (post: Post) => (
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
);

export const Feed: React.FC = () => {
  const feedFilter = useUIStore((s) => s.feedFilter);
  const {
    data,
    status,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFeed(feedFilter);

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section className="feed-card">
      <h2>Newsfeed</h2>
      <p className="feed-small">
        Milestones 7–8: We now have a <strong>UI store</strong> for the filter and the query cache is{' '}
        <strong>keyed by filter</strong>. The View talks to a <strong>Controller hook</strong>, which calls a{' '}
        <strong>repository</strong> backed by a real HTTP API.
      </p>
      
      <Toolbar />

      <div className="feed-controls">
        <button className="feed-button" onClick={() => refetch()} disabled={isFetching}>
          {isFetching
            ? 'Refreshing…'
            : status === 'success'
            ? 'Refresh posts'
            : 'Load posts from repository'}
        </button>
        <span className="feed-small">
          Status: <strong>{status}</strong>
        </span>
      </div>

      <div className="feed-post-list">
        {status === 'pending' && <p className="feed-small">Loading feed…</p>}
        {status === 'error' && <p className="feed-small">Something went wrong loading the feed.</p>}

        {posts.map(renderPost)}

        {status === 'success' && posts.length === 0 && (
          <p className="feed-small">No posts yet. (We&apos;re still using a mocked repository page.)</p>
        )}
      </div>
      {status === 'success' && hasNextPage && (
        <div className="feed-controls" style={{ marginTop: '0.75rem' }}>
          <button
            className="feed-button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more…' : 'Load more'}
          </button>
        </div>
      )}
    </section>
  );
};
