// mock-server/db.ts
// Model: SQLite database and basic data access for posts.

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, 'newsfeed.db');
const db = new Database(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    authorId TEXT NOT NULL,
    authorName TEXT NOT NULL,
    body TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`);

// Seed data if table is empty
function seedIfEmpty() {
  const row = db.prepare('SELECT COUNT(*) as count FROM posts').get();
  if (row.count > 0) {
    return;
  }

  console.log('[DB] Seeding posts table with initial data...');

  const insert = db.prepare(`
    INSERT INTO posts (id, authorId, authorName, body, createdAt)
    VALUES (@id, @authorId, @authorName, @body, @createdAt)
  `);

  const now = Date.now();
  const authors = [
    { id: 'u1', name: 'User 1' },
    { id: 'u2', name: 'User 2' },
    { id: 'u3', name: 'User 3' },
    { id: 'u4', name: 'User 4' },
    { id: 'u5', name: 'User 5' },
  ];

  const posts = Array.from({ length: 60 }, (_, i) => {
    const id = 60 - i;
    const author = authors[id % authors.length];
    return {
      id: String(id),
      authorId: author.id,
      authorName: author.name,
      body: `This is post #${id} from SQLite.`,
      createdAt: new Date(now - i * 60_000).toISOString(), // 1 min apart
    };
  });

  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run(row);
    }
  });

  insertMany(posts);
}

seedIfEmpty();

export type FeedPageFromDb = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type FeedCursor = {
  createdAt: string;
  id: string;
};

export type FeedPageResult = {
  items: FeedPageFromDb[];
  nextCursor?: FeedCursor;
};

// This is the ONLY getFeedPage we want to export from this module
export function getFeedPage(options: {
  filter: 'all' | 'mine';
  cursor?: FeedCursor;
  pageSize: number;
}): FeedPageResult {
  const { filter, cursor, pageSize } = options;

  const params: any[] = [];
  let whereClause = '';
  let cursorClause = '';

  if (filter === 'mine') {
    whereClause = 'WHERE authorId = ?';
    params.push('u1'); // pretend u1 is current user
  }

  if (cursor) {
    cursorClause += whereClause ? ' AND ' : 'WHERE ';
    cursorClause += '(createdAt < ? OR (createdAt = ? AND id < ?))';
    params.push(cursor.createdAt, cursor.createdAt, cursor.id);
  }

  const sql = `
    SELECT id, authorId, authorName, body, createdAt
    FROM posts
    ${whereClause}
    ${cursorClause}
    ORDER BY createdAt DESC, id DESC
    LIMIT ?
  `;

  params.push(pageSize);

  const items = db.prepare(sql).all(...params) as FeedPageFromDb[];

  let nextCursor: FeedCursor | undefined;
  if (items.length === pageSize) {
    const last = items[items.length - 1];
    nextCursor = { createdAt: last.createdAt, id: last.id };
  }

  return { items, nextCursor };
}
