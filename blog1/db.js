const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'blog.db');

let db;

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return salt + ':' + derivedKey.toString('hex');
}

function verifyPassword(password, hashed) {
  const [salt, key] = hashed.split(':');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return key === derivedKey.toString('hex');
}

async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar_color TEXT DEFAULT '#0866ff',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  saveDb();
}

function getUserById(id) {
  const stmt = db.prepare('SELECT id, username, avatar_color, created_at FROM users WHERE id = ?');
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function getUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  stmt.bind([username]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function createUser(username, password) {
  const hashed = hashPassword(password);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
  saveDb();
  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();
  return row.id;
}

function getAllPosts() {
  const stmt = db.prepare(`
    SELECT p.*, u.username, u.avatar_color,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function getPostById(id) {
  const stmt = db.prepare(`
    SELECT p.*, u.username, u.avatar_color,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `);
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function createPost(userId, title, content) {
  db.run('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)', [userId, title, content]);
  saveDb();
  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();
  return row.id;
}

function updatePost(id, title, content) {
  db.run(
    'UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, content, id]
  );
  saveDb();
}

function deletePost(id) {
  db.run('DELETE FROM comments WHERE post_id = ?', [id]);
  db.run('DELETE FROM posts WHERE id = ?', [id]);
  saveDb();
}

function getCommentsByPostId(postId) {
  const stmt = db.prepare(`
    SELECT c.*, u.username, u.avatar_color
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `);
  stmt.bind([postId]);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function addComment(postId, userId, author, content) {
  db.run(
    'INSERT INTO comments (post_id, user_id, author, content) VALUES (?, ?, ?, ?)',
    [postId, userId, author, content]
  );
  saveDb();
}

function getAllVideos() {
  const stmt = db.prepare(`
    SELECT v.*, u.username, u.avatar_color
    FROM videos v
    LEFT JOIN users u ON v.user_id = u.id
    ORDER BY v.created_at DESC
  `);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function createVideo(userId, title, url, description) {
  db.run(
    'INSERT INTO videos (user_id, title, url, description) VALUES (?, ?, ?, ?)',
    [userId, title, url, description || '']
  );
  saveDb();
}

module.exports = {
  initDb,
  getUserById, getUserByUsername, createUser, verifyPassword,
  getAllPosts, getPostById, createPost, updatePost, deletePost,
  getCommentsByPostId, addComment,
  getAllVideos, createVideo
};
