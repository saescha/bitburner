/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const start = Date.now()
    while (start + 5000 > Date.now()) {
        await ns.grow(String(ns.args[0]))
    }
}