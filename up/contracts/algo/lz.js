/**
 * 
 * @param {string} msg 
 * @returns {string}
 */

function lzDecompress(msg) {
    let result = ""
    let index = 0;


    while (index < msg.length) {
        let length = parseInt(msg.charAt(index))
        index++
        for (let i = 0; i < length; i++) {
            result += msg.charAt(index);
            index++;
        }
        //console.log(`D`,result)
        if (index >= msg.length) {
            break;
        }

        length = parseInt(msg.charAt(index))
        index++
        if (length == 0) {
            continue
        }
        let ref = parseInt(msg.charAt(index))
        index++
        let end = result.length

        for(let i=0;i<length;i++){
            result += result.charAt(end-ref+(i%ref))
        }
        //console.log(`R`,result)
    }

    return result
}
/**
 * @param {String} msg 
 * @returns {String}
 */
function lzCompress(msg) {
    let bestGlobal = Array(msg.length + 1).fill(null);

    function updateBest(pos, encoded) {
        for (let i = pos; i < bestGlobal.length; i++) {
            if (bestGlobal[i] != null && bestGlobal[i].length <= encoded.length) {
                return;
            }
        }
        bestGlobal[pos] = encoded;
    }

    function dataChunk(pos, encoded) {
        if (pos == msg.length) {
            return;
        }

        for (let len = Math.min(9, msg.length - pos); len >= 0; len--) {
            if (len === 0 && (pos == 0 || encoded.endsWith("0"))) {
                continue;
            }
            const chunk = `${len}${msg.substring(pos, pos + len)}`;
            refChunk(pos + len, encoded + chunk);
        }
    }
    function refChunk(pos, encoded) {
        if (pos == msg.length) {
            updateBest(pos, encoded);
            return;
        }

        for (let len = Math.min(9, msg.length - pos); len > 1; len--) {
            const seek = msg.substring(pos, pos + len);
            for (let ref = 1; ref <= 9 && ref <= pos; ref++) {
                if (len < ref) {
                    if (msg.substring(pos - ref, pos - ref + len) === seek) {
                        updateBest(pos + len, encoded + `${len}${ref}`);
                    }
                }
                let sub = msg.substring(pos - ref, pos);
                while (sub.length <= len) {
                    sub += sub;
                }
                sub = sub.substring(0, len);
                if (sub === seek) {
                    updateBest(pos + len, encoded + `${len}${ref}`);
                }
            }
        }
        updateBest(pos, encoded + `0`);
    }
    dataChunk(0, "");
    for (let i = 0; i < bestGlobal.length; i++) {
        const entry = bestGlobal[i];
        if (entry != null) {
            dataChunk(i, entry);
        }
    }
    return bestGlobal[msg.length];
}

export{
    lzDecompress,
    lzCompress
}