/**
 * 記憶體參照與重新賦值的概念解析
 */

let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  // 1. 修改物件內容 (Mutation)
  // 此時 'a' 與 'listA' 指向記憶體中同一個位址
  // 操作 'a' 等同於直接對 'listA' 指向的位址進行寫入
  a.push(99); 

  // 2. 重新賦值 (Reassignment)
  // 執行這行後，參數 'b' 的指向被更改為一個全新的陣列物件
  // 它與外部的 'listB' 原本指向的位址從此斷開連結
  b = [100]; 
}

process(listA, listB);

console.log("listA:", listA); // 輸出 [1, 2, 99]
console.log("listB:", listB); // 輸出 [3, 4]

/**
 * 核心觀念總結：
 * - 陣列/物件是透過「位址 (Reference)」傳遞的。
 * - 使用陣列方法（如 .push, .pop）會修改原始參照位址的資料。
 * - 使用等號 (=) 重新賦值，只是改變了變數指向的記憶體位置，不影響舊位址的資料。
 */