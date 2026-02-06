
/**
 * 
 * @param {[number,number[]]} input 
 */
function stockTrader(input) {
  const n = input[0];
  const prices = input[1];
  if (!prices.length || n === 0) return 0;

  // Optimization: If n is large enough to cover every price dip, 
  // it's effectively unlimited transactions.
  if (n >= prices.length / 2) {
    let totalProfit = 0;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i - 1]) {
        totalProfit += prices[i] - prices[i - 1];
      }
    }
    return totalProfit;
  }

  // Initialize DP arrays
  // hold[j] = max profit with j transactions and 1 share in hand
  // sell[j] = max profit with j transactions and 0 shares in hand
  const hold = new Array(n + 1).fill(-Infinity);
  const sell = new Array(n + 1).fill(0);

  for (let price of prices) {
    for (let j = 1; j <= n; j++) {
      // Update hold: Max of (already holding) or (selling previously and buying now)
      hold[j] = Math.max(hold[j], sell[j - 1] - price);

      // Update sell: Max of (already sold/idle) or (holding and selling now)
      sell[j] = Math.max(sell[j], hold[j] + price);
    }
  }

  return sell[n];
}

export {
    stockTrader
}