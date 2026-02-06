/**
 * 
 * @param {string} input 
 * @returns {string}
 */
function compressRLE(input) {
    let result = "";
    let lastChar = input.charAt(0);
    let lastOcc = 1;

    for (let i = 1; i < input.length; i++) {
        let char = input.charAt(i);
        if (char != lastChar || lastOcc > 8) {
            result += lastOcc + lastChar;
            lastChar = char;
            lastOcc = 1;
        } else {
            lastOcc++;
        }
    }
    result += lastOcc + lastChar;
    return result
}

export { compressRLE }