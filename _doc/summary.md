# 對話摘要

## 專案：Node.js + SQLite 部落格系統

### 目標
建立具 Facebook 風格版面、使用者認證、頭像、YouTube Shorts 短片牆的部落格系統。

### 技術棧
- Node.js v24 + Express + EJS
- sql.js（純 JS SQLite，避開原生編譯問題）
- express-session（記憶體 Session）
- multer（頭像圖片上傳）
- crypto.pbkdf2Sync（密碼雜湊）

---

### 已完成功能

#### 第一階段：基礎部落格
- 文章 CRUD（新增、編輯、刪除、列表）
- Express + sql.js 整合
- EJS 模板渲染

#### 第二階段：Facebook 風格 + 留言
- Facebook.com 卡片式版面 (`style.css`)
- 留言系統（comments 表，post_id, author, content）
- 文章與留言時間戳

#### 第三階段：使用者認證 + 頭像 + 短片
- 使用者註冊/登入/登出（Session-based）
- Users 表（id, username, password(hashed), avatar_color, avatar_url, created_at）
- 顏色頭像（顯示使用者名稱首字 + 色圈）
- 圖片頭像上傳（multer → `public/uploads/avatars/`，2MB 限制）
- 更新 `db.js`：`updateUser()` 支援 `avatar_url` 設定/清除
- 頭像渲染：有 `avatar_url` 顯示 `<img>`，無則回退色圈
- Shorts 短片表（videos 表）
- `/reels` Shorts 頁面（YouTube Shorts 暗色風格）

#### 第四階段：個人檔案編輯
- `/profile` 頁面（修改名稱、頭像顏色選取器、照片上傳、移除照片）
- Navbar、Post、Comment 全面支援圖片/顏色頭像

#### 第五階段：YouTube Shorts 風格 redesign
- 暗色主題，垂直 snap-scroll 卡片
- 側邊按鈕（👍 讚/👎 倒讚/💬 留言/🔗 分享連結）
- Embedded YouTube iframe（自動轉換 `watch?v=` → `embed/`）

---

### 目錄結構（blog2/）
```
blog2/
├── app.js              # 主程式（路由、multer、session）
├── db.js               # 資料庫操作（users, posts, comments, videos）
├── package.json
├── public/
│   ├── style.css       # 全部樣式（Facebook feed, auth, shorts, profile）
│   └── uploads/avatars/ # 上傳頭像儲存位置
└── views/
    ├── index.ejs       # 首頁文章列表
    ├── post.ejs        # 單篇文章 + 留言
    ├── new.ejs         # 新增文章
    ├── edit.ejs        # 編輯文章
    ├── login.ejs       # 登入
    ├── register.ejs    # 註冊
    ├── profile.ejs     # 個人檔案編輯
    ├── reels.ejs       # YouTube Shorts 短片牆
    └── upload.ejs      # 上傳短片
```

### 關鍵問題與修復
1. **sql.js `last_insert_rowid()` 回傳 0** → 改為 INSERT 後以 username 查詢 ID
2. **Session ID 型別不一致** → 在比較 `existing.id !== session.user.id` 時強制轉型 `Number()`
3. **Port 3000 被佔用** → 使用 `Get-NetTCPConnection` + `Stop-Process` 清除
4. **頭像 `avatar_url` 欄位需重建資料庫** → 移除舊 `blog.db` 讓 schema 重新建立
5. **avatar rendering 在多處重複** → 每個檢視檔案各自實作 if/else 判斷（img vs color div）

### 版本儲存
- `opencode/` → `blog/` → `blog1/` → `blog2/`
- blog2 為最終工作目錄
