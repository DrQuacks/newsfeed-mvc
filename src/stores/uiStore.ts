// src/stores/uiStore.ts
import { create } from 'zustand';

export type FeedFilter = 'all' | 'mine';

type UIState = {
  feedFilter: FeedFilter;
  setFeedFilter: (filter: FeedFilter) => void;
};

// Model: UI-only state (does not come from the server).
export const useUIStore = create<UIState>((set) => ({
  feedFilter: 'all',
  setFeedFilter: (feedFilter) => set({ feedFilter }),
}));
