<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9; }
        .container { max-width: 800px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        pre { background: #2d2d2d; color: #ccc; padding: 15px; border-radius: 5px; overflow-x: auto; }
        h1, h2 { color: #333; }
        .concept { background: #eef6ff; padding: 15px; border-left: 5px solid #3498db; margin: 20px 0; }
    </style>
</head>
<body>

<div class="container">
    <h1>JavaScript 函數練習與觀念總整理</h1>

    <pre><code>
/**
 * JavaScript 函數實作練習題 - 完整整合版
 */

// 1. Callback 基礎實作
function mathTool(num1, num2, action) {
  return action(num1, num2);
}
console.log(mathTool(10, 5, (a, b) => a + b)); // 15

// 2. 匿名函數與立即執行 (IIFE)
(function() {
  const count = 100;
  console.log("Count is: " + count);
})();

// 3. 箭頭函數與陣列轉換
const prices = [100, 200, 300, 400];
const discounted = prices.map(p => p * 0.8);

// 4. 陣列參數的「破壞性修改」
function cleanData(arr) {
  arr.pop();
  arr.unshift("Start");
}

// 5. 函數回傳函數 (Higher-Order Function)
const multiplier = factor => n => n * factor;
const double = multiplier(2);

// 6. Callback 篩選器
function myFilter(arr, callback) {
  const result = [];
  for (const item of arr) {
    if (callback(item)) result.push(item);
  }
  return result;
}

// 7. 箭頭函數處理物件
const users = [{name: "Alice", age: 25}, {name: "Bob", age: 17}];
const adults = users.filter(u => u.age >= 18);

// 8. 參數傳址陷阱：重新賦值 vs 修改
function process(a, b) {
  a.push(99); // 透過位址修改原陣列 (Mutation)
  b = [100];  // 重新指派變數指向新記憶體 (Reassignment)
}

// 9. 延遲執行的 Callback
setTimeout(() => console.log("Task Completed"), 2000);

// 10. 綜合應用：計算總價
function calculateTotal(cart, discountFunc) {
  const total = cart.reduce((acc, cur) => acc + cur, 0);
  return discountFunc(total);
}
    </code></pre>

    <div class="concept">
        <h2>核心概念：記憶體位址運作機制</h2>
        <p>在 JavaScript 中，物件與陣列是透過「參照 (Reference)」傳遞的。</p>
        
        <ul>
            <li><strong>修改內容 (Mutation)</strong>：使用方法（如 <code>.push()</code>）直接操作該記憶體位址的資料，外部參照會同步更新。</li>
            <li><strong>重新賦值 (Reassignment)</strong>：使用 <code>=</code> 運算子，會將變數的指向改為全新的記憶體位址，不影響原位址。</li>
        </ul>
    </div>
</div>

</body>
</html>