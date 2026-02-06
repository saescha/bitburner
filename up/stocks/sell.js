/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const sm = ns.stock

    const shares = sm.getSymbols().forEach((s) => {
        const owned = sm.getPosition(s)
        if (owned[0] > 0) {
            sm.sellStock(s, owned[0])
        }
    });

}