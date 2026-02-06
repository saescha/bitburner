
/**
 * 
 * @param {BigInt} n 
 * @returns {BigInt}
 */
function squareRoot(n){

  if (n < 0n) throw new Error("square root of negative numbers is not supported");
  if (n < 2n) return n;

  // Step 1: floor sqrt via Newton's method
  let x0 = n;
  let x1 = (n >> 1n) + 1n;

  while (x1 < x0) {
    x0 = x1;
    x1 = (x1 + n / x1) >> 1n;
  }

  const lower = x0;
  const upper = lower + 1n;

  // Step 2: pick the closer one
  const lowerDiff = n - lower * lower;
  const upperDiff = upper * upper - n;

  return lowerDiff <= upperDiff ? lower : upper;
}
export{
    squareRoot
}