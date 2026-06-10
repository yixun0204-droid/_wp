const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'blog.db');
let db;

function saveDb() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return salt + ':' + key;
}

function verifyPassword(password, hashed) {
  const [salt, key] = hashed.split(':');
  return key === crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

async function initDb() {
  const SQL = await initSqlJs();
  const fileBuffer = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : null;
  db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar_color TEXT DEFAULT '#0866ff',
    avatar_url TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  saveDb();
}

function getUserById(id) {
  const stmt = db.prepare('SELECT id, username, avatar_color, avatar_url, created_at FROM users WHERE id = ?');
  stmt.bind([Number(id)]);
  if (stmt.step()) { const r = stmt.getAsObject(); stmt.free(); return r; }
  stmt.free(); return null;
}

function getUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  stmt.bind([username]);
  if (stmt.step()) { const r = stmt.getAsObject(); stmt.free(); return r; }
  stmt.free(); return null;
}

function createUser(username, password) {
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashPassword(password)]);
  saveDb();
  const stmt = db.prepare('SELECT id FROM users WHERE username = ?');
  stmt.bind([username]); stmt.step();
  const id = stmt.getAsObject().id; stmt.free(); return id;
}

function updateUser(id, username, avatar_color, avatar_url) {
  if (avatar_url) {
    db.run('UPDATE users SET username = ?, avatar_color = ?, avatar_url = ? WHERE id = ?', [username, avatar_color, avatar_url, id]);
  } else {
    db.run('UPDATE users SET username = ?, avatar_color = ? WHERE id = ?', [username, avatar_color, id]);
  }
  saveDb();
}

function getAllPosts() {
  const stmt = db.prepare(`SELECT p.*, u.username, u.avatar_color, u.avatar_url,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM posts p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC`);
  const rows = []; while (stmt.step()) rows.push(stmt.getAsObject()); stmt.free(); return rows;
}

function getPostById(id) {
  const stmt = db.prepare(`SELECT p.*, u.username, u.avatar_color, u.avatar_url,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?`);
  stmt.bind([Number(id)]);
  if (stmt.step()) { const r = stmt.getAsObject(); stmt.free(); return r; }
  stmt.free(); return null;
}

function createPost(userId, title, content) {
  db.run('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)', [userId, title, content]);
  saveDb();
  const stmt = db.prepare('SELECT last_insert_rowid() as id'); stmt.step();
  const id = stmt.getAsObject().id; stmt.free(); return id;
}

function updatePost(id, title, content) {
  db.run('UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, content, id]);
  saveDb();
}

function deletePost(id) {
  db.run('DELETE FROM comments WHERE post_id = ?', [id]);
  db.run('DELETE FROM posts WHERE id = ?', [id]);
  saveDb();
}

function getCommentsByPostId(postId) {
  const stmt = db.prepare(`SELECT c.*, u.username, u.avatar_color, u.avatar_url
    FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC`);
  stmt.bind([postId]);
  const rows = []; while (stmt.step()) rows.push(stmt.getAsObject()); stmt.free(); return rows;
}

function addComment(postId, userId, author, content) {
  db.run('INSERT INTO comments (post_id, user_id, author, content) VALUES (?, ?, ?, ?)', [postId, userId, author, content]);
  saveDb();
}

function getAllVideos() {
  const stmt = db.prepare(`SELECT v.*, u.username, u.avatar_color, u.avatar_url
    FROM videos v LEFT JOIN users u ON v.user_id = u.id ORDER BY v.created_at DESC`);
  const rows = []; while (stmt.step()) rows.push(stmt.getAsObject()); stmt.free(); return rows;
}

function createVideo(userId, title, url, description) {
  db.run('INSERT INTO videos (user_id, title, url, description) VALUES (?, ?, ?, ?)', [userId, title, url, description || '']);
  saveDb();
}

module.exports = {
  initDb, getUserById, getUserByUsername, createUser, verifyPassword,
  getAllPosts, getPostById, createPost, updatePost, deletePost,
  getCommentsByPostId, addComment,
  getAllVideos, createVideo, updateUser
};
