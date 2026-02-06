
/**
 * 
 * @param {number[]} input
 * @returns {number} 
 */
function jumpArray(input) {

    let positions = [{
        "p": 0,
        "jumps": 0
    }];

    while (positions.length > 0) {
        const pos = positions.shift();
        const maxJump = input[pos.p];
        if (pos.p === input.length - 1) {
            return pos.jumps;
        }
        if (maxJump < 1) {
            continue;
        }
        for (let jump = maxJump; jump >= 1; jump--) {
            positions.push({
                "p": pos.p + jump,
                "jumps": pos.jumps + 1
            });
        }
    }
    return 0;
}

export {
    jumpArray
}