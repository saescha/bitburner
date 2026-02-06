


/**
 * 
 * @param {[number,number[]]} input 
 * @returns {number}
 */
function allSums2([sum, summands]) {
    let helperCache = {};
    function helper(remainingSum, index) {
        const cacheKey = `${remainingSum},${index}`;
        if (cacheKey in helperCache) {
            return helperCache[cacheKey];
        }
        // Base case: if remainingSum is 0, we found a valid combination
        if (remainingSum === 0) {
            return 1;
        }
        // If remainingSum is negative or no more summands left, no valid combination
        if (remainingSum < 0 || index >= summands.length) {
            return 0;
        }
        const result = helper(remainingSum - summands[index], index) + helper(remainingSum, index + 1);
        helperCache[cacheKey] = result;
        return result;
        //
    }

    return helper(sum, 0);
}

function allSums1(n){

  const p = Array(n + 1).fill(0);
  p[0] = 1;

  for (let k = 1; k <= n; k++) {
    for (let i = k; i <= n; i++) {
      p[i] += p[i - k];
    }
  }

  return p[n]-1;

}



export {
    allSums1,
    allSums2
}