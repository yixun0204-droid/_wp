# *本篇使用opencode做統整*

---
# 平時作業總彙整

**課程**：網頁設計（114 學年下學期）
**學生**：楊宜勛（學號末兩碼 53）
**學校**：金門大學資訊工程系
**教師**：陳鍾誠

---

## homework-01 — HTML 個人介紹頁

**路徑**：`[homework-01/html] (https://github.com/yixun0204-droid/_wp/tree/master/homework-01)`

**說明**：用 HTML + CSS 建立個人介紹頁，包含姓名、年齡、連結、聯絡資訊。練習基礎 HTML 結構與 inline CSS 樣式設計。

**技術**：HTML5, CSS3

---

## homework-02 — HTML5 全功能表單

**路徑**：`homework-02/html`

**說明**：展示所有 HTML5 Input Type 的萬花筒表單，包含文字、密碼、Email、URL、電話、數字、範圍滑桿、Checkbox、Radio、日期/時間/月份/週別、檔案上傳、色彩選擇器、datalist 自動完成，以及 Submit / Reset / Button / Image 按鈕。共 6 個 fieldset 群組，近 300 行。

**技術**：HTML5 input types, datalist, form validation

---

## homework-03 — JavaScript 初探

**路徑**：`homework-03/js/hello.js`

**說明**：最基本的 JavaScript 輸出練習，執行 `console.log('hello 你好')`。

**技術**：Node.js, console.log

---

## homework-04 — JavaScript 10 題程式練習

**路徑**：`homework-04/04/`

**說明**：10 道循序漸進的 JavaScript 實作題，涵蓋條件判斷、迴圈、陣列、物件、JSON：

| # | 檔案 | 主題 |
|---|------|------|
| 1 | `01-if-function` | BMI 計算（if/else 條件判斷） |
| 2 | `02-for` | 九九乘法表（雙層 for 迴圈） |
| 3 | `03-while-if` | 猜數字遊戲（while + if） |
| 4 | `04-array-for-if` | 成績分析（及格總分 / 不及格人數） |
| 5 | `05-object-array-for` | 購物車結帳（物件 + 陣列計算總額） |
| 6 | `06-array-object-function-if` | 電話簿查詢（陣列物件搜尋） |
| 7 | `07-array-while` | 陣列反轉（雙指針交換） |
| 8 | `08-JSON-object-function` | JSON 解析與升級（parse / stringify） |
| 9 | `09-JSON-array-object-for` | 班級借閱統計（JSON 陣列解析） |
| 10 | `10-include-all` | 記帳支出報表（綜合應用） |

**技術**：JavaScript 基礎語法、JSON、陣列操作

---

## homework-05 — Node.js 部落格系統（三階段演進）

**路徑**：`homework-05/`

**說明**：從最小可行產品逐步迭代到完整部落格系統，共三個版本：

| 版本 | 功能 |
|------|------|
| `opencode/` | 最小可行：Express + sql.js，文章 CRUD |
| `blog1/` | 加入使用者認證（session）、留言系統、Facebook 卡片風格、YouTube Shorts 短片牆 |
| `blog2/` | 最終版：multer 頭像上傳、個人檔案編輯、顏色頭像、暗色 Shorts 主題 |

**技術棧**：Node.js v24 + Express + EJS + sql.js + express-session + multer + crypto

**解決的問題**：
- sql.js `last_insert_rowid()` 回傳 0 → 改以 username 查詢 ID
- Session ID 型別不一致 → Number() 強制轉型
- Port 3000 被佔用 → Get-NetTCPConnection + Stop-Process 清除

---

## homework-06 — JavaScript 函數實作 10 題

**路徑**：`homework-06/`（01.js ~ 10.js）

**說明**：聚焦 JavaScript 函數核心概念：

| # | 主題 | 關鍵技術 |
|---|------|----------|
| 1 | Callback 基礎 | 高階函數傳遞 callback |
| 2 | IIFE | 立即執行函數、私有變數 |
| 3 | 陣列 map | 箭頭函數折扣計算 |
| 4 | 破壞性修改 | `pop()` + `unshift()` |
| 5 | 閉包（Closure） | 函數回傳函數（multiplier） |
| 6 | 自製 filter | 手刻 myFilter（for-of） |
| 7 | 物件篩選 | `filter()` + 箭頭函數 |
| 8 | 參照陷阱 | Mutation vs Reassignment |
| 9 | 非同步延遲 | `setTimeout` |
| 10 | 綜合應用 | `reduce()` + discount callback |

**技術**：Callback, IIFE, Closure, Higher-Order Function, 非同步

---

## homework-07 — JavaScript 全方位實作 10 題

**路徑**：`homework-07/`（01.js ~ 10.js）

**說明**：偏向後端開發常用 JavaScript 模式：

| # | 主題 | 關鍵技術 |
|---|------|----------|
| 1 | 物件屬性存取 | Dot / Bracket Notation |
| 2 | 解構賦值 | `{ title, content } = req.body` |
| 3 | 陣列拼接 | `forEach` 組裝 HTML |
| 4 | 動態參數 | `obj.key = value` |
| 5 | Callback 傳參 | error-first callback |
| 6 | JSON 處理 | `JSON.parse()` |
| 7 | 模擬資料庫 | callback 模擬 SQL 查詢 |
| 8 | 樣板字串邏輯 | `user \|\| "Stranger"` |
| 9 | 陣列切片 | `.map()` + `.substring()` |
| 10 | 錯誤優先 | `if (err) return callback(err)` |

**技術**：Error-First Callback, 解構賦值, JSON, 樣板字串

---

## 期中專題 — 反應力挑戰賽

**路徑**：`期中/my-game-project/`

**說明**：5 秒點擊挑戰遊戲 — 在倒數 5 秒內瘋狂點擊按鈕，計算點擊次數並提交到排行榜。

**技術棧**：

| 層 | 技術 | 說明 |
|----|------|------|
| 前端 | Next.js + React + Tailwind CSS | 遊戲畫面、點擊邏輯、排行榜顯示 |
| 後端 | Express + Mongoose | RESTful API |
| 資料庫 | MongoDB（本地） | 儲存玩家暱稱與分數 |

**API 接口**：
- `GET /api/scores` — 獲取排行榜前 10 名
- `POST /api/scores` — 提交新成績（`{ username, score }`）

**心得**：學習 CORS 跨域處理、Mongoose Schema 設計、async/await 非同步 API 請求。

---

## 其他檔案

- `delete_dir.py` / `delete_helper.exe` — 輔助工具
