
/**
 * 
 * @param {number[]} a 
 * @returns {number}
 */
function maxSubarray(a) {
    const max = Math.max(...a)
    let best = [max];
    let bestSum = max;
    let current = [];
    let currentSum = 0;

    for (let i = 0; i < a.length; i++) {
        const e = a[i];
        const nextSum = currentSum + e;
        

        if (nextSum < 0) {
            if (currentSum > bestSum) {
                best = current
                bestSum = currentSum
            }
            current = []
            currentSum = 0;
            continue;
        }
        current = current.concat(e)
        currentSum = nextSum
        if(nextSum>bestSum){
            best = current
            bestSum = currentSum
        }
    }
    if(currentSum > bestSum){
        return currentSum;
    }
    return bestSum;
}

export{
    maxSubarray
}