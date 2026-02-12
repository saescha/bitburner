/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    while (true)
        await ns.weaken(String(ns.args[0]))
}