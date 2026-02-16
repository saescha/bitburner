/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    ns.getPurchasedServers().forEach(h => ns.killall(h))
}
