/**
 * 
 * @param {[string,number]} input 
 * @returns {string}
 */
function cesarCipher(input) {
    const word = input[0];
    const key = input[1];
    let result = ""
    for (let i = 0; i < word.length; i++) {
        let c = word.charCodeAt(i);
        if (c == 32) {
            result += " "
            continue
        }
        c -= key;
        if (c < 65) {
            c += 90 - 64
        }
        result += String.fromCharCode(c)


    }

    return result
}

export { cesarCipher }
