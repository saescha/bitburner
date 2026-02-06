
/**
 * 
 * @param {string} input 
 */
function generateIPs(input) {
    let results = [];

    function generateAt(index, current) {
        if (index == input.length) {
            if (current.length == 4) {
                results.push(current.join("."));
            }
            return;
        }
        for (let i = index + 1; i < input.length + 1 && index + 4; i++) {
            if(input.charAt(index)=="0") continue;
            const b = parseInt(input.substring(index, i))
            if (b > 255) continue;
            generateAt(i, [...current, b])
        }
    }
    generateAt(0, []);
    return results;
}

export {
    generateIPs
}