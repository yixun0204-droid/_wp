# JavaScript 函數實作練習集

本文件包含了 10 個核心 JavaScript 函數練習題，涵蓋了回呼函式 (Callback)、陣列操作、閉包 (Closure) 以及記憶體管理機制。

## 練習題目總覽

| 題號 | 主題 | 關鍵技術 |
| :--- | :--- | :--- |
| 1 | Callback 基礎 | Callback 函式傳遞 |
| 2 | IIFE | 立即執行函數、私有變數 |
| 3 | 陣列轉換 | `map`、箭頭函數 |
| 4 | 破壞性修改 | `pop`, `unshift` |
| 5 | 高階函數 | 函數回傳函數、閉包 |
| 6 | 篩選器實作 | 陣列遍歷、Callback |
| 7 | 物件篩選 | `filter` 結合箭頭函數 |
| 8 | 參照陷阱 | Mutation vs Reassignment |
| 9 | 非同步處理 | `setTimeout` |
| 10 | 綜合應用 | `reduce`、折扣邏輯 |

---

## 程式碼實作

以下是所有練習題的完整程式碼：

```javascript
// 1. Callback 基礎
const mathTool = (num1, num2, action) => action(num1, num2);

// 2. IIFE (立即執行函數)
(() => { const count = 100; console.log("Count is:", count); })();

// 3. 陣列 map 轉換
const prices = [100, 200, 300, 400];
const discounted = prices.map(p => p * 0.8);

// 4. 破壞性修改
function cleanData(arr) { arr.pop(); arr.unshift("Start"); }

// 5. 高階函數 (Higher-Order Function)
const multiplier = factor => n => n * factor;

// 6. 篩選器實作 (myFilter)
function myFilter(arr, callback) {
  return arr.reduce((acc, item) => callback(item) ? [...acc, item] : acc, []);
}

// 7. 物件處理
const users = [{name: "Alice", age: 25}, {name: "Bob", age: 17}];
const adults = users.filter(u => u.age >= 18);

// 8. 參數傳址陷阱
// 修改會影響原物件，重新賦值僅影響函數內局部變數
function process(a, b) { a.push(99); b = [100]; }

// 9. 非同步延遲
setTimeout(() => console.log("Task Completed"), 2000);

// 10. 總價計算
const calculateTotal = (cart, discountFunc) => discountFunc(cart.reduce((a, b) => a + b, 0));