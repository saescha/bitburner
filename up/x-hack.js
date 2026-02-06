/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const start = Date.now()
    while (start + 5000 > Date.now()) {
        await ns.hack(String(ns.args[0]))
    }
}