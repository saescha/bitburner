
/**
 * 
 * @param {string} input 
 * @returns {string[]}
 */
function sanitizeParentheses(input) {
    function removeAt(str, index) {
        return str.slice(0, index) + str.slice(index + 1);
    }
    let openAt = [];
    let closed = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char === '(') {
            openAt.push(i);
        } else if (char === ')') {
            if (openAt.length === 0) {
                continue;
            }
            closed++;
            if (closed >= openAt.length) {
                closed -= openAt.length;
                openAt = []
            }
        }
    }
    if (openAt.length > 0) {
        const results = [];
        for (let i of openAt) {
            results.push(...sanitizeParentheses(removeAt(input, i)));
        }
        return Array.from(new Set(results));
    }
    openAt = [];
    closed = 0;
    for (let i = input.length - 1; i >= 0; i--) {
        const char = input[i];
        if (char === ')') {
            openAt.push(i);
        } else if (char === '(') {
            closed++;
            if (closed >= openAt.length) {
                closed -= openAt.length;
                openAt = []
            }
        }
    }
    if (openAt.length > 0) {
        const results = [];
        for (let i of openAt) {
            results.push(...sanitizeParentheses(removeAt(input, i)));
        }
        return Array.from(new Set(results));
    }


    return [input];
}

export { sanitizeParentheses }