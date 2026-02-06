
/**
 * 
 * @param {[string,string]} input 
 * @returns {string}
 */
function vigenere(input) {
    const word = input[0]
    const key = input[1]
    let output = ""

    const A = "A".charCodeAt(0)
    const Z = "Z".charCodeAt(0)

    for (let i = 0; i < word.length; i++) {
        const code = (word.charCodeAt(i) + key.charCodeAt(i % key.length) - 2 * A) % (Z - A + 1) + A
        output += String.fromCharCode(code)

    }
    return output
}
export {vigenere}

