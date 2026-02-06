
/**
 * 
 * @param {string} input 
 * @returns {number}
 */
function hammingDecode(input) {
    const str = input.split("").map(x => {
        const r = parseInt(x);
        return r
    })

    let broken = 0
    for (let i = 1; i < str.length; i *= 2) {
        let p = 0;
        for (let j = i; j < str.length; j++) {
            p += str[j]
            if (j % i == i - 1) {
                j += i;
            }
        }
        if (p % 2 != 0) {
            broken += i
        }
    }
    if (broken > 0) {
        str[broken] = (str[broken] + 1) % 2
    }

    let resultString = ""
    for (let i = 1; i < str.length; i++) {
        if (isPowerOfTwo(i)) {
            continue;
        }
        resultString += str[i]
    }
    return parseInt(resultString, 2)
}

/**
 * 
 * @param {number} msg n
 */
function hammingEncode(msg) {
    let result = msg.toString(2).split("").map((v) => parseInt(v));
    let pattern = new Array(result.length).fill("_")
    result.splice(0, 0, 0)
    pattern.splice(0, 0, "P")
    for (let i = 1; i < result.length - 1; i *= 2) {
        result.splice(i, 0, 0)
        pattern.splice(i, 0, "P")
    }

    for (let i = result.length - 1; i > 0; i--) {
        if (result[i] != 1) {
            continue
        }
        result[0] = (result[0] + 1) % 2
        for (let j = 1; j < i; j *= 2) {
            if ((i - j) % (2 * j) < j) {
                result[j] = (result[j] + 1) % 2
            }
        }
    }
    return result.join("");
}

function isPowerOfTwo(x) {
    return Math.log2(x) % 1 === 0;
}
export { hammingDecode, hammingEncode }