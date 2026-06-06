const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 請確保你有安裝並啟動 MongoDB，或使用 MongoDB Atlas
// 改成連線到你本機的資料庫，不要用雲端連線字串
mongoose.connect('mongodb://127.0.0.1:27017/gameDB')
  .then(() => console.log("本地資料庫連線成功"))
  .catch(err => console.error("資料庫連線失敗，請確認 MongoDB 服務是否開啟:", err));
  
const ScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
});
const Score = mongoose.model('Score', ScoreSchema);

app.get('/api/scores', async (req, res) => {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
});

app.post('/api/scores', async (req, res) => {

    console.log("後端收到的請求資料 (req.body):", req.body);

    const { username, score } = req.body;
    const newScore = new Score({ username, score });
    await newScore.save();
    res.status(201).json(newScore);
});

app.listen(5000, () => console.log('後端伺服器運行於 port 5000'));