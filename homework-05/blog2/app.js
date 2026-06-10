const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const avatarStorage = multer.diskStorage({
  destination: path.join(__dirname, 'public', 'uploads', 'avatars'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `avatar-${req.session.user.id}-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('只接受圖片檔案'));
    cb(null, true);
  }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'blog-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

app.get('/', (req, res) => {
  res.render('index', { posts: db.getAllPosts() });
});

app.get('/post/:id', (req, res) => {
  const post = db.getPostById(Number(req.params.id));
  if (!post) return res.status(404).send('文章不存在');
  res.render('post', { post, comments: db.getCommentsByPostId(post.id) });
});

app.get('/new', requireAuth, (req, res) => res.render('new'));

app.post('/create', requireAuth, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).send('標題和內容不能為空');
  db.createPost(req.session.user.id, title, content);
  res.redirect('/');
});

app.get('/edit/:id', requireAuth, (req, res) => {
  const post = db.getPostById(Number(req.params.id));
  if (!post) return res.status(404).send('文章不存在');
  res.render('edit', { post });
});

app.post('/update/:id', requireAuth, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).send('標題和內容不能為空');
  db.updatePost(Number(req.params.id), title, content);
  res.redirect('/');
});

app.post('/delete/:id', requireAuth, (req, res) => {
  db.deletePost(Number(req.params.id));
  res.redirect('/');
});

app.post('/comment/:postId', (req, res) => {
  const { author, content } = req.body;
  const name = req.session.user ? req.session.user.username : author;
  if (!name || !content) return res.status(400).send('姓名和留言內容不能為空');
  db.addComment(Number(req.params.postId), req.session.user ? req.session.user.id : null, name, content);
  res.redirect('/post/' + req.params.postId);
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('請填寫帳號密碼');
  const user = db.getUserByUsername(username);
  if (!user || !db.verifyPassword(password, user.password)) return res.status(401).send('帳號或密碼錯誤');
  req.session.user = { id: user.id, username: user.username, avatar_color: user.avatar_color, avatar_url: user.avatar_url };
  res.redirect('/');
});

app.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register');
});

app.post('/register', (req, res) => {
  const { username, password, confirm } = req.body;
  if (!username || !password) return res.status(400).send('請填寫帳號密碼');
  if (password !== confirm) return res.status(400).send('兩次密碼不符');
  if (db.getUserByUsername(username)) return res.status(409).send('帳號已存在');
  const id = db.createUser(username, password);
  req.session.user = { id, username, avatar_color: '#0866ff', avatar_url: null };
  res.redirect('/');
});

app.get('/profile', requireAuth, (req, res) => {
  res.render('profile', { profile: db.getUserById(req.session.user.id) || req.session.user });
});

app.post('/profile', requireAuth, upload.single('avatar'), (req, res) => {
  const { username, avatar_color } = req.body;
  if (!username) return res.status(400).send('名稱不能為空');
  const existing = db.getUserByUsername(username);
  if (existing && Number(existing.id) !== Number(req.session.user.id)) return res.status(409).send('該名稱已被使用');

  let avatar_url = undefined;
  if (req.file) avatar_url = '/uploads/avatars/' + req.file.filename;
  if (req.body.remove_avatar) avatar_url = null;

  db.updateUser(req.session.user.id, username, avatar_color || '#0866ff', avatar_url);
  const updated = db.getUserById(req.session.user.id);
  req.session.user = { id: updated.id, username: updated.username, avatar_color: updated.avatar_color, avatar_url: updated.avatar_url || null };
  res.redirect('/profile');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/reels', (req, res) => {
  res.render('reels', { videos: db.getAllVideos() });
});

app.get('/upload', requireAuth, (req, res) => res.render('upload'));

app.post('/upload', requireAuth, (req, res) => {
  const { title, url, description } = req.body;
  if (!title || !url) return res.status(400).send('標題和網址不能為空');
  db.createVideo(req.session.user.id, title, url, description);
  res.redirect('/reels');
});

db.initDb().then(() => {
  app.listen(PORT, () => console.log(`Blog server running at http://localhost:${PORT}`));
});
