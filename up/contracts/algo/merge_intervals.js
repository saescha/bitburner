
/**
 * 
 * @param {[Number,Number][]} input 
 * @returns {[Number,Number][]}
 */
function mergeIntervals(input) {
    const intervals = input.toSorted((a, b) => a[0] - b[0])

    let result = []
    let lastI = intervals[0];
    for (let index = 1; index < intervals.length; index++) {
        const i = intervals[index];
        if (lastI[1] >= i[0]) {
            if (i[1] > lastI[1]) {
                lastI[1] = i[1]
            }
        } else {
            result.push(lastI)
            lastI = intervals[index]
        }
    }
    result.push(lastI)
    return result;
}

export {
    mergeIntervals
}