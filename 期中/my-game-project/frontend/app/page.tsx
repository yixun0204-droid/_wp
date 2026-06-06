"use client";
import { useState, useEffect } from 'react';

export default function Game() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  // 基礎路徑正確定義
  const API_URL = "http://localhost:5000";

  const fetchScores = async () => {
    try {
      // 這裡直接請求 http://localhost:5000/api/scores
      const res = await fetch(`${API_URL}/api/scores`);
      if (!res.ok) throw new Error("獲取失敗");
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error("fetchScores 錯誤:", err);
    }
  };

  useEffect(() => { fetchScores(); }, []);

  const submitScore = async () => {
    if (!username) { alert("請輸入暱稱！"); return; }
    
    try {
      const res = await fetch(`${API_URL}/api/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score })
      });
      
      if (!res.ok) throw new Error("提交失敗");
      
      fetchScores();
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

  // ... (下方 return UI 部分不變)
  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">5秒點擊挑戰</h1>
      {/* ... 其餘 UI 同你原本的代碼 ... */}
      {!isPlaying ? (
        <div className="flex flex-col gap-4">
          <input className="border p-2 rounded" placeholder="請輸入暱稱" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button className="bg-blue-600 text-white py-2 rounded" onClick={() => { setScore(0); setTimeLeft(5); setIsPlaying(true); }}>開始挑戰</button>
        </div>
      ) : (
        <button className="bg-red-500 text-white w-full h-32 rounded-full text-2xl font-bold" onClick={() => setScore(score + 1)}>點擊我! ({score})</button>
      )}
      <p className="mt-4 text-center">剩餘時間: {timeLeft} 秒</p>
      <div className="mt-8">
        <h2 className="text-xl font-bold border-b pb-2">英雄榜</h2>
        <ul className="mt-2">{leaderboard.map((s: any, i) => <li key={i} className="flex justify-between py-1"><span>{s.username}</span><span className="font-mono font-bold">{s.score} 分</span></li>)}</ul>
      </div>
    </div>
  );
}