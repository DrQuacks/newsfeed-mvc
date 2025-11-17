// mock-server/server.js
// Simple mock REST API with cursor-based pagination for the newsfeed.

import express from 'express';
import cors from 'cors';
import { getFeedPage } from './db';

const app = express();
app.use(cors());

// In-memory posts, newest first.
const posts = Array.from({ length: 60 }, (_, i) => {
  const id = 60 - i;
  return {
    id: String(id),
    authorId: `u${(id % 5) + 1}`,
    authorName: `User ${((id % 5) + 1)}`,
    body: `This is post #${id} from the mock REST API.`,
    createdAt: new Date(Date.now() - i * 60_000).toISOString(), // 1 min apart
  };
});

// Helper to sort by (createdAt DESC, id DESC)
function sortPostsDesc(list) {
  return [...list].sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    if (a.createdAt > b.createdAt) return -1;
    if (a.id < b.id) return 1;
    if (a.id > b.id) return -1;
    return 0;
  });
}

app.get('/api/feed', (req, res) => {
  const PAGE_SIZE = 10;
  const cursorParam = req.query.cursor;
  const filter = req.query.filter || 'all';

  let cursor;
  if (cursorParam) {
    try {
      cursor = JSON.parse(cursorParam);
    } catch {
      // ignore bad cursor, treat as first page
    }
  }

  const page = getFeedPage({
    filter,
    cursor,
    pageSize: PAGE_SIZE,
  });

  res.json(page);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Mock REST API listening on http://localhost:${PORT}`);
});
