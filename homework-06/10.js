function calculateTotal(cart, discountFunc) {
  const total = cart.reduce((acc, cur) => acc + cur, 0);
  return discountFunc(total);
}
console.log(calculateTotal([100, 200, 300], sum => sum - 50)); // 550