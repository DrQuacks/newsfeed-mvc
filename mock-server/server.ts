// mock-server/server.js
// Simple mock REST API with cursor-based pagination for the newsfeed.

const express = require('express');
const cors = require('cors');

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

  let filtered = sortPostsDesc(posts);
  if (filter === 'mine') {
    // Pretend authorId 'u1' is the “current user”
    filtered = filtered.filter((p) => p.authorId === 'u1');
  }

  let startIndex = 0;

  if (cursorParam) {
    try {
      const cursor = JSON.parse(cursorParam);
      const idx = filtered.findIndex(
        (p) => p.createdAt === cursor.createdAt && p.id === cursor.id
      );
      if (idx >= 0) {
        startIndex = idx + 1;
      }
    } catch {
      // If cursor is invalid, we'll just start at 0 (like first page).
    }
  }

  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);
  const last = pageItems[pageItems.length - 1];

  const nextCursor =
    pageItems.length === PAGE_SIZE && last
      ? { createdAt: last.createdAt, id: last.id }
      : undefined;

  res.json({
    items: pageItems,
    nextCursor,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Mock REST API listening on http://localhost:${PORT}`);
});
