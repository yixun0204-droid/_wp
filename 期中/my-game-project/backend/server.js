const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 修正 1：請將下面的 <db_password> 替換成你在 MongoDB Atlas 設定的「資料庫使用者密碼」
// 修正 2：在網址最後面加上你的資料庫名稱（例如 gameDB），否則資料會被隨機塞進預設的 test 資料庫中
const dbURI = 'mongodb+srv://yixun0204_db_user:<db_password>@cluster0.ltsgs4t.mongodb.net/gameDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI)
  .then(() => console.log("雲端 MongoDB Atlas 資料庫連線成功！"))
  .catch(err => console.error("資料庫連線失敗，請檢查密碼或 Atlas IP 白名單設定:", err));
  
const ScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
}, { timestamps: true }); // 加這個可以自動記錄遊玩時間，以後想看日期很方便

const Score = mongoose.model('Score', ScoreSchema);

app.get('/api/scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }).limit(10);
        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: "無法獲取分數" });
    }
});

app.post('/api/scores', async (req, res) => {
    console.log("後端收到的請求資料 (req.body):", req.body);
    try {
        const { username, score } = req.body;
        const newScore = new Score({ username, score });
        await newScore.save();
        res.status(201).json(newScore);
    } catch (err) {
        res.status(500).json({ error: "無法儲存分數" });
    }
});

// 修正 3：雲端平台（例如 Render）部署時會動態指派 Port 號
// 不能寫死 5000，必須優先讀取 process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`後端伺服器運行於 port ${PORT}`));