const express = require('express');
const { initDb, all, get, run } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const posts = all('SELECT id, title, created_at FROM posts ORDER BY created_at DESC');
  res.render('index', { posts });
});

app.get('/post/new', (req, res) => {
  res.render('create');
});

app.get('/post/:id', (req, res) => {
  const post = get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (!post) return res.status(404).send('Not found');
  res.render('post', { post });
});

app.post('/post', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }
  const result = run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
  res.redirect(`/post/${result.lastInsertRowid}`);
});

app.get('/post/:id/edit', (req, res) => {
  const post = get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (!post) return res.status(404).send('Not found');
  res.render('edit', { post });
});

app.post('/post/:id', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }
  run('UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, content, req.params.id]);
  res.redirect(`/post/${req.params.id}`);
});

app.post('/post/:id/delete', (req, res) => {
  run('DELETE FROM posts WHERE id = ?', [req.params.id]);
  res.redirect('/');
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
});
