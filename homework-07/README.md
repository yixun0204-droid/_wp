# JavaScript 全方位實作挑戰總整理

本文件涵蓋了從基礎語法到後端常見開發邏輯的 10 個核心練習，並附帶了記憶體與執行機制的觀念解析。

---

## 一、 核心練習題集

| 題號 | 題目 | 關鍵技術 |
| :--- | :--- | :--- |
| 1 | 物件屬性存取 | Dot/Bracket Notation |
| 2 | 物件解構賦值 | `{ title, content } = req.body` |
| 3 | 陣列遍歷與拼接 | `forEach`, Template Literals |
| 4 | 字典與動態參數 | `obj.key = value` |
| 5 | Callback 傳參 | 非同步資料傳遞 |
| 6 | JSON 處理 | `JSON.parse()` |
| 7 | 模擬資料庫查詢 | Error-First Callback |
| 8 | 樣板字串邏輯 | `${user || 'Stranger'}` |
| 9 | 陣列處理與切片 | `.map()`, `.substring()` |
| 10 | 錯誤優先模式 | `if (err) return ...` |

---

## 二、 完整程式碼總覽

```javascript
// 1. 物件存取
const post = { id: 1, title: "Hello", content: "World" };
console.log(post.title, post["title"]);

// 2. 解構賦值
const { title, content } = { body: { title: "JS", content: "Code" } }.body;

// 3. 陣列拼接
const posts = [{t: "A"}, {t: "B"}];
let html = ""; posts.forEach(p => html += `<div>${p.t}</div>`);

// 4. 動態參數
const params = {}; params.id = 99;

// 5. Callback 傳參
const fetchData = (id, cb) => cb(null, { id, status: "ok" });

// 6. JSON 處理
const obj = JSON.parse('{"tags": ["js", "node"]}');

// 7. 模擬 DB
const fakeGet = (sql, p, cb) => cb(null, { title: "Fake" });

// 8. 樣板邏輯
const user = "Guest";
const welcome = `<h1>Welcome, ${user || "Stranger"}</h1>`;

// 9. 陣列切片
const list = ["Very long string"];
const res = list.map(s => s.substring(0, 10) + "...");

// 10. 錯誤優先模式
const checkAdmin = (role, cb) => role !== "admin" ? cb("Denied") : cb(null, "Welcome");