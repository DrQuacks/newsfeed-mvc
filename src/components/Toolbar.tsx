// src/components/Toolbar.tsx
import React from 'react';
import { useUIStore, type FeedFilter } from '@/stores/uiStore';

export const Toolbar: React.FC = () => {
  const feedFilter = useUIStore((s) => s.feedFilter);
  const setFeedFilter = useUIStore((s) => s.setFeedFilter);

  const handleClick = (filter: FeedFilter) => {
    if (filter !== feedFilter) {
      setFeedFilter(filter);
    }
  };

  return (
    <div className="feed-controls" style={{ marginBottom: '0.75rem' }}>
      <span className="feed-small" style={{ marginRight: '0.5rem' }}>
        Filter:
      </span>
      <button
        className="feed-button"
        onClick={() => handleClick('all')}
        aria-pressed={feedFilter === 'all'}
      >
        All posts
      </button>
      <button
        className="feed-button"
        onClick={() => handleClick('mine')}
        aria-pressed={feedFilter === 'mine'}
      >
        My posts
      </button>
    </div>
  );
};
