// mock-server/db.js
// Model: SQLite database and basic data access for posts.

const Database = require('better-sqlite3');
const path = require('path');

// Store the DB file in the mock-server folder
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

  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insert.run(row);
    }
  });

  insertMany(posts);
}

seedIfEmpty();

// Data access helpers

function getFeedPage({ filter, cursor, pageSize }) {
  // filter: 'all' | 'mine'
  // cursor: { createdAt, id } | undefined

  const params:string[] = [];
  let whereClause = '';
  let cursorClause = '';

  if (filter === 'mine') {
    whereClause = 'WHERE authorId = ?';
    params.push('u1'); // pretend u1 is "me"
  }

  if (cursor) {
    // Paginate on (createdAt DESC, id DESC)
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

  const items = db.prepare(sql).all(...params);

  let nextCursor;
  if (items.length === pageSize) {
    const last = items[items.length - 1];
    nextCursor = { createdAt: last.createdAt, id: last.id };
  }

  return { items, nextCursor };
}

module.exports = {
  getFeedPage,
};
