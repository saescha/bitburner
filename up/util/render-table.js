
/**
 * 
 * @param {function (string):void} print 
 * @param {Object[]} content 
 */
function renderTable(print, content) {
    if (content.length === 0) {
        throw new Error("empty table")
    }

    const keys = Object.keys(content[0])


    let colWidths = keys.map((k) => Math.max(k.length, ...content.map(r => fmt(r[k]).length)))
    console.log(colWidths)

    const sep = colWidths.reduce((p, c) => p + "-".repeat(c + 2) + "+", "+")
    print(sep)
    print(keys.reduce((p, c, i) => p + " " + c + " ".repeat(colWidths[i] - c.length) + " |", "|"))
    print(sep)
    for (const row of content) {
        print(keys.reduce((p, c, i) => p + " " + fmt(row[c]) + " ".repeat(colWidths[i] - fmt(row[c]).length) + " |", "|"))
    }
    print(sep)
}
function fmt(value) {
    if (typeof value != "number") return String(value);

    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    const units = [
        { limit: 1e15, suffix: 'q' },
        { limit: 1e12, suffix: 't' },
        { limit: 1e9, suffix: 'b' },
        { limit: 1e6, suffix: 'm' },
        { limit: 1e3, suffix: 'k' },
    ];

    for (const u of units) {
        if (abs >= u.limit) {
            const num = abs / u.limit;
            return sign + format(num) + u.suffix;
        }
    }

    return sign + format(abs);
}

function format(num) {
    return num
        .toFixed(2)               // max two decimals
        .replace(/\.?0+$/, '');   // remove trailing zeros
}
export {
    fmt,
    renderTable
}

