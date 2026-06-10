"use client";
import { useState, useEffect } from 'react';

interface ScoreItem {
  username: string;
  score: number;
}

export default function Game() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState<ScoreItem[]>([]);

  // 🎯 關鍵修改：請在這裡換上你的 Render 免費雲端後端網址（結尾不要加斜線 /）
  const API_URL = "https://yixun-game-api.onrender.com";

  // 1. 從雲端後端 API 獲取排行榜資料
  const fetchScores = async () => {
    try {
      const res = await fetch(`${API_URL}/api/scores`);
      if (!res.ok) throw new Error("獲取排行榜失敗");
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error("fetchScores 錯誤:", err);
    }
  };

  useEffect(() => { fetchScores(); }, []);

  // 2. 將新分數發送到雲端後端儲存
  const submitScore = async () => {
    if (!username) { alert("請輸入暱稱！"); return; }
    
    try {
      const res = await fetch(`${API_URL}/api/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score })
      });
      
      if (!res.ok) throw new Error("提交分數失敗");
      
      // 成功後重新抓取最新排行榜，並結束遊戲狀態
      await fetchScores();
      setIsPlaying(false);
    } catch (err) {
      console.error("submitScore 錯誤:", err);
    }
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      submitScore();
    }
  }, [isPlaying, timeLeft]);

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">5秒點擊挑戰</h1>
      
      {!isPlaying ? (
        <div className="flex flex-col gap-4">
          <input 
            className="border p-2 rounded" 
            placeholder="請輸入暱稱" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <button 
            className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition" 
            onClick={() => { setScore(0); setTimeLeft(5); setIsPlaying(true); }}
          >
            開始挑戰
          </button>
        </div>
      ) : (
        <button 
          className="bg-red-500 text-white w-full h-32 rounded-full text-2xl font-bold active:scale-95 transition-transform" 
          onClick={() => setScore(score + 1)}
        >
          點擊我! ({score})
        </button>
      )}
      
      <p className="mt-4 text-center font-semibold">剩餘時間: {timeLeft} 秒</p>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold border-b pb-2">🏆 全球即時英雄榜</h2>
        <ul className="mt-2">
          {leaderboard.length === 0 ? (
            <li className="text-gray-400 text-center py-2">目前尚無紀錄，快來挑戰！</li>
          ) : (
            leaderboard.map((s, i) => (
              <li key={i} className="flex justify-between py-1 border-b border-gray-100">
                <span>第 {i + 1} 名: {s.username}</span>
                <span className="font-mono font-bold text-blue-600">{s.score} 分</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}