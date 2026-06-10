import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',       // 🎯 告訴 Next.js 把網頁打包成靜態 HTML 檔案
  basePath: '/_wp',       // 🎯 告訴 Next.js 你的 GitHub 專案倉庫名稱
  images: {
    unoptimized: true,    // 靜態導出必須關閉圖片優化
  },
};

export default nextConfig;